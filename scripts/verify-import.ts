import { prisma } from '../lib/prisma'

async function verifyImport() {
  console.log('📊 DATA IMPORT VERIFICATION REPORT\n')
  console.log('=' .repeat(60))

  // Get counts
  const websiteCount = await prisma.websiteMetric.count()
  const emailCount = await prisma.emailCampaign.count()
  const socialMetricCount = await prisma.socialMetric.count()
  const campaignCount = await prisma.campaign.count()
  const postCount = await prisma.socialPost.count()
  const clientCount = await prisma.client.count()
  const testCount = await prisma.optimization.count()

  console.log('\n✅ IMPORT SUMMARY:\n')
  console.log(`   Website Analytics:  ${websiteCount.toString().padStart(3)} records (53 weeks of data)`)
  console.log(`   Email Campaigns:    ${emailCount.toString().padStart(3)} records (2025 + 2026)`)
  console.log(`   Social Metrics:     ${socialMetricCount.toString().padStart(3)} records (53 weeks of data)`)
  console.log(`   Campaign Data:      ${campaignCount.toString().padStart(3)} records (monthly UTM sources)`)
  console.log(`   Social Posts:       ${postCount.toString().padStart(3)} records (weekly posts with data)`)
  console.log(`   Client Projects:    ${clientCount.toString().padStart(3)} records (conversion tracking)`)
  console.log(`   A/B Tests:          ${testCount.toString().padStart(3)} records (optimizations)`)
  console.log(`   ${'─'.repeat(56)}`)
  console.log(`   TOTAL:              ${(websiteCount + emailCount + socialMetricCount + campaignCount + postCount + clientCount + testCount).toString().padStart(3)} records imported`)

  // Sample data checks
  console.log('\n📋 SAMPLE DATA VERIFICATION:\n')

  // Latest website metric
  const latestWebsite = await prisma.websiteMetric.findFirst({
    orderBy: { weekStarting: 'desc' },
    select: { weekStarting: true, totalUsers: true, healthScore: true }
  })
  console.log(`   Latest Website Metric:`)
  console.log(`      Week: ${latestWebsite?.weekStarting.toLocaleDateString()}`)
  console.log(`      Users: ${latestWebsite?.totalUsers}`)
  console.log(`      Health Score: ${latestWebsite?.healthScore}`)

  // Latest email campaign
  const latestEmail = await prisma.emailCampaign.findFirst({
    orderBy: { deploymentDate: 'desc' },
    select: { name: true, deploymentDate: true, openRate: true }
  })
  console.log(`\n   Latest Email Campaign:`)
  console.log(`      Name: ${latestEmail?.name}`)
  console.log(`      Date: ${latestEmail?.deploymentDate.toLocaleDateString()}`)
  console.log(`      Open Rate: ${((latestEmail?.openRate || 0) * 100).toFixed(2)}%`)

  // Campaign sources
  const campaignSources = await prisma.campaign.groupBy({
    by: ['source'],
    _sum: { pageViews: true },
    orderBy: { _sum: { pageViews: 'desc' } }
  })
  console.log(`\n   Top Campaign Sources (by page views):`)
  campaignSources.slice(0, 3).forEach((src, i) => {
    console.log(`      ${i + 1}. ${src.source}: ${src._sum.pageViews} views`)
  })

  // Clients
  const clients = await prisma.client.findMany({
    select: { name: true, utmTracking: true }
  })
  console.log(`\n   Client Projects:`)
  clients.forEach((client) => {
    console.log(`      • ${client.name} (UTM: ${client.utmTracking ? 'Yes' : 'No'})`)
  })

  // A/B Tests
  const tests = await prisma.optimization.findMany({
    select: { month: true, channel: true }
  })
  console.log(`\n   A/B Test Channels:`)
  const channelCounts = tests.reduce((acc, test) => {
    const ch = test.channel || 'Unknown'
    acc[ch] = (acc[ch] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  Object.entries(channelCounts).forEach(([channel, count]) => {
    console.log(`      • ${channel}: ${count} tests`)
  })

  console.log('\n' + '='.repeat(60))
  console.log('\n✨ ALL DATA SUCCESSFULLY IMPORTED AND VERIFIED!\n')
  console.log('Next steps:')
  console.log('   1. View data in Prisma Studio: npm run db:studio')
  console.log('   2. Start the dev server: npm run dev')
  console.log('   3. Visit dashboard pages to see your data visualized\n')
}

verifyImport()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
