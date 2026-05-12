const XLSX = require('xlsx');

const workbook = XLSX.readFile('c:\\Users\\ptouma\\Downloads\\2026-360LM-MarketingDashboard.xlsx');

console.log('='.repeat(80));
console.log('DETAILED EXCEL ANALYSIS');
console.log('='.repeat(80));

workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`SHEET: ${sheetName}`);
    console.log('='.repeat(80));
    console.log(`Total Rows: ${data.length}`);
    
    if (data.length === 0) {
        console.log('⚠️  Empty sheet - likely just a section divider');
        return;
    }
    
    // Show more rows to understand structure
    const rowsToShow = Math.min(15, data.length);
    console.log(`\nShowing first ${rowsToShow} rows:\n`);
    
    for (let i = 0; i < rowsToShow; i++) {
        console.log(`Row ${i}:`, JSON.stringify(data[i]));
    }
    
    // Check for formulas by looking at cell objects
    console.log('\n--- Checking for calculated fields (formulas) ---');
    const range = XLSX.utils.decode_range(sheet['!ref']);
    let formulaCount = 0;
    let sampleFormulas = [];
    
    for (let R = range.s.r; R <= Math.min(range.s.r + 20, range.e.r); R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = sheet[cellAddress];
            if (cell && cell.f) {
                formulaCount++;
                if (sampleFormulas.length < 5) {
                    sampleFormulas.push(`  ${cellAddress}: ${cell.f}`);
                }
            }
        }
    }
    
    if (formulaCount > 0) {
        console.log(`Found ${formulaCount} formulas in first 20 rows`);
        console.log('Sample formulas:');
        sampleFormulas.forEach(f => console.log(f));
    } else {
        console.log('No formulas detected - likely all manual entry or external imports');
    }
    
    // Analyze column structure
    if (data.length > 0) {
        console.log('\n--- Column Analysis ---');
        const headers = data[0].filter(h => h && h.toString().trim() !== '');
        if (headers.length > 0) {
            console.log(`Columns detected (Row 0): ${headers.length}`);
            headers.forEach((h, idx) => {
                console.log(`  Col ${idx}: "${h}"`);
            });
        }
        
        // Check for date patterns
        const datePatterns = data.slice(1, 10).filter(row => {
            return row.some(cell => {
                const str = cell.toString();
                return str.match(/^\d{5}$/) || // Excel date serial
                       str.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/) || // Date format
                       str.toLowerCase().includes('week starting') ||
                       str.toLowerCase().includes('january') ||
                       str.toLowerCase().includes('february');
            });
        });
        
        if (datePatterns.length > 0) {
            console.log('\n📅 Date-based rows detected - suggests weekly/monthly tracking');
        }
    }
});

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS COMPLETE');
console.log('='.repeat(80));
