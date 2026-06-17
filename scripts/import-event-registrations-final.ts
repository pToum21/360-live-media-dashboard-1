import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

async function importEventRegistrations() {
  console.log('📊 Importing Event Registration Data...\n')
  
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
  console.log('✅ Deleted old registration data\n')
  
  // Read the Excel file
  const workbook = XLSX.readFile('excel-analysis/360-ATC-MarketingDashboardATC2026.xlsx')
  const sheet = workbook.Sheets['Total Registrations']
  const data: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false })
  
  // Row 9 (index 8) has the date ranges: "1/5 - 1/11", "1/12 - 1/18", etc.
  // Row 35 (index 34) has "Cumulative Total Attendees" with values for 2026
  
  const dateRow = data[8] as any[] // Row 9: "2026 DATES ->>>"
  const cumulativeRow = data[34] as any[] // Row 35: "2026" cumulative total attendees
  
  console.log('📅 Extracting dates and registrations...\n')
  
  let count = 0
  
  // Start from column 2 (index 1) where data begins
  for (let col = 1; col < dateRow.length && col < cumulativeRow.length; col++) {
    const dateRange = dateRow[col]
    const total = cumulativeRow[col]
    
    if (!dateRange || !total) continue
    
    try {
      // Parse date range like "1/5 - 1/11" to get the start date "1/5"
      const dateStr = String(dateRange).trim()
      const startDateStr = dateStr.split('-')[0].trim()
      
      // Parse "1/5" as "1/5/2026"
      const parts = startDateStr.split('/')
      if (parts.length !== 2) continue
      
      const month = parseInt(parts[0]) - 1 // JS months are 0-indexed
      const day = parseInt(parts[1])
      const year = 2026
      
      if (isNaN(month) || isNaN(day)) continue
      
      const date = new Date(year, month, day)
      const totalNum = parseInt(String(total))
      
      if (isNaN(totalNum) || totalNum < 0) continue
      
      await prisma.eventRegistration.create({
        data: {
          clientId: client.id,
          date,
          totalRegistrations: totalNum,
          createdById: user.id,
        },
      })
      
      console.log(`✅ ${date.toLocaleDateString()}: ${totalNum} total registrations`)
      count++
      
    } catch (error: any) {
      console.error(`❌ Error processing column ${col}:`, error.message)
    }
  }
  
  console.log(`\n✅ Successfully imported ${count} registration records`)
}

importEventRegistrations()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
