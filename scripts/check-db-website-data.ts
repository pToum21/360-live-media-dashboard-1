import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseWebsiteData() {
  console.log('🔍 Checking Website Analytics data in database...\n')

  // Find ATC client
  const client = await prisma.client.findFirst({
    where: { slug: 'atc' }
  })

  if (!client) {
    console.log('❌ ATC client not found in database')
    return
  }

  console.log(`✅ Found ATC client: ${client.name} (ID: ${client.id})\n`)

  // Get all website metrics for ATC
  const metrics = await prisma.websiteMetric.findMany({
    where: { clientId: client.id },
    orderBy: { weekStarting: 'asc' },
    select: {
      id: true,
      weekStarting: true,
      totalUsers: true,
      newUsers: true,
    }
  })

  console.log(`📊 Found ${metrics.length} website metric entries in database\n`)

  if (metrics.length > 0) {
    console.log('📅 Date Range:')
    console.log(`   Earliest: ${metrics[0].weekStarting.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`)
    console.log(`   Latest:   ${metrics[metrics.length - 1].weekStarting.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`)

    console.log('📋 First 10 entries:')
    for (let i = 0; i < Math.min(10, metrics.length); i++) {
      const m = metrics[i]
      console.log(`   ${i + 1}. ${m.weekStarting.toLocaleDateString('en-US')} - Total Users: ${m.totalUsers}, New Users: ${m.newUsers}`)
    }

    console.log('\n📋 Last 10 entries:')
    const startIndex = Math.max(0, metrics.length - 10)
    for (let i = startIndex; i < metrics.length; i++) {
      const m = metrics[i]
      console.log(`   ${i + 1}. ${m.weekStarting.toLocaleDateString('en-US')} - Total Users: ${m.totalUsers}, New Users: ${m.newUsers}`)
    }
  } else {
    console.log('❌ No website metrics found for ATC client!')
  }

  await prisma.$disconnect()
}

checkDatabaseWebsiteData()
  .then(() => {
    console.log('\n✅ Database check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
