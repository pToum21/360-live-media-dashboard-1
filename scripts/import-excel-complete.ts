import xlsx from 'xlsx'
import { prisma } from '../lib/prisma'

const EXCEL_FILE = 'c:\\Users\\ptouma\\Downloads\\2026-360LM-MarketingDashboard.xlsx'

async function importExcelData() {
  console.log('📊 COMPLETE Excel Data Import\n')
  console.log('This will import ALL data from ALL sheets\n')

  console.log('📖 Reading Excel file...')
  const workbook = xlsx.readFile(EXCEL_FILE)
  console.log(`✅ Found ${workbook.SheetNames.length} sheets\n`)

  // Clear existing data first
  console.log('🗑️  Clearing existing data...')
  await prisma.optimization.deleteMany({})
  await prisma.postTag.deleteMany({})
  await prisma.socialPost.deleteMany({})
  await prisma.campaign.deleteMany({})
  await prisma.client.deleteMany({})
  await prisma.socialMetric.deleteMany({})
  await prisma.emailCampaign.deleteMany({})
  await prisma.websiteMetric.deleteMany({})
  console.log('✅ Cleared old data\n')

  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@360livemedia.com' }
  })

  if (!demoUser) {
    throw new Error('Demo user not found. Run: npm run db:seed')
  }

  console.log(`👤 Using demo user: ${demoUser.email}\n`)

  // Import each dataset
  await importWebsiteAnalytics(workbook, demoUser.id)
  await importEmailCampaigns(workbook, demoUser.id)
  await importSocialMetrics(workbook, demoUser.id)
  await importWebsiteCampaigns(workbook)
  await importTagTracking(workbook, demoUser.id)
  await importClientProjects(workbook)
  await importABTests(workbook, demoUser.id)

  // Generate summary
  console.log('\n📊 Import Summary:')
  const counts = await Promise.all([
    prisma.websiteMetric.count(),
    prisma.emailCampaign.count(),
    prisma.socialMetric.count(),
    prisma.campaign.count(),
    prisma.socialPost.count(),
    prisma.client.count(),
    prisma.optimization.count(),
  ])

  console.log(`   Website Metrics: ${counts[0]}`)
  console.log(`   Email Campaigns: ${counts[1]}`)
  console.log(`   Social Metrics: ${counts[2]}`)
  console.log(`   Campaign Data: ${counts[3]}`)
  console.log(`   Social Posts: ${counts[4]}`)
  console.log(`   Client Projects: ${counts[5]}`)
  console.log(`   A/B Tests: ${counts[6]}`)
  console.log(`   TOTAL: ${counts.reduce((a, b) => a + b, 0)} records`)

  console.log('\n✨ Complete import finished!')
}

async function importWebsiteAnalytics(workbook: xlsx.WorkBook, userId: string) {
  console.log('🌐 Importing website analytics...')
  
  const sheet = workbook.Sheets['Website Data']
  if (!sheet) {
    console.log('⚠️  Website Data sheet not found')
    return
  }

  // Read ALL rows starting from row 3 (where data starts)
  const data = xlsx.utils.sheet_to_json(sheet, { range: 3, defval: null })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const weekStarting = parseExcelDate(row['Week Starting'])
      
      // Skip completely empty rows
      if (!weekStarting && !row['Users (total)'] && !row['Health Score']) {
        skipped++
        continue
      }

      // Import even if week is missing (use placeholder date)
      const finalDate = weekStarting || new Date('2026-01-01')

      await prisma.websiteMetric.create({
        data: {
          weekStarting: finalDate,
          healthScore: parseFloat(row['Health Score']) || null,
          totalUsers: parseInt(row['Users (total)']) || 0,
          percentChangeUsers: parsePercentage(row['% Increase Users']),
          newUsers: parseInt(row['Total New Users']) || 0,
          percentChangeNewUsers: parsePercentage(row['% Increase New Users']),
          referral: parseInt(row[' Referral ']) || null,
          organicSearch: parseInt(row[' Organic Search ']) || null,
          direct: parseInt(row[' Direct ']) || null,
          organicSocial: parseInt(row[' Organic Social ']) || null,
          email: parseInt(row[' Email ']) || null,
          unassigned: parseInt(row[' Unassigned ']) || null,
          avgEngagementTimeSec: parseInt(row['Average engagement time per session (seconds)']) || null,
          percentChangeEngTime: parsePercentage(row['% Increase Average engagement time per session (seconds)']),
          createdById: userId,
        },
      })
      imported++
    } catch (error: any) {
      console.error(`   ❌ Row error:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} website metrics (${skipped} skipped)\n`)
}

async function importEmailCampaigns(workbook: xlsx.WorkBook, userId: string) {
  console.log('📧 Importing email campaigns...')
  
  const sheet = workbook.Sheets['Mission Brief']
  if (!sheet) {
    console.log('⚠️  Mission Brief sheet not found')
    return
  }

  // Read as array of arrays (Mission Brief has TWO columns of data side-by-side)
  const rawData = xlsx.utils.sheet_to_json(sheet, { range: 2, header: 1, defval: null }) as any[]
  let imported = 0
  let skipped = 0

  for (const row of rawData) {
    // Process LEFT column (2026 data) - columns 0-5
    if (row[0]) {
      try {
        const emailName = row[0].toString().trim()
        const deploymentDate = parseExcelDate(row[1])
        
        if (emailName && deploymentDate) {
          await prisma.emailCampaign.create({
            data: {
              name: emailName,
              deploymentDate,
              openRate: parseFloat(row[2]) || 0,
              clickRate: parseFloat(row[3]) || 0,
              deliveryRate: parseFloat(row[4]) || 1,
              unsubscribeRate: parseFloat(row[5]) || 0,
              createdById: userId,
            },
          })
          imported++
        } else {
          skipped++
        }
      } catch (error: any) {
        console.error(`   ❌ Email (left) error:`, error.message)
        skipped++
      }
    }

    // Process RIGHT column (2025 data) - columns 7-12
    // NOTE: Right column has percentage STRINGS like "13.08%" instead of decimals
    if (row[7]) {
      try {
        const emailName = row[7].toString().trim()
        const deploymentDate = parseExcelDate(row[8])
        
        if (emailName && deploymentDate) {
          await prisma.emailCampaign.create({
            data: {
              name: emailName,
              deploymentDate,
              openRate: parsePercentageString(row[9]) || 0,
              clickRate: parsePercentageString(row[10]) || 0,
              deliveryRate: parsePercentageString(row[11]) || 1,
              unsubscribeRate: parsePercentageString(row[12]) || 0,
              createdById: userId,
            },
          })
          imported++
        } else {
          skipped++
        }
      } catch (error: any) {
        console.error(`   ❌ Email (right) error:`, error.message)
        skipped++
      }
    }
  }

  console.log(`   ✅ Imported ${imported} email campaigns (${skipped} skipped)\n`)
}

async function importSocialMetrics(workbook: xlsx.WorkBook, userId: string) {
  console.log('👥 Importing social media metrics...')
  
  const sheet = workbook.Sheets['Organic Social Media']
  if (!sheet) {
    console.log('⚠️  Organic Social Media sheet not found')
    return
  }

  const data = xlsx.utils.sheet_to_json(sheet, { range: 3, defval: null })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const weekStarting = parseExcelDate(row['Week Starting'])
      
      // Skip completely empty rows
      if (!weekStarting && !row['LI Impressions'] && !row['IG Impressions']) {
        skipped++
        continue
      }

      const finalDate = weekStarting || new Date('2026-01-01')

      await prisma.socialMetric.create({
        data: {
          weekStarting: finalDate,
          liFollowerGrowthRate: parseFloat(row['LI Follower \r\nGrowth Rate']) || null,
          liImpressions: parseInt(row[' LI Impressions ']) || null,
          liEngagementRate: parseFloat(row[' LI Engagement Rate ']) || null,
          liPostsPerWeek: parseInt(row[' LI Posts Per Week ']) || null,
          liFollowers: parseInt(row['LI Followers']) || null,
          igImpressions: parseInt(row[' IG Impressions ']) || null,
          igEngagementRate: parseFloat(row[' IG Engagement Rate ']) || null,
          igPostsPerWeek: parseInt(row[' IG Posts Per Week ']) || null,
          igFollowers: parseInt(row[' Instagram Followers ']) || null,
          createdById: userId,
        },
      })
      imported++
    } catch (error: any) {
      console.error(`   ❌ Social error:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} social metrics (${skipped} skipped)\n`)
}

async function importWebsiteCampaigns(workbook: xlsx.WorkBook) {
  console.log('📊 Importing website campaign data...')
  
  const sheet = workbook.Sheets['Website Campaign Data']
  if (!sheet) {
    console.log('⚠️  Website Campaign Data sheet not found')
    return
  }

  const data = xlsx.utils.sheet_to_json(sheet, { defval: null })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const month = row['Page Views by Campaign']?.toString().trim()
      if (!month || month === '' || month === 'Page Views by Campaign') {
        skipped++
        continue
      }

      // Import each campaign source as a separate record
      const sources = [
        { name: 'Mission Brief', views: parseInt(row['Mission Brief']) || 0 },
        { name: 'Beth Event Trends', views: parseInt(row['Beth Event Trends']) || 0 },
        { name: 'TAM Outbound', views: parseInt(row['TAM Outbound']) || 0 },
        { name: 'Organic Search', views: parseInt(row['Organic Search']) || 0 },
        { name: 'Organic Social', views: parseInt(row['Organic Social']) || 0 },
        { name: 'Direct Traffic', views: parseInt(row['Direct Traffic']) || 0 },
        { name: 'Smithbucklin Referral', views: parseInt(row['Smithbucklin Referral']) || 0 },
        { name: 'Email Signature', views: parseInt(row['Email Signature']) || 0 },
      ]

      for (const source of sources) {
        if (source.views > 0) {
          await prisma.campaign.create({
            data: {
              month,
              source: source.name,
              pageViews: source.views,
            },
          })
          imported++
        }
      }
    } catch (error: any) {
      console.error(`   ❌ Campaign error:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} campaign records (${skipped} skipped)\n`)
}

async function importTagTracking(workbook: xlsx.WorkBook, userId: string) {
  console.log('📱 Importing tag tracking (social posts)...')
  
  const sheet = workbook.Sheets['Tag Tracking']
  if (!sheet) {
    console.log('⚠️  Tag Tracking sheet not found')
    return
  }

  // Use specific range for first 6 columns, headers are in row 2
  const data = xlsx.utils.sheet_to_json(sheet, { range: 'A2:F100', defval: null })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const weekStarting = parseExcelDate(row['Date'])
      
      // Skip rows with no date or no meaningful data
      if (!weekStarting) {
        skipped++
        continue
      }

      const posts = parseInt(row['Posts']) || null
      const impressions = parseInt(row['Impressions']) || null
      const engagements = parseInt(row['Engagements']) || null

      // Skip rows where all metrics are empty
      if (!posts && !impressions && !engagements) {
        skipped++
        continue
      }

      const engagementRate = parseFloat(row['Engagement Rate']) || 0
      const linkClicks = parseInt(row['Post Link Clicks']) || null

      // Create a social post
      await prisma.socialPost.create({
        data: {
          weekStarting,
          postUrl: null,
          platform: 'LINKEDIN',
          impressions: impressions || 0,
          engagements: engagements || 0,
          engagementRate,
          linkClicks,
          createdById: userId,
        },
      })
      imported++
    } catch (error: any) {
      console.error(`   ❌ Post error:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} social posts (${skipped} skipped)\n`)
}

async function importClientProjects(workbook: xlsx.WorkBook) {
  console.log('🏢 Importing client projects...')
  
  const sheet = workbook.Sheets['Conversion Tracking']
  if (!sheet) {
    console.log('⚠️  Conversion Tracking sheet not found')
    return
  }

  const data = xlsx.utils.sheet_to_json(sheet, { defval: null })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const clientName = row['Client / Event']?.toString().trim()
      if (!clientName || clientName === '') {
        skipped++
        continue
      }

      const year = parseInt(row['Year']) || new Date().getFullYear()

      await prisma.client.create({
        data: {
          name: clientName,
          eventName: null,
          year,
          campaignStatus: row['Event Campaign Status']?.toString() || 'Unknown',
          dashboardStatus: row['360 Dashboard']?.toString() || 'Unknown',
          utmTracking: row['Are we UTM Tracking? \r\n(Marketing KPIs are being measured and optimized)']?.toString().toLowerCase() === 'yes',
          conversionTracking: row['Conversion Tracking \r\n(Registrations can be tied to specific marketing campaigns)']?.toString() || 'No',
          issueDescription: row['Issue Description ']?.toString() || null,
          nextSteps: row['Next steps']?.toString() || null,
        },
      })
      imported++
    } catch (error: any) {
      console.error(`   ❌ Client error:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} client projects (${skipped} skipped)\n`)
}

async function importABTests(workbook: xlsx.WorkBook, userId: string) {
  console.log('🧪 Importing A/B tests...')
  
  const sheet = workbook.Sheets['Optimizations']
  if (!sheet) {
    console.log('⚠️  Optimizations sheet not found')
    return
  }

  const data = xlsx.utils.sheet_to_json(sheet, { defval: null })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const month = row['Month']?.toString().trim()
      if (!month || month === '') {
        skipped++
        continue
      }

      await prisma.optimization.create({
        data: {
          month,
          channel: row['Channel']?.toString() || null,
          controlTest: row['Control (the "A")']?.toString() || null,
          testVariant: row['Test (the "B")']?.toString() || null,
          results: row['Results']?.toString() || null,
          conclusions: row['Conclusions / Recommendations']?.toString() || null,
          createdById: userId,
        },
      })
      imported++
    } catch (error: any) {
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} A/B tests (${skipped} skipped)\n`)
}

// Helper functions
function parseExcelDate(value: any): Date | null {
  if (!value) return null
  if (value instanceof Date) return value

  if (typeof value === 'number') {
    const date = xlsx.SSF.parse_date_code(value)
    return new Date(date.y, date.m - 1, date.d)
  }

  const parsed = new Date(value)
  if (!isNaN(parsed.getTime())) return parsed

  return null
}

function parsePercentage(value: any): number | null {
  if (!value || value === '-' || value === '') return null
  
  const str = value.toString().replace('%', '').trim()
  const num = parseFloat(str)
  
  if (isNaN(num)) return null
  
  return num > 1 ? num / 100 : num
}

function parsePercentageString(value: any): number {
  // For percentage strings like "13.08%" -> convert to decimal 0.1308
  // Also handles numbers like 0.1308 (already in decimal format)
  if (!value) return 0
  
  const str = value.toString().replace('%', '').trim()
  const num = parseFloat(str)
  
  if (isNaN(num)) return 0
  
  // If > 1, it's a percentage like 13.08, convert to decimal
  // If <= 1, it's already a decimal like 0.1308
  return num > 1 ? num / 100 : num
}

// Run the import
importExcelData()
  .catch((error) => {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
