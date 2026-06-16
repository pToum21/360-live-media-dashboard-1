import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'
import * as path from 'path'

const prisma = new PrismaClient()

// Helper function to parse Excel date serial numbers
function excelDateToJSDate(serial: any): Date {
  if (serial instanceof Date) return serial
  if (typeof serial === 'string') return new Date(serial)
  
  // Excel dates are number of days since 1900-01-01
  const utc_days  = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate())
}

// Helper to safely parse numbers
function parseNum(val: any): number {
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const cleaned = val.replace(/[,%$]/g, '')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }
  return 0
}

// Helper to safely parse percentages
function parsePercent(val: any): number {
  const num = parseNum(val)
  // If it's already a decimal (< 1), return as is
  // If it's a percentage (> 1), divide by 100
  return num > 1 ? num / 100 : num
}

async function importATCData() {
  console.log('🚀 Starting ATC 2026 Complete Data Import...\n')

  // Read the Excel file
  const filePath = path.join(process.cwd(), 'excel-analysis', '360-ATC-MarketingDashboardATC2026.xlsx')
  const workbook = XLSX.readFile(filePath)

  console.log('📁 Available sheets:', workbook.SheetNames.join(', '))
  console.log()

  // Get any user (needed for createdById)
  const user = await prisma.user.findFirst()

  if (!user) {
    throw new Error('No user found! Please sign in to the dashboard first.')
  }
  
  console.log(`👤 Using user: ${user.email}`)

  // Create or update the ATC 2026 client
  const client = await prisma.client.upsert({
    where: { slug: 'atc-2026' },
    update: {
      name: 'ATC 2026',
      eventName: 'American Transplant Congress',
      year: 2026,
      campaignStatus: 'Active',
      dashboardStatus: 'Live',
      conversionTracking: true,
      utmTracking: true,
    },
    create: {
      name: 'ATC 2026',
      slug: 'atc-2026',
      eventName: 'American Transplant Congress',
      year: 2026,
      campaignStatus: 'Active',
      dashboardStatus: 'Live',
      conversionTracking: true,
      utmTracking: true,
    },
  })

  console.log(`✅ Client: ${client.name} (${client.id})`)
  console.log()

  // 1. IMPORT WEBSITE ANALYTICS (WEEKLY)
  if (workbook.SheetNames.includes('Website (Weekly)')) {
    console.log('🌐 Importing Website Analytics (Weekly)...')
    const sheet = workbook.Sheets['Website (Weekly)']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    // Find the header row (row with "Notes >")
    let headerRowIndex = -1
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any[]
      if (row[0] === 'Notes >') {
        headerRowIndex = i
        break
      }
    }

    if (headerRowIndex >= 0) {
      const headers = data[headerRowIndex] as string[]
      let count = 0
      
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i] as any[]
        if (!row[0] || row[0] === '' || typeof row[0] !== 'number') continue
        
        try {
          const weekDate = excelDateToJSDate(row[0])
          
          await prisma.websiteMetric.create({
            data: {
              clientId: client.id,
              weekStarting: weekDate,
              newUsers: parseInt(row[1]) || 0,
              totalUsers: parseInt(row[3]) || 0,
              avgEngagementTimeSec: parseInt(row[6]) || 0,
              referral: parseInt(row[7]) || 0,
              organicSearch: parseInt(row[8]) || 0,
              direct: parseInt(row[9]) || 0,
              organicSocial: parseInt(row[10]) || 0,
              email: parseInt(row[11]) || 0,
              unassigned: parseInt(row[12]) || 0,
              paidSocial: parseInt(row[13]) || 0,
              paidSearch: parseInt(row[14]) || 0,
              createdById: user.id,
            },
          })
          count++
        } catch (error: any) {
          console.log(`  ⚠️  Skipping row ${i}: ${error.message}`)
        }
      }
      console.log(`  ✅ Imported ${count} website metrics`)
    }
    console.log()
  }

  // 2. IMPORT EMAIL CAMPAIGNS
  if (workbook.SheetNames.includes('Emails')) {
    console.log('📧 Importing Email Campaigns...')
    const sheet = workbook.Sheets['Emails']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    // Find header row
    let headerRowIndex = -1
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any[]
      if (row[0] === 'Email Name') {
        headerRowIndex = i
        break
      }
    }

    if (headerRowIndex >= 0) {
      let count = 0
      
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i] as any[]
        if (!row[0] || row[0] === '') continue
        
        try {
          const deploymentDate = excelDateToJSDate(row[2])
          
          await prisma.emailCampaign.create({
            data: {
              clientId: client.id,
              name: row[0],
              audience: row[1] || null,
              deploymentDate,
              totalSent: parseInt(row[5]) || null,
              openRate: parsePercent(row[6]),
              openRateBenchmark: parsePercent(row[7]),
              clickRate: parsePercent(row[8]),
              clickRateBenchmark: parsePercent(row[9]),
              deliveryRate: parsePercent(row[12]),
              deliveryRateBenchmark: parsePercent(row[13]),
              unsubscribeRate: parsePercent(row[14]),
              unsubscribeRateBenchmark: parsePercent(row[15]),
              subjectLine: row[16] || null,
              createdById: user.id,
            },
          })
          count++
        } catch (error: any) {
          console.log(`  ⚠️  Skipping email row ${i}: ${error.message}`)
        }
      }
      console.log(`  ✅ Imported ${count} email campaigns`)
    }
    console.log()
  }

  // 3. IMPORT SOCIAL MEDIA (WEEKLY)
  if (workbook.SheetNames.includes('Organic Social Media (Weekly)')) {
    console.log('📱 Importing Social Media (Weekly)...')
    const sheet = workbook.Sheets['Organic Social Media (Weekly)']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    // Find header row
    let headerRowIndex = -1
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any[]
      if (row[0] === 'Notes >') {
        headerRowIndex = i
        break
      }
    }

    if (headerRowIndex >= 0) {
      let count = 0
      
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i] as any[]
        if (!row[0] || typeof row[0] !== 'number') continue
        
        try {
          const weekDate = excelDateToJSDate(row[0])
          
          await prisma.socialMetric.create({
            data: {
              clientId: client.id,
              weekStarting: weekDate,
              // LinkedIn (columns 1-5)
              liFollowers: parseInt(row[1]) || null,
              liFollowerGrowthRate: parsePercent(row[2]),
              liImpressions: parseInt(row[3]) || null,
              liEngagementRate: null, // Will calculate from engagements
              liPostsPerWeek: parseInt(row[5]) || null,
              // Facebook (columns 6-10)
              fbFollowers: parseInt(row[6]) || null,
              fbFollowerGrowthRate: parsePercent(row[7]),
              fbImpressions: parseInt(row[8]) || null,
              fbEngagements: parseInt(row[9]) || null,
              fbPostsPerWeek: parseInt(row[10]) || null,
              // Instagram (columns 11-15)
              igFollowers: parseInt(row[11]) || null,
              igEngagementRate: parsePercent(row[12]),
              igImpressions: parseInt(row[13]) || null,
              igPostsPerWeek: parseInt(row[15]) || null,
              // Twitter/X (columns 16-20)
              xFollowers: parseInt(row[16]) || null,
              xFollowerGrowthRate: parsePercent(row[17]),
              xImpressions: parseInt(row[18]) || null,
              xEngagements: parseInt(row[19]) || null,
              xPostsPerWeek: parseInt(row[20]) || null,
              createdById: user.id,
            },
          })
          count++
        } catch (error: any) {
          console.log(`  ⚠️  Skipping social row ${i}: ${error.message}`)
        }
      }
      console.log(`  ✅ Imported ${count} social media metrics`)
    }
    console.log()
  }

  // 4. IMPORT PAID MEDIA
  if (workbook.SheetNames.includes('Paid Media')) {
    console.log('💰 Importing Paid Media...')
    const sheet = workbook.Sheets['Paid Media']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    // Find header row
    let headerRowIndex = -1
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any[]
      if (row[0] === 'Notes >') {
        headerRowIndex = i
        break
      }
    }

    if (headerRowIndex >= 0) {
      let count = 0
      
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i] as any[]
        if (!row[0] || typeof row[0] !== 'number') continue
        
        try {
          const weekDate = excelDateToJSDate(row[0])
          
          await prisma.paidMedia.create({
            data: {
              clientId: client.id,
              weekStarting: weekDate,
              // LinkedIn (columns 1-8)
              liImpressions: parseInt(row[1]) || null,
              liClicks: parseInt(row[2]) || null,
              liSpend: parseNum(row[3]),
              liCPC: parseNum(row[4]),
              liCTR: parsePercent(row[5]),
              liConversions: parseInt(row[6]) || null,
              liCVR: parsePercent(row[7]),
              liCPA: parseNum(row[8]),
              // Meta (columns 9-16)
              metaImpressions: parseInt(row[9]) || null,
              metaClicks: parseInt(row[10]) || null,
              metaSpend: parseNum(row[11]),
              metaCPC: parseNum(row[12]),
              metaCTR: parsePercent(row[13]),
              metaConversions: parseInt(row[14]) || null,
              metaCVR: parsePercent(row[15]),
              metaCPA: parseNum(row[16]),
              // Google Search (columns 17-24)
              googleSearchImpressions: parseInt(row[17]) || null,
              googleSearchClicks: parseInt(row[18]) || null,
              googleSearchSpend: parseNum(row[19]),
              googleSearchCPC: parseNum(row[20]),
              googleSearchCTR: parsePercent(row[21]),
              googleSearchConversions: parseInt(row[22]) || null,
              googleSearchCVR: parsePercent(row[23]),
              googleSearchCPA: parseNum(row[24]),
              // Google Display (columns 25-32)
              googleDisplayImpressions: parseInt(row[25]) || null,
              googleDisplayClicks: parseInt(row[26]) || null,
              googleDisplaySpend: parseNum(row[27]),
              googleDisplayCPC: parseNum(row[28]),
              googleDisplayCTR: parsePercent(row[29]),
              googleDisplayConversions: parseInt(row[30]) || null,
              googleDisplayCVR: parsePercent(row[31]),
              googleDisplayCPA: parseNum(row[32]),
              createdById: user.id,
            },
          })
          count++
        } catch (error: any) {
          console.log(`  ⚠️  Skipping paid media row ${i}: ${error.message}`)
        }
      }
      console.log(`  ✅ Imported ${count} paid media records`)
    }
    console.log()
  }

  // 5. IMPORT A/B TESTING
  if (workbook.SheetNames.includes('Optimizations')) {
    console.log('🧪 Importing A/B Tests...')
    const sheet = workbook.Sheets['Optimizations']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    let count = 0
    for (let i = 1; i < data.length; i++) {
      const row = data[i] as any[]
      if (!row[0] || row[0] === '') continue
      
      try {
        await prisma.optimization.create({
          data: {
            clientId: client.id,
            month: row[0],
            channel: row[1] || null,
            controlTest: row[2] || null,
            testVariant: row[3] || null,
            results: row[4] || null,
            conclusions: row[5] || null,
            createdById: user.id,
          },
        })
        count++
      } catch (error: any) {
        console.log(`  ⚠️  Skipping test row ${i}: ${error.message}`)
      }
    }
    console.log(`  ✅ Imported ${count} A/B tests`)
    console.log()
  }

  console.log('🎉 ATC 2026 Complete Data Import Finished!')
  console.log(`\n📊 Summary:`)
  console.log(`   Client: ${client.name}`)
  console.log(`   Slug: ${client.slug}`)
  console.log(`   ID: ${client.id}`)
  console.log(`\n✨ Dashboard is ready at: http://localhost:3000/dashboard`)
}

importATCData()
  .catch((error) => {
    console.error('❌ Error importing ATC data:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
