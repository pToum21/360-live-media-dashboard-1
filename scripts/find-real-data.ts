import { prisma } from '../lib/prisma'

async function findRealData() {
  console.log('🔍 FINDING RECORDS WITH ACTUAL DATA\n')

  //Website metrics with data
  const websites = await prisma.websiteMetric.findMany({
    where: {
      totalUsers: { gt: 0 }
    },
    orderBy: { weekStarting: 'desc' },
    take: 5
  })
  console.log('🌐 Website metrics WITH data:')
  websites.forEach(w => {
    console.log(`   ${w.weekStarting.toLocaleDateString()}: ${w.totalUsers} users, ${w.newUsers} new users`)
  })

  // Social metrics with data
  const social = await prisma.socialMetric.findMany({
    where: {
      OR: [
        { liImpressions: { not: null } },
        { igImpressions: { not: null } }
      ]
    },
    orderBy: { weekStarting: 'desc' },
    take: 5
  })
  console.log('\n👥 Social metrics WITH data:')
  social.forEach(s => {
    console.log(`   ${s.weekStarting.toLocaleDateString()}: LI ${s.liImpressions || 0} impressions, IG ${s.igImpressions || 0} impressions`)
  })

  // Count empty vs filled
  const totalWebsite = await prisma.websiteMetric.count()
  const filledWebsite = await prisma.websiteMetric.count({
    where: { totalUsers: { gt: 0 } }
  })
  console.log(`\n📊 Website: ${filledWebsite}/${totalWebsite} records have data`)

  const totalSocial = await prisma.socialMetric.count()
  const filledSocial = await prisma.socialMetric.count({
    where: {
      OR: [
        { liImpressions: { not: null } },
        { igImpressions: { not: null } }
      ]
    }
  })
  console.log(`📊 Social: ${filledSocial}/${totalSocial} records have data`)

  await prisma.$disconnect()
}

findRealData()
