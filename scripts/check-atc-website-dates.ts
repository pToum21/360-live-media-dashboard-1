import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkATCWebsiteData() {
  console.log('🔍 Checking ATC 2026 Website Analytics data...\n')

  const metrics = await prisma.websiteMetric.findMany({
    where: { 
      client: {
        slug: 'atc-2026'
      }
    },
    orderBy: { weekStarting: 'asc' },
    select: {
      id: true,
      weekStarting: true,
      totalUsers: true,
      newUsers: true,
    }
  })

  console.log(`📊 Found ${metrics.length} website metric entries\n`)

  if (metrics.length > 0) {
    console.log('📅 Date Range:')
    console.log(`   Earliest: ${metrics[0].weekStarting.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`)
    console.log(`   Latest:   ${metrics[metrics.length - 1].weekStarting.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`)

    console.log('📋 All entries:')
    for (let i = 0; i < metrics.length; i++) {
      const m = metrics[i]
      console.log(`   ${i + 1}. ${m.weekStarting.toLocaleDateString('en-US')} - Total Users: ${m.totalUsers}, New Users: ${m.newUsers}`)
    }
  }

  await prisma.$disconnect()
}

checkATCWebsiteData()
  .then(() => {
    console.log('\n✅ Complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
