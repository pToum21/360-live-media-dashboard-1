import * as XLSX from 'xlsx'

const workbook = XLSX.readFile('excel-analysis/360-ATC-MarketingDashboardATC2026.xlsx')

console.log('\n📋 All Tabs in ATC Excel File:')
console.log('================================\n')

workbook.SheetNames.forEach((name, index) => {
  const sheet = workbook.Sheets[name]
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  const rowCount = data.length
  
  console.log(`${index + 1}. ${name}`)
  console.log(`   Rows: ${rowCount}`)
  
  // Show first row (headers) if exists
  if (data.length > 0 && Array.isArray(data[0])) {
    const headers = (data[0] as any[]).filter(h => h !== null && h !== undefined && h !== '')
    if (headers.length > 0) {
      console.log(`   Columns: ${headers.slice(0, 5).join(', ')}${headers.length > 5 ? '...' : ''}`)
    }
  }
  console.log('')
})

console.log('================================\n')
