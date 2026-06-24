import * as XLSX from 'xlsx'
import * as path from 'path'

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

async function checkWebsiteData() {
  console.log('📊 Checking Website Analytics data in Excel file...\n')

  // Read the Excel file
  const filePath = path.join(process.cwd(), 'excel-analysis', '360-ATC-MarketingDashboardATC2026.xlsx')
  const workbook = XLSX.readFile(filePath)

  console.log('📁 Available sheets:', workbook.SheetNames.join(', '))
  console.log()

  // Check Website (Weekly) sheet
  if (workbook.SheetNames.includes('Website (Weekly)')) {
    console.log('🌐 Analyzing Website (Weekly) sheet...')
    const sheet = workbook.Sheets['Website (Weekly)']
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    console.log(`Total rows in sheet: ${data.length}`)
    
    // Find the header row (row with "Notes >")
    let headerRowIndex = -1
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any[]
      if (row[0] === 'Notes >') {
        headerRowIndex = i
        console.log(`Found header row at index: ${i}`)
        break
      }
    }

    if (headerRowIndex >= 0) {
      const headers = data[headerRowIndex] as string[]
      console.log('\nHeaders:', headers)
      
      let validDates: Date[] = []
      
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i] as any[]
        // Check if first column is a number (Excel date serial)
        if (row[0] && typeof row[0] === 'number') {
          try {
            const weekDate = excelDateToJSDate(row[0])
            validDates.push(weekDate)
          } catch (error) {
            console.log(`Error parsing date at row ${i}:`, row[0])
          }
        }
      }
      
      console.log(`\n✅ Found ${validDates.length} valid date entries`)
      
      if (validDates.length > 0) {
        // Sort dates
        validDates.sort((a, b) => a.getTime() - b.getTime())
        
        console.log(`\n📅 Date Range:`)
        console.log(`   Earliest: ${validDates[0].toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`)
        console.log(`   Latest:   ${validDates[validDates.length - 1].toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`)
        
        // Show first few dates
        console.log(`\n📋 First 10 dates:`)
        for (let i = 0; i < Math.min(10, validDates.length); i++) {
          console.log(`   ${i + 1}. ${validDates[i].toLocaleDateString('en-US')}`)
        }
        
        // Show last few dates
        console.log(`\n📋 Last 10 dates:`)
        const startIndex = Math.max(0, validDates.length - 10)
        for (let i = startIndex; i < validDates.length; i++) {
          console.log(`   ${i + 1}. ${validDates[i].toLocaleDateString('en-US')}`)
        }
      }
    } else {
      console.log('❌ Could not find header row with "Notes >"')
      console.log('\nFirst 20 rows:')
      for (let i = 0; i < Math.min(20, data.length); i++) {
        console.log(`Row ${i}:`, data[i])
      }
    }
  } else {
    console.log('❌ Website (Weekly) sheet not found!')
  }
}

checkWebsiteData()
  .then(() => {
    console.log('\n✅ Analysis complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
