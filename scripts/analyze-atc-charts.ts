import * as XLSX from 'xlsx'
import * as path from 'path'

async function analyzeATCCharts() {
  console.log('📊 Analyzing ATC Excel File for Charts and Data...\n')

  const filePath = path.join(process.cwd(), 'excel-analysis', '360-ATC-MarketingDashboardATC2026.xlsx')
  const workbook = XLSX.readFile(filePath)

  console.log('📄 SHEETS FOUND:')
  console.log('================')
  workbook.SheetNames.forEach((name, idx) => {
    console.log(`${idx + 1}. ${name}`)
  })

  console.log('\n📊 DETAILED SHEET ANALYSIS:')
  console.log('============================\n')

  workbook.SheetNames.forEach((sheetName) => {
    console.log(`\n🔹 Sheet: "${sheetName}"`)
    console.log('─'.repeat(50))
    
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    
    // Get first 10 rows to understand structure
    console.log('First few rows:')
    data.slice(0, 10).forEach((row: any, idx) => {
      if (row && row.length > 0 && row.some((cell: any) => cell !== null && cell !== undefined && cell !== '')) {
        console.log(`  Row ${idx + 1}:`, row.slice(0, 8).map((cell: any) => 
          cell === null || cell === undefined ? 'NULL' : String(cell).substring(0, 30)
        ))
      }
    })
    
    // Count total rows with data
    const rowsWithData = data.filter((row: any) => 
      row && row.length > 0 && row.some((cell: any) => cell !== null && cell !== undefined && cell !== '')
    ).length
    console.log(`Total rows with data: ${rowsWithData}`)
    
    // Try to identify columns
    let headerRow = -1
    for (let i = 0; i < Math.min(10, data.length); i++) {
      const row = data[i] as any[]
      if (row && row.length > 3 && row[0] && typeof row[0] === 'string') {
        // Potential header row
        console.log(`\nPotential headers at row ${i + 1}:`, row.filter(Boolean))
        if (headerRow === -1) headerRow = i
      }
    }
  })

  console.log('\n\n✅ Analysis Complete!')
}

analyzeATCCharts().catch(console.error)
