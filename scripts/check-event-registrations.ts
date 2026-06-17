import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkEventRegistrations() {
  const atc = await prisma.client.findUnique({
    where: { slug: 'atc-2026' },
  })

  if (!atc) {
    console.log('No ATC client found')
    return
  }

  const regs = await prisma.eventRegistration.findMany({
    where: { clientId: atc.id },
    orderBy: { date: 'desc' },
  })

  console.log(`\n📊 ATC Event Registrations: ${regs.length} records\n`)
  
  regs.forEach((r, i) => {
    console.log(`${i + 1}. Date: ${r.date}`)
    console.log(`   Total: ${r.totalRegistrations}`)
    console.log(`   Paid: ${r.paidRegistrations || 'N/A'}`)
    console.log(`   Comp: ${r.compRegistrations || 'N/A'}`)
    console.log(`   Revenue: ${r.revenue || 'N/A'}`)
    console.log(`   Goal %: ${r.percentOfGoal || 'N/A'}`)
    console.log('')
  })
}

checkEventRegistrations()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
