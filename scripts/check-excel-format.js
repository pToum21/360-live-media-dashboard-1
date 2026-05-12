const xlsx = require('xlsx')

const wb = xlsx.readFile('c:\\Users\\ptouma\\Downloads\\2026-360LM-MarketingDashboard.xlsx')
const sheet = wb.Sheets['Mission Brief']
const data = xlsx.utils.sheet_to_json(sheet, { range: 2, header: 1, raw: true })

console.log('Raw Excel values (first 3 email rows):\n')
data.slice(0, 3).forEach((row, i) => {
  console.log(`Row ${i}:`)
  console.log(`  Name (col 0): "${row[0]}"`)
  console.log(`  Date (col 1): ${row[1]}`)
  console.log(`  Open Rate (col 2): ${row[2]} (${typeof row[2]})`)
  console.log(`  Click Rate (col 3): ${row[3]} (${typeof row[3]})`)
  console.log(`  Delivery Rate (col 4): ${row[4]} (${typeof row[4]})`)
  console.log(`  Unsub Rate (col 5): ${row[5]} (${typeof row[5]})`)
  console.log()
})
