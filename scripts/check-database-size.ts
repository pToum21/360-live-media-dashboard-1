import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Checking database size and usage...\n')

    // Get database size
    const dbSize = await prisma.$queryRaw<Array<{ database_size: string }>>`
      SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
    `

    // Get record counts for main tables
    const counts = await Promise.all([
      prisma.client.count(),
      prisma.emailCampaign.count(),
      prisma.socialPost.count(),
      prisma.websiteMetric.count(),
      prisma.paidMedia.count(),
      prisma.eventRegistration.count(),
      prisma.passType.count(),
      prisma.abstractSubmission.count(),
      prisma.revenueProjection.count(),
      prisma.gA4Registration.count(),
      prisma.user.count(),
    ])

    console.log('📊 DATABASE SIZE')
    console.log('═'.repeat(50))
    console.log(`Total Database Size: ${dbSize[0].database_size}`)
    console.log('')

    console.log('📈 RECORD COUNTS')
    console.log('═'.repeat(50))
    console.log(`Clients:                ${counts[0].toLocaleString()}`)
    console.log(`Email Campaigns:        ${counts[1].toLocaleString()}`)
    console.log(`Social Posts:           ${counts[2].toLocaleString()}`)
    console.log(`Website Metrics:        ${counts[3].toLocaleString()}`)
    console.log(`Paid Media:             ${counts[4].toLocaleString()}`)
    console.log(`Event Registrations:    ${counts[5].toLocaleString()}`)
    console.log(`Pass Types:             ${counts[6].toLocaleString()}`)
    console.log(`Abstract Submissions:   ${counts[7].toLocaleString()}`)
    console.log(`Revenue Projections:    ${counts[8].toLocaleString()}`)
    console.log(`GA4 Registrations:      ${counts[9].toLocaleString()}`)
    console.log(`Users:                  ${counts[10].toLocaleString()}`)
    console.log('')

    const totalRecords = counts.reduce((sum, count) => sum + count, 0)
    console.log(`Total Records:          ${totalRecords.toLocaleString()}`)
    console.log('')

    // Calculate percentage of free tier used (500MB = 0.5GB)
    const sizeMatch = dbSize[0].database_size.match(/(\d+(\.\d+)?)\s*(MB|GB)/)
    if (sizeMatch) {
      const size = parseFloat(sizeMatch[1])
      const unit = sizeMatch[3]
      const sizeInMB = unit === 'GB' ? size * 1024 : size
      const percentUsed = (sizeInMB / 500) * 100

      console.log('💾 FREE TIER USAGE (Neon Free = 500MB)')
      console.log('═'.repeat(50))
      console.log(`Used: ${sizeInMB.toFixed(2)} MB / 500 MB (${percentUsed.toFixed(2)}%)`)
      console.log(`Remaining: ${(500 - sizeInMB).toFixed(2)} MB`)
      
      if (percentUsed < 50) {
        console.log('✅ Status: Excellent - Plenty of free space!')
      } else if (percentUsed < 80) {
        console.log('⚠️  Status: Good - Monitor usage occasionally')
      } else {
        console.log('🔴 Status: Consider upgrading soon')
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
