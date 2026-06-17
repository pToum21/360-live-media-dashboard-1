import * as XLSX from 'xlsx'

const workbook = XLSX.readFile('excel-analysis/360-ATC-MarketingDashboardATC2026.xlsx')
const sheet = workbook.Sheets['Total Registrations']
const data: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false })

console.log('\n📋 Total Registrations Sheet - First 50 rows:\n')

for (let i = 0; i < Math.min(50, data.length); i++) {
  const row = data[i] as any[]
  if (row && row.length > 0) {
    console.log(`Row ${i + 1}: [${row.slice(0, 5).map(c => `"${c}"`).join(', ')}]`)
  }
}
