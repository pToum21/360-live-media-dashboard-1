import * as XLSX from 'xlsx';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const filePath = path.join(
  process.cwd(),
  'excel-analysis',
  '2026 ATC Marketing & Communications Calendar.xlsx'
);

// Color mapping for categories (matching typical marketing calendar colors)
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
  // Sheet names like "June 2025", "July 2025", etc.
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
  
  // Get the range of the sheet
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  
  // Parse as 2D array for easier processing
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: '',
    raw: false,
  }) as string[][];
  
  // Find the row with day headers (SUN, MON, TUES, etc.)
  let headerRowIdx = -1;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row.some(cell => cell && (cell.toString().toUpperCase() === 'SUN' || cell.toString().toUpperCase() === 'MON'))) {
      headerRowIdx = i;
      break;
    }
  }
  
  if (headerRowIdx === -1) {
    console.log(`No header row found in ${sheetName}`);
    return events;
  }
  
  console.log(`\nProcessing ${sheetName} (headerRow: ${headerRowIdx})`);
  
  // Process calendar grid (starting from row after header)
  const calendarStartRow = headerRowIdx + 1;
  let currentDay: number | null = null;
  let currentCol = -1;
  
  // Track date to column mapping
  const dateColMap = new Map<number, number>();
  
  for (let rowIdx = calendarStartRow; rowIdx < data.length && rowIdx < calendarStartRow + 30; rowIdx++) {
    const row = data[rowIdx];
    
    // Check each cell in the row
    for (let colIdx = 0; colIdx < Math.min(row.length, 8); colIdx++) {
      const cellValue = row[colIdx];
      
      if (!cellValue || cellValue.toString().trim() === '') {
        continue;
      }
      
      const trimmed = cellValue.toString().trim();
      
      // Check if this cell contains a date number (1-31)
      const dayNum = parseInt(trimmed);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31 && trimmed.length <= 2) {
        currentDay = dayNum;
        currentCol = colIdx;
        dateColMap.set(dayNum, colIdx);
        continue;
      }
      
      // If we have a current day and this cell has content, it's likely an event
      // Events are typically in cells below or near date numbers
      if (trimmed.length > 2 && !trimmed.match(/^(SUN|MON|TUES|WED|THURS|FRI|SAT)$/i)) {
        // Determine which date this event belongs to
        // Look for nearest date above or to the left
        let eventDay = currentDay;
        
        // If no current day, search upwards in same column
        if (!eventDay) {
          for (let searchRow = rowIdx - 1; searchRow >= calendarStartRow && searchRow < calendarStartRow + 25; searchRow--) {
            const searchCell = data[searchRow]?.[colIdx];
            if (searchCell) {
              const searchNum = parseInt(searchCell.toString().trim());
              if (!isNaN(searchNum) && searchNum >= 1 && searchNum <= 31) {
                eventDay = searchNum;
                break;
              }
            }
          }
        }
        
        // If still no day, try to find from column mapping
        if (!eventDay) {
          for (const [day, col] of dateColMap.entries()) {
            if (col === colIdx) {
              eventDay = day;
              break;
            }
          }
        }
        
        if (eventDay && eventDay >= 1 && eventDay <= 31) {
          try {
            const eventDate = new Date(year, month, eventDay);
            
            // Categorize based on keywords in the event title
            let category = 'General';
            if (trimmed.toLowerCase().includes('email')) {
              category = 'ATC Attendee Marketing';
            } else if (trimmed.toLowerCase().includes('social')) {
              category = 'ATC Attendee Marketing';
            } else if (trimmed.toLowerCase().includes('post')) {
              category = 'ATC Attendee Marketing';
            } else if (trimmed.toLowerCase().includes('exhibitor')) {
              category = 'ATC Exhibitor Marketing';
            } else if (trimmed.toLowerCase().includes('program')) {
              category = 'ATC Attendee Marketing';
            } else if (trimmed.toLowerCase().includes('day')) {
              category = 'Important Date';
            }
            
            events.push({
              date: eventDate,
              title: trimmed,
              category,
              description: '',
            });
            
            console.log(`  Found: ${eventDate.toISOString().split('T')[0]} - ${trimmed.substring(0, 50)}`);
          } catch (error) {
            console.log(`  Error creating date for day ${eventDay} in ${sheetName}:`, error);
          }
        }
      }
    }
  }
  
  return events;
}

async function importCalendar() {
  console.log('=== CALENDAR IMPORT ===');
  console.log('Reading file:', filePath);
  
  const workbook = XLSX.readFile(filePath);
  console.log(`Found ${workbook.SheetNames.length} sheets`);
  
  // Find the ATC client
  const client = await prisma.client.findUnique({
    where: { slug: 'atc-2026' }
  });
  
  if (!client) {
    console.error('Client atc-2026 not found!');
    return;
  }
  
  console.log(`Using client: ${client.name} (${client.slug})`);
  
  // Find a user to associate with imports
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No users found in database!');
    return;
  }
  
  console.log(`Using user: ${user.email}`);
  
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
