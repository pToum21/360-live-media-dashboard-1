import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Importing Pass Type Data...\n')

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
  const sheet = workbook.Sheets['Pass Types']
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[]

  // Delete existing pass type data for this client
  await prisma.passType.deleteMany({
    where: { clientId: client.id }
  })

  console.log('✅ Cleared existing pass type data\n')

  // 2024 data (rows 3-13, column 2)
  const passTypes2024 = [
    { type: 'Member Doctoral', count: 1030, isPaid: true },
    { type: 'Non-Member', count: 649, isPaid: true },
    { type: 'Member Non-MD Doctoral', count: 313, isPaid: true },
    { type: 'Member Non-Doctoral', count: 298, isPaid: true },
    { type: 'Member trainee', count: 492, isPaid: true },
    { type: 'Exhibitor', count: 280, isPaid: false },
    { type: 'Speaker In-Person', count: 274, isPaid: false },
    { type: 'Member Senior Emeritus', count: 15, isPaid: true },
    { type: 'Medical Student', count: 101, isPaid: true },
    { type: 'Patient', count: 31, isPaid: false },
    { type: 'Media', count: 8, isPaid: false }
  ]

  // 2023 data (rows 44-52)
  const passTypes2023 = [
    { type: 'Member', count: 2746, isPaid: true },
    { type: 'Non-Member', count: 1336, isPaid: true },
    { type: 'Exhibitor', count: 411, isPaid: false },
    { type: 'Press', count: 23, isPaid: false },
    { type: 'Unknown', count: 522, isPaid: true },
    { type: 'Dual', count: 192, isPaid: true },
    { type: 'ATC staff', count: 10, isPaid: false }
  ]

  let imported = 0

  // Import 2024 data
  for (const pt of passTypes2024) {
    await prisma.passType.create({
      data: {
        clientId: client.id,
        passTypeName: pt.type,
        registrationCount: pt.count,
        isPaid: pt.isPaid,
        year: 2024,
        percentOfTotal: pt.count / passTypes2024.reduce((sum, p) => sum + p.count, 0),
        createdById: user.id
      }
    })
    imported++
  }

  console.log(`✅ Imported ${imported} pass type records for 2024`)
  imported = 0

  // Import 2023 data
  for (const pt of passTypes2023) {
    await prisma.passType.create({
      data: {
        clientId: client.id,
        passTypeName: pt.type,
        registrationCount: pt.count,
        isPaid: pt.isPaid,
        year: 2023,
        percentOfTotal: pt.count / passTypes2023.reduce((sum, p) => sum + p.count, 0),
        createdById: user.id
      }
    })
    imported++
  }

  console.log(`✅ Imported ${imported} pass type records for 2023`)

  // Calculate and display totals
  const paid2024 = passTypes2024.filter(p => p.isPaid).reduce((sum, p) => sum + p.count, 0)
  const comp2024 = passTypes2024.filter(p => !p.isPaid).reduce((sum, p) => sum + p.count, 0)
  const total2024 = paid2024 + comp2024

  const paid2023 = passTypes2023.filter(p => p.isPaid).reduce((sum, p) => sum + p.count, 0)
  const comp2023 = passTypes2023.filter(p => !p.isPaid).reduce((sum, p) => sum + p.count, 0)
  const total2023 = paid2023 + comp2023

  console.log('\n📊 Summary:')
  console.log('\n2024:')
  console.log(`  Paid: ${paid2024} (${((paid2024 / total2024) * 100).toFixed(1)}%)`)
  console.log(`  Comp: ${comp2024} (${((comp2024 / total2024) * 100).toFixed(1)}%)`)
  console.log(`  Total: ${total2024}`)
  
  console.log('\n2023:')
  console.log(`  Paid: ${paid2023} (${((paid2023 / total2023) * 100).toFixed(1)}%)`)
  console.log(`  Comp: ${comp2023} (${((comp2023 / total2023) * 100).toFixed(1)}%)`)
  console.log(`  Total: ${total2023}`)

  console.log('\n🎉 Pass type data import complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
