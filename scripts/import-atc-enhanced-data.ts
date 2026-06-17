import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'
import * as path from 'path'

const prisma = new PrismaClient()

// Helper functions
function excelDateToJSDate(serial: any): Date {
  if (serial instanceof Date) return serial
  if (typeof serial === 'string') return new Date(serial)
  const utc_days  = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate())
}

function parseNum(val: any): number {
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const cleaned = val.replace(/[,%$]/g, '')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }
  return 0
}

function parsePercent(val: any): number {
  const num = parseNum(val)
  return num > 1 ? num / 100 : num
}

function extractTimeOfDay(timeDecimal: number | null | undefined): string | null {
  if (!timeDecimal) return null
  const hours = Math.floor(timeDecimal * 24)
  if (hours >= 5 && hours < 12) return 'Morning'
  if (hours >= 12 && hours < 17) return 'Afternoon'
  if (hours >= 17 && hours < 21) return 'Evening'
  return 'Night'
}

function extractHour(timeDecimal: number | null | undefined): number | null {
  if (!timeDecimal) return null
  return Math.floor(timeDecimal * 24)
}

async function importEnhancedATCData() {
  console.log('🚀 Importing ENHANCED ATC Data (Heatmap, Timing, GA4)...\n')

  const filePath = path.join(process.cwd(), 'excel-analysis', '360-ATC-MarketingDashboardATC2026.xlsx')
  const workbook = XLSX.readFile(filePath)

  const user = await prisma.user.findFirst()
  if (!user) throw new Error('No user found!')

  const client = await prisma.client.findUnique({
    where: { slug: 'atc-2026' }
  })
  if (!client) throw new Error('ATC 2026 client not found!')

  console.log(`✅ Client: ${client.name} (${client.id})\n`)

  // ===============================
  // 1. UPDATE EMAILS WITH TIMING DATA
  // ===============================
  if (workbook.SheetNames.includes('Emails')) {
    console.log('⏰ Updating Emails with Timing Data...')
    const sheet = workbook.Sheets['Emails']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    let updateCount = 0
    for (let i = 2; i < data.length; i++) {
      const row = data[i] as any[]
      if (!row[0] || row[0] === '') continue
      
      const emailName = row[0]
      const dayOfWeek = row[3] // Column D: Day of Week
      const timeOfDay = extractTimeOfDay(row[4]) // Column E: Time decimal
      const hour = extractHour(row[4])
      
      try {
        const existing = await prisma.emailCampaign.findFirst({
          where: {
            clientId: client.id,
            name: { contains: emailName.substring(0, 20) }
          }
        })
        
        if (existing) {
          await prisma.emailCampaign.update({
            where: { id: existing.id },
            data: {
              deploymentDayOfWeek: dayOfWeek || null,
              deploymentTimeOfDay: timeOfDay,
              deploymentHour: hour
            }
          })
          updateCount++
        }
      } catch (error) {
        // Skip
      }
    }
    console.log(`  ✅ Updated ${updateCount} emails with timing data\n`)
  }

  // ===============================
  // 2. IMPORT EMAIL HEATMAP DATA
  // ===============================
  if (workbook.SheetNames.includes('Heatmap')) {
    console.log('🗺️  Importing Email Heatmap Data...')
    const sheet = workbook.Sheets['Heatmap']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    let updateCount = 0
    for (let i = 2; i < data.length; i++) {
      const row = data[i] as any[]
      if (!row[0] || row[0] === '') continue
      
      const emailName = row[0]
      const totalClicks = parseInt(row[2]) || null
      const topButtonClicks = parseInt(row[3]) || null
      const topButtonPct = parsePercent(row[4])
      const topLogoClicks = parseInt(row[5]) || null
      const topLogoPct = parsePercent(row[6])
      const headerClicks = parseInt(row[7]) || null
      const headerPct = parsePercent(row[8])
      const bodyClicks = parseInt(row[9]) || null
      const bodyPct = parsePercent(row[10])
      const footerClicks = parseInt(row[11]) || null
      const footerPct = parsePercent(row[12])
      
      try {
        const existing = await prisma.emailCampaign.findFirst({
          where: {
            clientId: client.id,
            name: { contains: emailName.substring(0, 20) }
          }
        })
        
        if (existing) {
          await prisma.emailCampaign.update({
            where: { id: existing.id },
            data: {
              totalClicks,
              topButtonClicks,
              topButtonClickPct: topButtonPct > 0 ? topButtonPct : null,
              topLogoClicks,
              topLogoClickPct: topLogoPct > 0 ? topLogoPct : null,
              headerImageClicks: headerClicks,
              headerImageClickPct: headerPct > 0 ? headerPct : null,
              bodyContentClicks: bodyClicks,
              bodyContentClickPct: bodyPct > 0 ? bodyPct : null,
              footerClicks,
              footerClickPct: footerPct > 0 ? footerPct : null,
            }
          })
          updateCount++
        }
      } catch (error) {
        // Skip
      }
    }
    console.log(`  ✅ Updated ${updateCount} emails with heatmap data\n`)
  }

  // ===============================
  // 3. IMPORT GA4 REGISTRATION DATA BY TRAFFIC SOURCE
  // ===============================
  if (workbook.SheetNames.includes('GA4 Registrations')) {
    console.log('📊 Importing GA4 Registration Data by Traffic Source...')
    const sheet = workbook.Sheets['GA4 Registrations']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    // Find the header row with weeks
    let weekHeaderRow = -1
    let weeksOutRow = -1
    for (let i = 0; i < Math.min(10, data.length); i++) {
      const row = data[i] as any[]
      if (row[0] === 'Weeks Out') {
        weeksOutRow = i
        weekHeaderRow = i + 2 // Week dates are 2 rows after "Weeks Out"
        break
      }
    }
    
    if (weekHeaderRow < 0) {
      console.log('  ⚠️  Could not find week header row')
      return
    }
    
    const weekRow = data[weekHeaderRow] as any[]
    const weeksOutValues = data[weeksOutRow] as any[]
    
    // Process each traffic source row
    const sourceRows: { [key: string]: number } = {
      'Organic Search': -1,
      'Email': -1,
      'Direct': -1,
      'Paid Social': -1,
      'Paid Search': -1,
      'Referral': -1,
      'Organic Social': -1,
    }
    
    for (let i = weekHeaderRow; i < data.length; i++) {
      const row = data[i] as any[]
      const sourceName = (row[0] || '').toString().trim()
      if (sourceRows[sourceName] === undefined) continue
      sourceRows[sourceName] = i
    }
    
    let importCount = 0
    // Process each week column
    for (let colIdx = 1; colIdx < weekRow.length && colIdx < 30; colIdx++) {
      if (!weekRow[colIdx]) continue
      
      const weekLabel = weekRow[colIdx].toString()
      const weeksOut = parseInt(weeksOutValues[colIdx]) || null
      
      // Extract counts for each traffic source
      const organicSearch = sourceRows['Organic Search'] >= 0 
        ? (parseInt((data[sourceRows['Organic Search']] as any)[colIdx]) || 0) 
        : 0
      const email = sourceRows['Email'] >= 0 
        ? (parseInt((data[sourceRows['Email']] as any)[colIdx]) || 0) 
        : 0
      const direct = sourceRows['Direct'] >= 0 
        ? (parseInt((data[sourceRows['Direct']] as any)[colIdx]) || 0) 
        : 0
      const paidSocial = sourceRows['Paid Social'] >= 0 
        ? (parseInt((data[sourceRows['Paid Social']] as any)[colIdx]) || 0) 
        : 0
      const paidSearch = sourceRows['Paid Search'] >= 0 
        ? (parseInt((data[sourceRows['Paid Search']] as any)[colIdx]) || 0) 
        : 0
      const referral = sourceRows['Referral'] >= 0 
        ? (parseInt((data[sourceRows['Referral']] as any)[colIdx]) || 0) 
        : 0
      const organicSocial = sourceRows['Organic Social'] >= 0 
        ? (parseInt((data[sourceRows['Organic Social']] as any)[colIdx]) || 0) 
        : 0
      
      const total = organicSearch + email + direct + paidSocial + paidSearch + referral + organicSocial
      
      if (total === 0) continue
      
      // Parse week date (format: "1/5 - 1/11")
      let weekStartDate: Date
      try {
        const dateParts = weekLabel.split(' - ')[0].split('/')
        weekStartDate = new Date(2026, parseInt(dateParts[0]) - 1, parseInt(dateParts[1]))
      } catch {
        continue
      }
      
      try {
        await prisma.gA4Registration.create({
          data: {
            clientId: client.id,
            weekStarting: weekStartDate,
            weekLabel,
            weeksOut,
            organicSearch: organicSearch > 0 ? organicSearch : null,
            email: email > 0 ? email : null,
            direct: direct > 0 ? direct : null,
            paidSocial: paidSocial > 0 ? paidSocial : null,
            paidSearch: paidSearch > 0 ? paidSearch : null,
            referral: referral > 0 ? referral : null,
            organicSocial: organicSocial > 0 ? organicSocial : null,
            totalRegistrations: total,
            createdById: user.id,
          },
        })
        importCount++
      } catch (error: any) {
        // Skip duplicates
      }
    }
    console.log(`  ✅ Imported ${importCount} weeks of GA4 registration data\n`)
  }

  console.log('\n✨ Enhanced ATC Data Import Complete!')
}

importEnhancedATCData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
