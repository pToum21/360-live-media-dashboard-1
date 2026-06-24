import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listClients() {
  console.log('📋 Listing all clients in database...\n')

  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          websiteMetrics: true,
          emailCampaigns: true,
          socialMetrics: true,
        }
      }
    }
  })

  console.log(`Found ${clients.length} clients:\n`)

  for (const client of clients) {
    console.log(`🏢 ${client.name}`)
    console.log(`   ID: ${client.id}`)
    console.log(`   Slug: ${client.slug}`)
    console.log(`   Website Metrics: ${client._count.websiteMetrics}`)
    console.log(`   Email Campaigns: ${client._count.emailCampaigns}`)
    console.log(`   Social Metrics: ${client._count.socialMetrics}`)
    console.log()
  }

  await prisma.$disconnect()
}

listClients()
  .then(() => {
    console.log('✅ Complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
