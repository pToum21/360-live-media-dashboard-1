const XLSX = require('xlsx');

const workbook = XLSX.readFile('c:\\Users\\ptouma\\Downloads\\2026-360LM-MarketingDashboard.xlsx');
const dashboardSheet = workbook.Sheets['DASHBOARD'];
const data = XLSX.utils.sheet_to_json(dashboardSheet, { header: 1, defval: null });

console.log('='.repeat(80));
console.log('DASHBOARD STRUCTURE ANALYSIS');
console.log('='.repeat(80));

// Find all section headers and their content
let currentSection = 'Header';
let sections = {};

for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const firstCell = row[0] ? row[0].toString().trim() : '';
    const secondCell = row[1] ? row[1].toString().trim() : '';
    
    // Detect section breaks
    if (firstCell.length > 0 && row.filter(c => c !== null).length < 5) {
        // Likely a section header
        if (firstCell.includes('Email') || 
            firstCell.includes('Social') || 
            firstCell.includes('Website') ||
            firstCell.includes('Success Factor') ||
            firstCell.includes('Performance')) {
            currentSection = firstCell;
            sections[currentSection] = { startRow: i, rows: [] };
        }
    }
    
    // Add row to current section
    if (sections[currentSection]) {
        sections[currentSection].rows.push({ rowNum: i, data: row });
    }
}

// Print sections
Object.keys(sections).forEach(sectionName => {
    const section = sections[sectionName];
    console.log(`\n${'='.repeat(80)}`);
    console.log(`SECTION: ${sectionName} (starting at row ${section.startRow})`);
    console.log('='.repeat(80));
    
    // Show first 20 rows of each section
    section.rows.slice(0, 20).forEach(row => {
        const displayData = row.data.filter((cell, idx) => {
            return cell !== null && cell !== '' && idx < 15;
        });
        
        if (displayData.length > 0) {
            console.log(`Row ${row.rowNum}:`, displayData);
        }
    });
});

// Now look for KPIs/metrics specifically
console.log('\n\n' + '='.repeat(80));
console.log('LOOKING FOR SPECIFIC KPIs AND METRICS');
console.log('='.repeat(80));

for (let i = 0; i < Math.min(250, data.length); i++) {
    const row = data[i];
    const rowText = row.join('|').toLowerCase();
    
    if (rowText.includes('open rate') ||
        rowText.includes('click rate') ||
        rowText.includes('engagement') ||
        rowText.includes('followers') ||
        rowText.includes('impressions') ||
        rowText.includes('users') ||
        rowText.includes('conversion') ||
        rowText.includes('ytd') ||
        rowText.includes('goal') ||
        rowText.includes('target')) {
        
        const cleanRow = row.filter((cell, idx) => cell !== null && idx < 12);
        if (cleanRow.length > 0) {
            console.log(`Row ${i}:`, cleanRow);
        }
    }
}
