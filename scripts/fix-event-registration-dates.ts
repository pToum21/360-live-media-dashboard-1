import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

// Better Excel date converter
function excelDateToJSDate(serial: any): Date {
  if (serial instanceof Date) return serial
  if (typeof serial === 'string') {
    const parsed = new Date(serial)
    if (!isNaN(parsed.getTime())) return parsed
  }
  
  // Excel serial date conversion (days since 1900-01-01)
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  
  // If year is less than 1900 or greater than 2100, something went wrong
  const year = date_info.getUTCFullYear()
  if (year < 1900 || year > 2100) {
    console.warn(`Invalid year detected: ${year} for serial ${serial}`)
    // Try treating it as a different format
    return new Date(2025, 6, 17) // Default to July 17, 2025
  }
  
  return new Date(date_info.getUTCFullYear(), date_info.getUTCMonth(), date_info.getUTCDate())
}

async function fixEventRegistrations() {
  console.log('🔧 Fixing Event Registration Dates...\n')
  
  const client = await prisma.client.findUnique({
    where: { slug: 'atc-2026' },
  })
  
  if (!client) {
    console.log('❌ ATC client not found')
    return
  }
  
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log('❌ No user found')
    return
  }
  
  // Delete old registration data
  await prisma.eventRegistration.deleteMany({
    where: { clientId: client.id },
  })
  console.log('✅ Deleted old registration data')
  
  // Re-import from Excel
  const workbook = XLSX.readFile('excel-analysis/360-ATC-MarketingDashboardATC2026.xlsx')
  
  if (!workbook.SheetNames.includes('Total Registrations')) {
    console.log('❌ Total Registrations sheet not found')
    return
  }
  
  const sheet = workbook.Sheets['Total Registrations']
  const data: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  
  let count = 0
  console.log('\n📊 Importing registrations...')
  
  // Start from row 4 (skip headers)
  for (let i = 4; i < data.length; i++) {
    const row = data[i] as any[]
    if (!row[0]) continue
    
    try {
      // Column A is the date, Column B is total registrations
      let date: Date
      
      if (typeof row[0] === 'string') {
        // Try parsing as string date
        date = new Date(row[0])
      } else if (typeof row[0] === 'number') {
        // Excel serial number
        date = excelDateToJSDate(row[0])
      } else {
        continue
      }
      
      // Validate date
      if (isNaN(date.getTime()) || date.getFullYear() < 2020 || date.getFullYear() > 2030) {
        console.warn(`Skipping invalid date at row ${i + 1}: ${row[0]}`)
        continue
      }
      
      const total = parseInt(row[1]) || 0
      
      if (total > 0) {
        await prisma.eventRegistration.create({
          data: {
            clientId: client.id,
            date,
            totalRegistrations: total,
            createdById: user.id,
          },
        })
        console.log(`  ✅ Row ${i + 1}: ${date.toLocaleDateString()} - ${total} registrations`)
        count++
      }
    } catch (error: any) {
      console.error(`Error at row ${i + 1}:`, error.message)
    }
  }
  
  console.log(`\n✅ Successfully imported ${count} registration records`)
}

fixEventRegistrations()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
