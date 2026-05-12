import { prisma } from '../lib/prisma'

async function debugData() {
  console.log('🔍 DEBUGGING DATABASE CONTENTS\n')

  // Check email campaigns
  const emails = await prisma.emailCampaign.findMany({
    orderBy: { deploymentDate: 'desc' },
    take: 3
  })
  console.log('📧 Latest 3 Email Campaigns:')
  emails.forEach(e => {
    console.log(`   ${e.name}`)
    console.log(`      Open Rate (raw): ${e.openRate}`)
    console.log(`      Open Rate (as %): ${(e.openRate * 100).toFixed(2)}%`)
    console.log(`      Click Rate (raw): ${e.clickRate}`)
    console.log(`      Delivery Rate (raw): ${e.deliveryRate}`)
  })

  // Check website metrics
  const websites = await prisma.websiteMetric.findMany({
    orderBy: { weekStarting: 'desc' },
    take: 5
  })
  console.log('\n🌐 Latest 5 Website Metrics:')
  websites.forEach(w => {
    console.log(`   Week: ${w.weekStarting.toLocaleDateString()}`)
    console.log(`      Total Users: ${w.totalUsers}`)
    console.log(`      New Users: ${w.newUsers}`)
    console.log(`      Health Score: ${w.healthScore}`)
  })

  // Check social metrics
  const social = await prisma.socialMetric.findMany({
    orderBy: { weekStarting: 'desc' },
    take: 5
  })
  console.log('\n👥 Latest 5 Social Metrics:')
  social.forEach(s => {
    console.log(`   Week: ${s.weekStarting.toLocaleDateString()}`)
    console.log(`      LI Followers: ${s.liFollowers}`)
    console.log(`      LI Impressions: ${s.liImpressions}`)
    console.log(`      IG Followers: ${s.igFollowers}`)
    console.log(`      IG Impressions: ${s.igImpressions}`)
  })

  await prisma.$disconnect()
}

debugData()
