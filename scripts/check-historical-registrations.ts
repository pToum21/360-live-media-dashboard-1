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

  console.log('=== All Event Registration Records ===')
  const registrations = await prisma.eventRegistration.findMany({
    where: { clientId: atcClient.id },
    orderBy: { date: 'asc' }
  })

  console.log(`Found ${registrations.length} total records`)
  
  // Group by year
  const byYear: Record<number, any[]> = {}
  registrations.forEach(reg => {
    const year = reg.date.getFullYear()
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(reg)
  })

  console.log('\n=== Registrations by Year ===')
  Object.keys(byYear).sort().forEach(year => {
    console.log(`\n${year}: ${byYear[Number(year)].length} records`)
    console.log('Sample:', byYear[Number(year)].slice(0, 3).map(r => ({
      date: r.date.toISOString().split('T')[0],
      total: r.totalRegistrations
    })))
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
