import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

async function reimportEventRegistrations() {
  console.log('🔄 Re-importing Event Registration Data...\n')
  
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
  
  if (!workbook.SheetNames.includes('Total Registrations')) {
    console.log('❌ Total Registrations sheet not found')
    return
  }
  
  const sheet = workbook.Sheets['Total Registrations']
  const data: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false })
  
  console.log('📊 Analyzing sheet structure...')
  
  // Find the row that starts with actual dates (look for "2024" or "2026" years)
  let dataStartRow = -1
  for (let i = 0; i < Math.min(20, data.length); i++) {
    const row = data[i] as any[]
    if (row[0]) {
      const str = String(row[0])
      // Look for date patterns like "5/1/2026" or dates that include "2024" or "2026"
      if (str.includes('2024') || str.includes('2026') || str.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
        dataStartRow = i
        console.log(`✅ Found data starting at row ${i + 1}: "${str}"`)
        break
      }
    }
  }
  
  if (dataStartRow === -1) {
    console.log('❌ Could not find data start row')
    return
  }
  
  let count = 0
  const currentYear = 2026 // ATC 2026
  
  console.log('\n📅 Importing registrations...\n')
  
  // Import data starting from the detected row
  for (let i = dataStartRow; i < data.length; i++) {
    const row = data[i] as any[]
    if (!row[0] || !row[1]) continue
    
    try {
      const dateStr = String(row[0]).trim()
      const totalStr = String(row[1]).trim()
      
      // Skip non-numeric totals
      const total = parseInt(totalStr)
      if (isNaN(total) || total <= 0) continue
      
      // Parse the date
      let date: Date | null = null
      
      // Try parsing as "M/D/YYYY" format
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1 // JS months are 0-indexed
        const day = parseInt(parts[1])
        const year = parseInt(parts[2])
        
        if (!isNaN(month) && !isNaN(day) && !isNaN(year) && year >= 2020 && year <= 2030) {
          date = new Date(year, month, day)
        }
      }
      
      if (!date || isNaN(date.getTime())) {
        console.warn(`⚠️  Skipping row ${i + 1}: Invalid date "${dateStr}"`)
        continue
      }
      
      await prisma.eventRegistration.create({
        data: {
          clientId: client.id,
          date,
          totalRegistrations: total,
          createdById: user.id,
        },
      })
      
      console.log(`✅ Row ${i + 1}: ${date.toLocaleDateString()} - ${total} registrations`)
      count++
      
    } catch (error: any) {
      console.error(`❌ Error at row ${i + 1}:`, error.message)
    }
  }
  
  console.log(`\n✅ Successfully imported ${count} registration records`)
}

reimportEventRegistrations()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
