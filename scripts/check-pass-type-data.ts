import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const atcClient = await prisma.client.findUnique({
    where: { slug: 'atc-2026' }
  })

  if (!atcClient) {
    console.log('ATC client not found')
    return
  }

  console.log('=== ATC Pass Types ===')
  const passTypes = await prisma.passType.findMany({
    where: { clientId: atcClient.id },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Found ${passTypes.length} pass types`)
  passTypes.forEach((pt, index) => {
    console.log(`\n${index + 1}. Pass Type:`, pt.passTypeName)
    console.log('   Year:', pt.year)
    console.log('   Count:', pt.registrationCount)
    console.log('   Percentage:', pt.percentOfTotal)
    console.log('   Is Paid:', pt.isPaid)
  })

  console.log('\n=== Event Registrations ===')
  const registrations = await prisma.eventRegistration.findMany({
    where: { clientId: atcClient.id },
    orderBy: { date: 'desc' },
    take: 5
  })

  console.log(`Found ${registrations.length} registration records`)
  registrations.forEach((reg, index) => {
    console.log(`\n${index + 1}. Date:`, reg.date.toISOString().split('T')[0])
    console.log('   Total:', reg.totalRegistrations)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
