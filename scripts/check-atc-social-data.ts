import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkATCSocialData() {
  const atc = await prisma.client.findUnique({
    where: { slug: 'atc-2026' },
  })
  
  if (!atc) {
    console.log('ATC client not found')
    return
  }
  
  const social = await prisma.socialMetric.findMany({
    where: { clientId: atc.id },
    orderBy: { weekStarting: 'desc' },
    take: 5,
  })
  
  console.log('\n📊 Last 5 ATC Social Metrics Records:\n')
  
  social.forEach((s, i) => {
    console.log(`\n${i + 1}. Week: ${s.weekStarting.toDateString()}`)
    console.log('   LinkedIn:')
    console.log(`     - Followers: ${s.liFollowers || 'N/A'}`)
    console.log(`     - Impressions: ${s.liImpressions || 'N/A'}`)
    console.log(`     - Engagement Rate: ${s.liEngagementRate || 'N/A'}`)
    console.log('   Instagram:')
    console.log(`     - Followers: ${s.igFollowers || 'N/A'}`)
    console.log(`     - Impressions: ${s.igImpressions || 'N/A'}`)
    console.log(`     - Engagement Rate: ${s.igEngagementRate || 'N/A'}`)
    console.log('   Facebook:')
    console.log(`     - Followers: ${s.fbFollowers || 'N/A'}`)
    console.log(`     - Impressions: ${s.fbImpressions || 'N/A'}`)
    console.log(`     - Engagements: ${s.fbEngagements || 'N/A'}`)
    console.log('   X/Twitter:')
    console.log(`     - Followers: ${s.xFollowers || 'N/A'}`)
    console.log(`     - Impressions: ${s.xImpressions || 'N/A'}`)
    console.log(`     - Engagements: ${s.xEngagements || 'N/A'}`)
  })
  
  // Check if ANY record has engagements
  const hasAnyEngagement = social.some(s => 
    s.fbEngagements || s.xEngagements || s.liEngagementRate || s.igEngagementRate
  )
  
  console.log(`\n\n${hasAnyEngagement ? '✅' : '❌'} Has engagement data: ${hasAnyEngagement}`)
}

checkATCSocialData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
