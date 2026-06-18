import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import * as path from 'path'

const prisma = new PrismaClient()
const EXCEL_FILE_PATH = path.join(process.cwd(), 'excel-analysis', 'Hannah & Trey Master Promo Calendar.xlsx')

async function main() {
  try {
    console.log('📊 Starting Sales Marketing import...\n')

    // Get ATC client
    const atcClient = await prisma.client.findUnique({
      where: { slug: 'atc-2026' }
    })

    if (!atcClient) {
      console.log('❌ ATC client not found')
      return
    }

    console.log(`Found ATC client: ${atcClient.name}\n`)

    // Get user to assign as creator
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('❌ No user found')
      return
    }

    // Read Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH)
    const sheet = workbook.Sheets['ATC - Sara & Sky']
    
    if (!sheet) {
      console.log('❌ Could not find "ATC - Sara & Sky" sheet')
      return
    }

    // Get raw data
    const rawData = XLSX.utils.sheet_to_json<any>(sheet, { header: 1, defval: null })
    
    // Row 2 (index 1) contains the actual headers
    const headers = rawData[1] as string[]
    
    console.log('Headers:', headers)
    console.log(`\nTotal raw rows: ${rawData.length}`)
    
    // Find column indices
    const colIndices = {
      weekOf: 0,
      targetSendDate: 1,
      audience: 2,
      subjectMessage: 3,
      opportunities: 4,
      notes: 5,
      status: 6,
      finalLink: 7,
      sent: 8,
      reportSent: 9,
      micrositeVisits: 10,
      openRate: 11,
      clickRate: 12,
      bounces: 13,
      unsubs: 14
    }
    
    // Delete existing ATC sales marketing data
    const deleted = await prisma.salesMarketing.deleteMany({
      where: { clientId: atcClient.id }
    })
    console.log(`🗑️  Deleted ${deleted.count} existing sales marketing records\n`)

    // Process data rows (starting from row 3, index 2)
    let imported = 0
    let skipped = 0
    const records = []

    for (let i = 2; i < rawData.length; i++) {
      const row = rawData[i] as any[]
      
      if (!row || row.length === 0) {
        skipped++
        continue
      }

      const weekOfValue = row[colIndices.weekOf]
      
      // Skip rows without a valid week date
      if (!weekOfValue || typeof weekOfValue !== 'number') {
        skipped++
        continue
      }

      // Convert Excel date serial number to Date
      const weekOf = XLSX.SSF.parse_date_code(weekOfValue)
      const weekOfDate = new Date(Date.UTC(weekOf.y, weekOf.m - 1, weekOf.d))
      
      // Parse target send date if present
      let targetSendDate: Date | null = null
      const targetSendValue = row[colIndices.targetSendDate]
      if (targetSendValue && typeof targetSendValue === 'number') {
        const targetSend = XLSX.SSF.parse_date_code(targetSendValue)
        targetSendDate = new Date(Date.UTC(targetSend.y, targetSend.m - 1, targetSend.d))
      }

      // Get string fields
      const audience = row[colIndices.audience] ? String(row[colIndices.audience]).trim() : null
      const subjectMessage = row[colIndices.subjectMessage] ? String(row[colIndices.subjectMessage]).trim() : null
      const opportunities = row[colIndices.opportunities] ? String(row[colIndices.opportunities]).trim() : null
      const notes = row[colIndices.notes] ? String(row[colIndices.notes]).trim() : null
      const status = row[colIndices.status] ? String(row[colIndices.status]).trim() : null
      const finalLink = row[colIndices.finalLink] ? String(row[colIndices.finalLink]).trim() : null
      const sent = row[colIndices.sent] ? String(row[colIndices.sent]).trim() : null
      const reportSent = row[colIndices.reportSent] ? String(row[colIndices.reportSent]).trim() : null

      // Get numeric fields
      const micrositeVisits = row[colIndices.micrositeVisits] ? parseInt(String(row[colIndices.micrositeVisits])) : null
      const bounces = row[colIndices.bounces] ? parseInt(String(row[colIndices.bounces])) : null
      const unsubs = row[colIndices.unsubs] ? parseInt(String(row[colIndices.unsubs])) : null
      
      // Get rate fields (convert if they're percentages)
      let openRate = row[colIndices.openRate]
      if (openRate !== null && openRate !== undefined) {
        openRate = typeof openRate === 'number' ? openRate : parseFloat(String(openRate))
        // If it's a large number, it's likely already a percentage, so convert to decimal
        if (openRate > 1) {
          openRate = openRate / 100
        }
      } else {
        openRate = null
      }

      let clickRate = row[colIndices.clickRate]
      if (clickRate !== null && clickRate !== undefined) {
        clickRate = typeof clickRate === 'number' ? clickRate : parseFloat(String(clickRate))
        if (clickRate > 1) {
          clickRate = clickRate / 100
        }
      } else {
        clickRate = null
      }

      const record = {
        weekOf: weekOfDate,
        targetSendDate,
        audience,
        subjectMessage,
        opportunities,
        notes,
        status,
        finalLink,
        sent,
        reportSent,
        micrositeVisits,
        openRate,
        clickRate,
        bounces,
        unsubs,
        clientId: atcClient.id,
        createdById: user.id
      }

      records.push(record)
      imported++
    }

    // Insert all records
    console.log(`\n📥 Importing ${records.length} sales marketing records...`)
    
    for (const record of records) {
      await prisma.salesMarketing.create({
        data: record
      })
    }

    console.log(`\n✅ Import complete!`)
    console.log(`   Imported: ${imported}`)
    console.log(`   Skipped: ${skipped}`)

    // Show sample of imported data
    const sample = await prisma.salesMarketing.findMany({
      where: { clientId: atcClient.id },
      take: 3,
      orderBy: { weekOf: 'desc' }
    })

    console.log('\n📋 Sample of imported data:')
    sample.forEach((record, i) => {
      console.log(`\n${i + 1}. Week: ${record.weekOf.toISOString().split('T')[0]}`)
      console.log(`   Audience: ${record.audience || 'N/A'}`)
      console.log(`   Subject: ${record.subjectMessage || 'N/A'}`)
      console.log(`   Open Rate: ${record.openRate ? (record.openRate * 100).toFixed(2) + '%' : 'N/A'}`)
      console.log(`   Click Rate: ${record.clickRate ? (record.clickRate * 100).toFixed(2) + '%' : 'N/A'}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
