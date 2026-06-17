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

  console.log('=== ATC Revenue Projections ===')
  const revenue = await prisma.revenueProjection.findMany({
    where: { clientId: atcClient.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  console.log(`Found ${revenue.length} revenue records`)
  revenue.forEach((rev, index) => {
    console.log(`\n${index + 1}.`)
    console.log('   Actual Revenue:', rev.actualRevenue)
    console.log('   Projected Revenue:', rev.projectedRevenue)
    console.log('   Created:', rev.createdAt.toISOString().split('T')[0])
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
