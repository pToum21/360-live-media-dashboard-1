import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Importing Historical Registration Data (2023, 2024, 2026)...\n')

  // Get ATC client
  const client = await prisma.client.findUnique({
    where: { slug: 'atc-2026' }
  })

  if (!client) {
    console.log('❌ ATC client not found')
    return
  }

  // Get any user for createdBy
  const user = await prisma.user.findFirst()

  if (!user) {
    console.log('❌ No user found')
    return
  }

  // Read Excel file
  const workbook = XLSX.readFile('excel-analysis/360-ATC-MarketingDashboardATC2026.xlsx')
  const sheet = workbook.Sheets['Total Registrations']
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[]

  // Row 10 = 2023 data
  // Row 11 = 2024 data
  // Row 12 = 2026 data
  // Columns start at index 1 (skip the year label in column 0)

  const year2023Data = data[9] as number[] // Row 10 (0-indexed = 9)
  const year2024Data = data[10] as number[] // Row 11
  const year2026Data = data[11] as number[] // Row 12

  console.log('2023 data points:', year2023Data.filter(n => typeof n === 'number').length)
  console.log('2024 data points:', year2024Data.filter(n => typeof n === 'number').length)
  console.log('2026 data points:', year2026Data.filter(n => typeof n === 'number').length)

  // Delete existing historical registration data (keep only 2026)
  await prisma.eventRegistration.deleteMany({
    where: {
      clientId: client.id,
      date: {
        lt: new Date('2026-01-01')
      }
    }
  })

  console.log('\n✅ Cleared old historical data')

  let imported = 0

  // Import 2023 data
  for (let col = 1; col < year2023Data.length; col++) {
    const value = year2023Data[col]
    if (typeof value === 'number' && value > 0) {
      // Use week number to create a date
      const weekNum = col
      const date = new Date(2023, 0, 1 + (weekNum * 7)) // Jan 1 2023 + weeks

      await prisma.eventRegistration.create({
        data: {
          clientId: client.id,
          date,
          totalRegistrations: value,
          createdById: user.id
        }
      })
      imported++
    }
  }

  console.log(`✅ Imported ${imported} records for 2023`)
  imported = 0

  // Import 2024 data
  for (let col = 1; col < year2024Data.length; col++) {
    const value = year2024Data[col]
    if (typeof value === 'number' && value > 0) {
      const weekNum = col
      const date = new Date(2024, 0, 1 + (weekNum * 7))

      await prisma.eventRegistration.create({
        data: {
          clientId: client.id,
          date,
          totalRegistrations: value,
          createdById: user.id
        }
      })
      imported++
    }
  }

  console.log(`✅ Imported ${imported} records for 2024`)

  console.log('\n🎉 Historical registration data import complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
