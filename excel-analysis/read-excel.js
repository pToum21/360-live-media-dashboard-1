const XLSX = require('xlsx');

const workbook = XLSX.readFile('c:\\Users\\ptouma\\Downloads\\2026-360LM-MarketingDashboard.xlsx');

console.log('Sheet names:', workbook.SheetNames);
console.log('\n=== Sheet Details ===\n');

workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    
    console.log(`\n--- ${sheetName} ---`);
    console.log(`Rows: ${data.length}`);
    
    // Show first few rows
    if (data.length > 0) {
        console.log('\nFirst few rows:');
        data.slice(0, 5).forEach((row, idx) => {
            console.log(`Row ${idx}:`, row.slice(0, 10)); // First 10 columns
        });
    }
});
