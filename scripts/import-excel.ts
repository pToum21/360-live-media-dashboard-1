import xlsx from 'xlsx'
import { prisma } from '../lib/prisma'

const EXCEL_FILE = 'c:\\Users\\ptouma\\Downloads\\2026-360LM-MarketingDashboard.xlsx'

async function importExcelData() {
  console.log('📊 Starting Excel data import...\n')

  console.log('📖 Reading Excel file...')
  const workbook = xlsx.readFile(EXCEL_FILE)
  console.log(`✅ Found ${workbook.SheetNames.length} sheets\n`)

  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@360livemedia.com' }
  })

  if (!demoUser) {
    throw new Error('Demo user not found. Run: npm run db:seed')
  }

  console.log(`👤 Using demo user: ${demoUser.email}\n`)

  // Import data from each sheet
  await importWebsiteAnalytics(workbook, demoUser.id)
  await importEmailCampaigns(workbook, demoUser.id)
  await importSocialMetrics(workbook, demoUser.id)
  await importClientProjects(workbook)
  await importABTests(workbook, demoUser.id)

  console.log('\n✨ Import complete!')
}

async function importWebsiteAnalytics(workbook: xlsx.WorkBook, userId: string) {
  console.log('🌐 Importing website analytics...')
  
  const sheet = workbook.Sheets['Website Data']
  if (!sheet) {
    console.log('⚠️  Website Data sheet not found, skipping')
    return
  }

  // Read with header starting at row 3 (index 3)
  const data = xlsx.utils.sheet_to_json(sheet, { range: 3 })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const weekStarting = parseExcelDate(row['Week Starting'])
      if (!weekStarting || !row['Users (total)']) {
        skipped++
        continue
      }

      await prisma.websiteMetric.create({
        data: {
          weekStarting,
          healthScore: parseFloat(row['Health Score']) || null,
          totalUsers: parseInt(row['Users (total)']) || 0,
          percentChangeUsers: parsePercentage(row['% Increase Users']),
          newUsers: parseInt(row['Total New Users']) || 0,
          percentChangeNewUsers: parsePercentage(row['% Increase New Users']),
          referral: parseInt(row['Referral']) || null,
          organicSearch: parseInt(row['Organic Search']) || null,
          direct: parseInt(row['Direct']) || null,
          organicSocial: parseInt(row['Organic Social']) || null,
          email: parseInt(row['Email']) || null,
          unassigned: parseInt(row['Unassigned']) || null,
          avgEngagementTimeSec: parseInt(row['Average engagement time per session (seconds)']) || null,
          percentChangeEngTime: parsePercentage(row['% Increase Average engagement time per session (seconds)']),
          createdById: userId,
        },
      })
      imported++
    } catch (error: any) {
      console.error(`   ❌ Error importing row:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} website metrics (${skipped} skipped)\n`)
}

async function importEmailCampaigns(workbook: xlsx.WorkBook, userId: string) {
  console.log('📧 Importing email campaigns...')
  
  const sheet = workbook.Sheets['Mission Brief']
  if (!sheet) {
    console.log('⚠️  Mission Brief sheet not found, skipping')
    return
  }

  // Read with header starting at row 1
  const data = xlsx.utils.sheet_to_json(sheet, { range: 1 })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const emailName = row['Email Name  ']?.toString().trim()
      if (!emailName || emailName === '') {
        skipped++
        continue
      }

      const deploymentDate = parseExcelDate(row['Deployment   \r\nDate  '])
      if (!deploymentDate) {
        skipped++
        continue
      }

      await prisma.emailCampaign.create({
        data: {
          name: emailName,
          deploymentDate,
          openRate: parseFloat(row['Open Rate  ']) || 0,
          clickRate: parseFloat(row['Click Rate  ']) || 0,
          deliveryRate: parseFloat(row['Delivery Rate  ']) || 0,
          unsubscribeRate: parseFloat(row['Unsubscribe %  ']) || 0,
          createdById: userId,
        },
      })
      imported++
    } catch (error: any) {
      console.error(`   ❌ Error importing row:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} email campaigns (${skipped} skipped)\n`)
}

async function importSocialMetrics(workbook: xlsx.WorkBook, userId: string) {
  console.log('👥 Importing social media metrics...')
  
  const sheet = workbook.Sheets['Organic Social Media']
  if (!sheet) {
    console.log('⚠️  Organic Social Media sheet not found, skipping')
    return
  }

  // Read with header starting at row 3
  const data = xlsx.utils.sheet_to_json(sheet, { range: 3 })
  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const weekStarting = parseExcelDate(row['Week Starting'])
      if (!weekStarting) {
        skipped++
        continue
      }

      // Skip rows with no data
      if (!row['LI Impressions'] && !row['IG Impressions']) {
        skipped++
        continue
      }

      await prisma.socialMetric.create({
        data: {
          weekStarting,
          liFollowerGrowthRate: parseFloat(row['LI Follower \r\nGrowth Rate']) || null,
          liImpressions: parseInt(row['LI Impressions']) || null,
          liEngagementRate: parseFloat(row['LI Engagement Rate']) || null,
          liPostsPerWeek: parseInt(row['LI Posts Per Week']) || null,
          liFollowers: parseInt(row['LI Followers']) || null,
          igImpressions: parseInt(row['IG Impressions']) || null,
          igEngagementRate: parseFloat(row['IG Engagement Rate']) || null,
          igPostsPerWeek: parseInt(row['IG Posts Per Week']) || null,
          igFollowers: parseInt(row['Instagram Followers']) || null,
          createdById: userId,
        },
      })
      imported++
    } catch (error: any) {
      console.error(`   ❌ Error importing row:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} social metrics (${skipped} skipped)\n`)
}

async function importClientProjects(workbook: xlsx.WorkBook) {
  console.log('🏢 Importing client projects...')
  
  const sheet = workbook.Sheets['Conversion Tracking']
  if (!sheet) {
    console.log('⚠️  Conversion Tracking sheet not found, skipping')
    return
  }

  const data = xlsx.utils.sheet_to_json(sheet)
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
      console.error(`   ❌ Error importing row:`, error.message)
      skipped++
    }
  }

  console.log(`   ✅ Imported ${imported} client projects (${skipped} skipped)\n`)
}

async function importABTests(workbook: xlsx.WorkBook, userId: string) {
  console.log('🧪 Importing A/B tests...')
  
  const sheet = workbook.Sheets['Optimizations']
  if (!sheet) {
    console.log('⚠️  Optimizations sheet not found, skipping')
    return
  }

  const data = xlsx.utils.sheet_to_json(sheet)
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
  
  // If it's already a decimal (0.15), return as is
  // If it's a percentage (15), convert to decimal
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
