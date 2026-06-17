import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDataCompleteness() {
  console.log('📊 Checking ATC Data Completeness...\n')

  const atc = await prisma.client.findUnique({
    where: { slug: 'atc-2026' },
    include: {
      emailCampaigns: true,
      socialMetrics: true,
      websiteMetrics: true,
      paidMedia: true,
      eventRegistrations: true,
      passTypes: true,
      abstractSubmissions: true,
      revenueProjections: true,
      ga4Registrations: true,
    },
  })

  if (!atc) {
    console.log('❌ ATC client not found!')
    return
  }

  console.log('✅ ATC 2026 Client Found\n')
  console.log('═══════════════════════════════════')
  console.log('DATA SUMMARY:')
  console.log('═══════════════════════════════════')
  console.log(`📧 Email Campaigns: ${atc.emailCampaigns.length}`)
  console.log(`📱 Social Metrics: ${atc.socialMetrics.length}`)
  console.log(`🌐 Website Metrics: ${atc.websiteMetrics.length}`)
  console.log(`💰 Paid Media: ${atc.paidMedia.length}`)
  console.log(`👥 Event Registrations: ${atc.eventRegistrations.length}`)
  console.log(`🎟️  Pass Types: ${atc.passTypes.length}`)
  console.log(`📄 Abstract Submissions: ${atc.abstractSubmissions.length}`)
  console.log(`📈 Revenue Projections: ${atc.revenueProjections.length}`)
  console.log(`📊 GA4 Registrations: ${atc.ga4Registrations.length}`)

  console.log('\n═══════════════════════════════════')
  console.log('EMAIL ENHANCEMENTS:')
  console.log('═══════════════════════════════════')
  
  const emailsWithHeatmap = atc.emailCampaigns.filter(e => e.totalClicks && e.totalClicks > 0)
  const emailsWithTiming = atc.emailCampaigns.filter(e => e.deploymentDayOfWeek)
  const emailsWithBenchmarks = atc.emailCampaigns.filter(e => e.openRateBenchmark)
  
  console.log(`🗺️  Emails with Heatmap Data: ${emailsWithHeatmap.length}`)
  console.log(`⏰ Emails with Timing Data: ${emailsWithTiming.length}`)
  console.log(`🎯 Emails with Benchmarks: ${emailsWithBenchmarks.length}`)

  console.log('\n═══════════════════════════════════')
  console.log('SOCIAL MEDIA PLATFORMS:')
  console.log('═══════════════════════════════════')
  
  const hasLinkedIn = atc.socialMetrics.some(m => m.liFollowers || m.liImpressions)
  const hasInstagram = atc.socialMetrics.some(m => m.igFollowers || m.igImpressions)
  const hasFacebook = atc.socialMetrics.some(m => m.fbFollowers || m.fbImpressions)
  const hasX = atc.socialMetrics.some(m => m.xFollowers || m.xImpressions)
  
  console.log(`LinkedIn: ${hasLinkedIn ? '✓' : '✗'}`)
  console.log(`Instagram: ${hasInstagram ? '✓' : '✗'}`)
  console.log(`Facebook: ${hasFacebook ? '✓' : '✗'}`)
  console.log(`X/Twitter: ${hasX ? '✓' : '✗'}`)

  console.log('\n═══════════════════════════════════')
  console.log('WEBSITE TRAFFIC SOURCES:')
  console.log('═══════════════════════════════════')
  
  const hasOrganic = atc.websiteMetrics.some(m => m.organicSearch && m.organicSearch > 0)
  const hasDirect = atc.websiteMetrics.some(m => m.direct && m.direct > 0)
  const hasPaidSocial = atc.websiteMetrics.some(m => m.paidSocial && m.paidSocial > 0)
  const hasPaidSearch = atc.websiteMetrics.some(m => m.paidSearch && m.paidSearch > 0)
  
  console.log(`Organic Search: ${hasOrganic ? '✓' : '✗'}`)
  console.log(`Direct: ${hasDirect ? '✓' : '✗'}`)
  console.log(`Paid Social: ${hasPaidSocial ? '✓' : '✗'}`)
  console.log(`Paid Search: ${hasPaidSearch ? '✓' : '✗'}`)

  console.log('\n═══════════════════════════════════')
  console.log('GA4 ATTRIBUTION:')
  console.log('═══════════════════════════════════')
  
  if (atc.ga4Registrations.length > 0) {
    const totalRegs = atc.ga4Registrations.reduce((sum, r) => sum + (r.totalRegistrations || 0), 0)
    const organicSearchRegs = atc.ga4Registrations.reduce((sum, r) => sum + (r.organicSearch || 0), 0)
    const emailRegs = atc.ga4Registrations.reduce((sum, r) => sum + (r.email || 0), 0)
    const paidSocialRegs = atc.ga4Registrations.reduce((sum, r) => sum + (r.paidSocial || 0), 0)
    
    console.log(`Total Registrations Tracked: ${totalRegs}`)
    console.log(`From Organic Search: ${organicSearchRegs}`)
    console.log(`From Email: ${emailRegs}`)
    console.log(`From Paid Social: ${paidSocialRegs}`)
  } else {
    console.log('No GA4 registration data found')
  }

  console.log('\n✅ Data Check Complete!')
}

checkDataCompleteness()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
