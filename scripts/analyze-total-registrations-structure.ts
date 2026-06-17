import * as XLSX from 'xlsx'

const workbook = XLSX.readFile('excel-analysis/360-ATC-MarketingDashboardATC2026.xlsx')
const sheet = workbook.Sheets['Total Registrations']
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

console.log('\n📊 Total Registrations Sheet Structure')
console.log('=====================================\n')

// Show first 15 rows to understand the structure
console.log('First 15 rows:\n')
data.slice(0, 15).forEach((row: any, index) => {
  console.log(`Row ${index + 1}:`, row)
})
