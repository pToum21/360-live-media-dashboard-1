import * as XLSX from 'xlsx';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const filePath = path.join(
  process.cwd(),
  'excel-analysis',
  '2026 ATC Marketing & Communications Calendar.xlsx'
);

const categoryColors: Record<string, string> = {
  'Important Date': '#FF6B6B',
  'ATC Attendee Marketing': '#4ECDC4',
  'ATC Exhibitor Marketing': '#45B7D1',
  'ASTS Email & Social Marketing': '#96CEB4',
  'AST Email & Social Marketing': '#FFEAA7',
  'ATC Public Relations': '#DFE6E9',
  'ATC Site Update': '#A29BFE',
};

interface ParsedEvent {
  date: Date;
  title: string;
  category?: string;
  description?: string;
}

function parseMonthYear(sheetName: string): { month: number; year: number } {
  const parts = sheetName.split(' ');
  const monthName = parts[0];
  const year = parseInt(parts[1]);
  
  const monthMap: Record<string, number> = {
    'Jan': 0, 'January': 0,
    'Feb': 1, 'February': 1,
    'March': 2,
    'April': 3,
    'May': 4,
    'June': 5,
    'July': 6,
    'Aug': 7, 'August': 7,
    'Sept': 8, 'September': 8,
    'Oct': 9, 'October': 9,
    'Nov': 10, 'November': 10,
    'Dec': 11, 'December': 11,
  };
  
  const month = monthMap[monthName];
  return { month, year };
}

function parseCalendarSheet(sheet: XLSX.WorkSheet, sheetName: string): ParsedEvent[] {
  const events: ParsedEvent[] = [];
  const { month, year } = parseMonthYear(sheetName);
  
  // Parse as 2D array
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: '',
    raw: false,
  }) as string[][];
  
  // Find header row (SUN, MON, TUES, etc.)
  let headerRowIdx = -1;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row.some(cell => cell && cell.toString().toUpperCase() === 'SUN')) {
      headerRowIdx = i;
      break;
    }
  }
  
  if (headerRowIdx === -1) {
    console.log(`No header row found in ${sheetName}`);
    return events;
  }
  
  console.log(`\n=== Processing ${sheetName} (Year: ${year}, Month: ${month}) ===`);
  console.log(`Header row at index: ${headerRowIdx}`);
  
  // Get the first day of the month to know what day of week it starts on
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  console.log(`First day of ${sheetName} is day of week: ${firstDayOfWeek} (0=Sun, 1=Mon, etc.)`);
  
  // Process calendar weeks (rows after header)
  const calendarStartRow = headerRowIdx + 1;
  const weeksToProcess = 6; // Most months fit in 6 weeks
  
  for (let weekIdx = 0; weekIdx < weeksToProcess; weekIdx++) {
    const weekRowStart = calendarStartRow + (weekIdx * 3); // Each week typically spans 3 rows in the layout
    
    // Process each day of the week (7 columns)
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      // Calculate what date this cell represents
      const daysFromStart = (weekIdx * 7) + dayOfWeek - firstDayOfWeek;
      const dayOfMonth = daysFromStart + 1;
      
      // Skip if this date is outside the valid range
      if (dayOfMonth < 1 || dayOfMonth > 31) continue;
      
      // Check if this date exists in this month
      const testDate = new Date(year, month, dayOfMonth);
      if (testDate.getMonth() !== month) continue;
      
      // Look for events in this cell (check a few rows for this day's column)
      const colIdx = dayOfWeek; // Column index matches day of week (0-6)
      
      for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
        const rowIdx = weekRowStart + rowOffset;
        if (rowIdx >= data.length) break;
        
        const cellValue = data[rowIdx]?.[colIdx];
        if (!cellValue) continue;
        
        const trimmed = cellValue.toString().trim();
        if (!trimmed || trimmed.length < 3) continue;
        
        // Skip date numbers and day headers
        if (/^\d+$/.test(trimmed)) continue;
        if (/^(SUN|MON|TUES|WED|THURS|FRI|SAT|NOTES)$/i.test(trimmed)) continue;
        
        // This is an event!
        const eventDate = new Date(year, month, dayOfMonth);
        
        // Categorize based on keywords
        let category = 'General';
        const lower = trimmed.toLowerCase();
        if (lower.includes('email')) {
          category = 'ATC Attendee Marketing';
        } else if (lower.includes('social') || lower.includes('post')) {
          category = 'ATC Attendee Marketing';
        } else if (lower.includes('exhibitor')) {
          category = 'ATC Exhibitor Marketing';
        } else if (lower.includes('program')) {
          category = 'ATC Attendee Marketing';
        } else if (lower.includes('day') && !lower.includes('email')) {
          category = 'Important Date';
        } else if (lower.includes('website')) {
          category = 'ATC Site Update';
        }
        
        events.push({
          date: eventDate,
          title: trimmed,
          category,
          description: '',
        });
        
        console.log(`  ${eventDate.toISOString().split('T')[0]} (Day ${dayOfMonth}): ${trimmed.substring(0, 50)}`);
      }
    }
  }
  
  return events;
}

async function importCalendar() {
  console.log('=== IMPROVED CALENDAR IMPORT ===');
  console.log('Reading file:', filePath);
  
  const workbook = XLSX.readFile(filePath);
  console.log(`Found ${workbook.SheetNames.length} sheets`);
  
  const client = await prisma.client.findUnique({
    where: { slug: 'atc-2026' }
  });
  
  if (!client) {
    console.error('Client atc-2026 not found!');
    return;
  }
  
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No users found!');
    return;
  }
  
  console.log(`Using client: ${client.name}`);
  console.log(`Using user: ${user.email}`);
  
  // Delete existing events first
  console.log('\nDeleting existing calendar events...');
  const deleted = await prisma.calendarEvent.deleteMany({
    where: { clientId: client.id }
  });
  console.log(`Deleted ${deleted.count} existing events`);
  
  let totalEvents = 0;
  const allEvents: ParsedEvent[] = [];
  
  // Process all sheets
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const events = parseCalendarSheet(sheet, sheetName);
    allEvents.push(...events);
    totalEvents += events.length;
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total events found: ${totalEvents}`);
  
  // Import to database
  console.log(`\nImporting ${allEvents.length} events to database...`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const event of allEvents) {
    try {
      await prisma.calendarEvent.create({
        data: {
          date: event.date,
          title: event.title,
          description: event.description || '',
          category: event.category,
          color: categoryColors[event.category || 'General'] || '#95A5A6',
          allDay: true,
          status: 'Planned',
          clientId: client.id,
          createdById: user.id,
        },
      });
      imported++;
      
      if (imported % 10 === 0) {
        process.stdout.write(`\rImported: ${imported}/${allEvents.length}`);
      }
    } catch (error) {
      console.error(`\nError importing event "${event.title}":`, error);
      skipped++;
    }
  }
  
  console.log(`\n\n=== IMPORT COMPLETE ===`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${allEvents.length}`);
}

importCalendar()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
