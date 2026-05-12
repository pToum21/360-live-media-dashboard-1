const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('c:\\Users\\ptouma\\Downloads\\2026-360LM-MarketingDashboard.xlsx');

let analysis = {};

// Analyze each sheet in detail
workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    
    analysis[sheetName] = {
        name: sheetName,
        totalRows: data.length,
        sampleData: data.slice(0, 30)
    };
});

// Save to JSON for detailed inspection
fs.writeFileSync('detailed-analysis.json', JSON.stringify(analysis, null, 2));

console.log('Analysis saved to detailed-analysis.json');

// Now let's understand the DASHBOARD sheet specifically
console.log('\n' + '='.repeat(80));
console.log('DEEP DIVE: DASHBOARD SHEET');
console.log('='.repeat(80));

const dashboardSheet = workbook.Sheets['DASHBOARD'];
const dashboardData = XLSX.utils.sheet_to_json(dashboardSheet, { header: 1, defval: null });

// Look for section headers (likely in bold or specific formatting)
console.log('\nScanning for key sections and metrics...\n');

for (let i = 0; i < Math.min(200, dashboardData.length); i++) {
    const row = dashboardData[i];
    const rowText = row.join('|');
    
    // Look for headers/sections (rows with text but not all data)
    if (rowText.includes('Website') || 
        rowText.includes('Email') || 
        rowText.includes('Social') ||
        rowText.includes('Mission Brief') ||
        rowText.includes('KPI') ||
        rowText.includes('Performance') ||
        rowText.includes('Goal') ||
        rowText.includes('Target') ||
        rowText.toLowerCase().includes('ytd') ||
        rowText.toLowerCase().includes('quarter') ||
        rowText.toLowerCase().includes('month')) {
        
        console.log(`Row ${i}:`, row.filter(cell => cell !== null && cell !== '').slice(0, 10));
    }
}

console.log('\n' + '='.repeat(80));
console.log('UNDERSTANDING WEBSITE DATA SHEET');
console.log('='.repeat(80));

const websiteSheet = workbook.Sheets['Website Data'];
const websiteData = XLSX.utils.sheet_to_json(websiteSheet, { header: 1, defval: null });

console.log('\nHeaders:');
console.log(websiteData[3]); // Row 3 appears to be headers

console.log('\nSample data rows (showing actual metrics):');
for (let i = 4; i < Math.min(20, websiteData.length); i++) {
    const row = websiteData[i];
    if (row.some(cell => cell !== null && cell !== '')) {
        console.log(`Week ${i-3}:`, row.filter((cell, idx) => idx < 15));
    }
}

console.log('\n' + '='.repeat(80));
console.log('UNDERSTANDING MISSION BRIEF (EMAIL) SHEET');
console.log('='.repeat(80));

const missionBriefSheet = workbook.Sheets['Mission Brief'];
const missionBriefData = XLSX.utils.sheet_to_json(missionBriefSheet, { header: 1, defval: null });

console.log('\nHeaders:');
console.log(missionBriefData[1]);

console.log('\nEmail campaigns tracked:');
for (let i = 2; i < missionBriefData.length; i++) {
    const row = missionBriefData[i];
    if (row[0] && row[0].toString().includes('2026')) {
        console.log(`  ${row[0]} - Deployed: ${row[1]}, Open: ${row[2]}, Click: ${row[3]}`);
    }
}

console.log('\n' + '='.repeat(80));
console.log('UNDERSTANDING SOCIAL MEDIA TRACKING');
console.log('='.repeat(80));

const socialSheet = workbook.Sheets['Organic Social Media'];
const socialData = XLSX.utils.sheet_to_json(socialSheet, { header: 1, defval: null });

console.log('\nHeaders:');
console.log(socialData[3]);

console.log('\nSample weeks with data:');
for (let i = 4; i < Math.min(20, socialData.length); i++) {
    const row = socialData[i];
    if (row.some(cell => cell !== null && cell !== '')) {
        console.log(`Week starting ${row[0]}:`, {
            LI_Growth: row[1],
            LI_Impressions: row[2],
            LI_Engagement: row[3],
            LI_Posts: row[4],
            IG_Impressions: row[5],
            IG_Engagement: row[6],
            IG_Posts: row[7]
        });
    }
}

console.log('\n' + '='.repeat(80));
console.log('UNDERSTANDING TAG TRACKING (Most manual work)');
console.log('='.repeat(80));

const tagTrackingSheet = workbook.Sheets['Tag Tracking'];
const tagTrackingData = XLSX.utils.sheet_to_json(tagTrackingSheet, { header: 1, defval: null });

console.log('\nThis appears to track EACH SOCIAL POST with:');
console.log(tagTrackingData[1]); // Headers

console.log('\nSample weekly data:');
for (let i = 2; i < Math.min(15, tagTrackingData.length); i++) {
    const row = tagTrackingData[i];
    if (row[0] && row[1]) { // Has date and posts
        console.log(`\nWeek ${row[0]}: ${row[1]} posts`);
        console.log(`  Total Impressions: ${row[2]}, Engagements: ${row[3]}, Rate: ${row[4]}`);
        console.log(`  Top Audience Tag: ${row[6]} (${row[7]} impressions)`);
        console.log(`  Top Content Tag: ${row[10]} (${row[11]} impressions)`);
    }
}

console.log('\n' + '='.repeat(80));
console.log('UNDERSTANDING CAMPAIGN TRACKING');
console.log('='.repeat(80));

const campaignSheet = workbook.Sheets['Website Campaign Data'];
const campaignData = XLSX.utils.sheet_to_json(campaignSheet, { header: 1, defval: null });

console.log('\nCampaign page view tracking by source:');
console.log('Headers:', campaignData[0]);
console.log('\nMonthly breakdown:');
for (let i = 1; i < campaignData.length; i++) {
    const row = campaignData[i];
    if (row[0]) {
        console.log(`${row[0]}: Mission Brief=${row[1]}, Organic Search=${row[5]}, Social=${row[6]}, Direct=${row[7]}`);
    }
}
