// Migration script to create default "360 Live Media" client and link all existing data
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration to client-based structure...')

  // Step 1: Create or get the "360 Live Media" client
  const defaultClient = await prisma.client.upsert({
    where: { slug: '360-live-media' },
    update: {},
    create: {
      name: '360 Live Media',
      slug: '360-live-media',
      utmTracking: true,
      conversionTracking: true,
    },
  })

  console.log(`✓ Default client created/found: ${defaultClient.name} (${defaultClient.id})`)

  // Step 2: Update all existing records to reference the default client
  const updates = await Promise.all([
    prisma.emailCampaign.updateMany({
      where: { clientId: null },
      data: { clientId: defaultClient.id },
    }),
    prisma.websiteMetric.updateMany({
      where: { clientId: null },
      data: { clientId: defaultClient.id },
    }),
    prisma.socialMetric.updateMany({
      where: { clientId: null },
      data: { clientId: defaultClient.id },
    }),
    prisma.socialPost.updateMany({
      where: { clientId: null },
      data: { clientId: defaultClient.id },
    }),
    prisma.campaign.updateMany({
      where: { clientId: null },
      data: { clientId: defaultClient.id },
    }),
    prisma.optimization.updateMany({
      where: { clientId: null },
      data: { clientId: defaultClient.id },
    }),
  ])

  console.log('\n✓ Migration complete!')
  console.log(`  - Email Campaigns: ${updates[0].count} updated`)
  console.log(`  - Website Metrics: ${updates[1].count} updated`)
  console.log(`  - Social Metrics: ${updates[2].count} updated`)
  console.log(`  - Social Posts: ${updates[3].count} updated`)
  console.log(`  - Campaigns: ${updates[4].count} updated`)
  console.log(`  - Optimizations: ${updates[5].count} updated`)
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
