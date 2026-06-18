import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import * as path from 'path'

const prisma = new PrismaClient()
const EXCEL_FILE_PATH = path.join(process.cwd(), 'excel-analysis', '360-ATC-MarketingDashboardATC2026.xlsx')

async function main() {
  try {
    console.log('📊 Importing ATC Social Media Data from Excel...\n')

    // Get ATC client
    const atcClient = await prisma.client.findUnique({
      where: { slug: 'atc-2026' }
    })

    if (!atcClient) {
      console.log('❌ ATC client not found')
      return
    }

    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { email: { contains: '@' } }
    })

    if (!adminUser) {
      console.log('❌ No user found')
      return
    }

    // Read Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH)
    const weeklySheet = workbook.Sheets['Organic Social Media (Weekly)']
    
    if (!weeklySheet) {
      console.log('❌ Could not find "Organic Social Media (Weekly)" sheet')
      return
    }

    // Read all rows as array (header: 1 means first row is row 0)
    const rawData = XLSX.utils.sheet_to_json<any>(weeklySheet, { header: 1, defval: null })
    
    // Row 3 (index 3) has the actual column headers
    const headers = rawData[3] as any[]
    
    // Data starts at row 4 (index 4)
    const dataRows = rawData.slice(4)
    
    console.log(`Found ${dataRows.length} data rows\n`)
    
    // Delete existing social metrics for ATC to avoid duplicates
    const deleted = await prisma.socialMetric.deleteMany({
      where: { clientId: atcClient.id }
    })
    console.log(`🗑️  Deleted ${deleted.count} existing social metrics\n`)

    let imported = 0
    let skipped = 0

    for (const row of dataRows) {
      // Column A (index 0) = Week Starting date
      const weekStarting = row[0]
      
      if (!weekStarting || typeof weekStarting !== 'number') {
        skipped++
        continue
      }

      // Convert Excel date to JS date
      const date = XLSX.SSF.parse_date_code(weekStarting)
      const weekDate = new Date(date.y, date.m - 1, date.d)

      // Parse all the social media data from the columns
      // Based on the Excel structure from earlier analysis:
      // Column B (1) = LI Followers
      // Column C (2) = LI Follower Growth Rate
      // Column D (3) = LI Impressions
      // Column E (4) = LI Engagements
      // Column F (5) = LI Posts Per Week
      // Column G (6) = FB Followers
      // Column H (7) = FB Follower Growth Rate
      // Column I (8) = FB Impressions
      // Column J (9) = FB Engagements
      // Column K (10) = FB Posts Per Week
      // Column L (11) = IG Followers
      // Column M (12) = IG Follower Growth Rate
      // Column N (13) = IG Impressions
      // Column O (14) = IG Engagements
      // Column P (15) = IG Posts Per Week
      // Column Q (16) = X Followers
      // Column R (17) = X Follower Growth Rate
      // Column S (18) = X Impressions
      // Column T (19) = X Engagements
      // Column U (20) = X Posts Per Week

      const liFollowers = typeof row[1] === 'number' ? Math.round(row[1]) : null
      const liFollowerGrowthRate = typeof row[2] === 'number' ? row[2] : null
      const liImpressions = typeof row[3] === 'number' ? Math.round(row[3]) : null
      const liEngagements = typeof row[4] === 'number' ? Math.round(row[4]) : null
      const liPostsPerWeek = typeof row[5] === 'number' ? Math.round(row[5]) : null
      
      const fbFollowers = typeof row[6] === 'number' ? Math.round(row[6]) : null
      const fbFollowerGrowthRate = typeof row[7] === 'number' ? row[7] : null
      const fbImpressions = typeof row[8] === 'number' ? Math.round(row[8]) : null
      const fbEngagements = typeof row[9] === 'number' ? Math.round(row[9]) : null
      const fbPostsPerWeek = typeof row[10] === 'number' ? Math.round(row[10]) : null
      
      const igFollowers = typeof row[11] === 'number' ? Math.round(row[11]) : null
      const igFollowerGrowthRate = typeof row[12] === 'number' ? row[12] : null
      const igImpressions = typeof row[13] === 'number' ? Math.round(row[13]) : null
      const igEngagements = typeof row[14] === 'number' ? Math.round(row[14]) : null
      const igPostsPerWeek = typeof row[15] === 'number' ? Math.round(row[15]) : null
      
      const xFollowers = typeof row[16] === 'number' ? Math.round(row[16]) : null
      const xFollowerGrowthRate = typeof row[17] === 'number' ? row[17] : null
      const xImpressions = typeof row[18] === 'number' ? Math.round(row[18]) : null
      const xEngagements = typeof row[19] === 'number' ? Math.round(row[19]) : null
      const xPostsPerWeek = typeof row[20] === 'number' ? Math.round(row[20]) : null

      // Calculate engagement rates for LI and IG if we have the data
      const liEngagementRate = (liImpressions && liEngagements) ? liEngagements / liImpressions : null
      const igEngagementRate = (igImpressions && igEngagements) ? igEngagements / igImpressions : null

      try {
        await prisma.socialMetric.create({
          data: {
            weekStarting: weekDate,
            liFollowers,
            liFollowerGrowthRate,
            liImpressions,
            liEngagementRate,
            liPostsPerWeek,
            igFollowers,
            igImpressions,
            igEngagementRate,
            igPostsPerWeek,
            fbFollowers,
            fbFollowerGrowthRate,
            fbImpressions,
            fbEngagements,
            fbPostsPerWeek,
            xFollowers,
            xFollowerGrowthRate,
            xImpressions,
            xEngagements,
            xPostsPerWeek,
            clientId: atcClient.id,
            createdById: adminUser.id,
          }
        })
        
        imported++
        if (imported <= 3) {
          console.log(`✅ Imported week ${weekDate.toLocaleDateString()}`)
          console.log(`   LI: ${liFollowers} followers, ${liImpressions} impressions, ${liPostsPerWeek} posts`)
          console.log(`   FB: ${fbFollowers} followers, ${fbImpressions} impressions, ${fbPostsPerWeek} posts`)
          console.log(`   IG: ${igFollowers} followers, ${igImpressions} impressions, ${igPostsPerWeek} posts`)
          console.log(`   X: ${xFollowers} followers, ${xImpressions} impressions, ${xPostsPerWeek} posts\n`)
        }
      } catch (error) {
        console.error(`❌ Error importing week ${weekDate.toLocaleDateString()}:`, error)
        skipped++
      }
    }

    console.log(`\n✅ Import complete!`)
    console.log(`   Imported: ${imported}`)
    console.log(`   Skipped: ${skipped}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
