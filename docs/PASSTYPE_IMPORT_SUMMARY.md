# PassType Data Import - Summary

## What Was Done

### 1. Analyzed Excel Data Structure
- Located the "Pass Types" sheet in the ATC Excel file
- Identified pass type breakdown for 2023 and 2024
- Categorized each pass type as "Paid" or "Complimentary"

### 2. Updated Database Schema
Added `isPaid` Boolean field to the `PassType` model in `prisma/schema.prisma`:
```prisma
model PassType {
  // ... other fields
  isPaid                Boolean   @default(true)
  // ... rest of model
}
```

### 3. Imported Real PassType Data
Created and ran `scripts/import-pass-types.ts` to import pass type breakdown:

**2024 Data:**
- Paid: 2,898 (83.0%)
- Comp: 593 (17.0%)
- Total: 3,491

**2023 Data:**
- Paid: 4,796 (91.5%)
- Comp: 444 (8.5%)
- Total: 5,240

**Pass Types Categorized as PAID:**
- Member Doctoral
- Non-Member
- Member Non-MD Doctoral
- Member Non-Doctoral
- Member trainee
- Member Senior Emeritus
- Medical Student

**Pass Types Categorized as COMP:**
- Exhibitor
- Speaker In-Person
- Patient
- Media
- Press
- ATC staff

### 4. Updated Dashboard Data Fetching
Modified `app/dashboard/page.tsx` to:
- Fetch PassType data for all years
- Calculate actual paid/comp percentages per year from the data
- Use 2024 percentages as default for 2026 (83% paid, 17% comp)
- Pass these percentages to the chart component

### 5. Updated Multi-Year Registration Chart
Modified `components/charts/multi-year-registration-chart.tsx` to:
- Accept `passTypePercentages` prop
- Apply year-specific percentages when filtering by "Paid Attendees" or "Complimentary"
- Use real data instead of estimated 60/40 split

## How Filters Now Work

When users click the filter badges on the "2023 - 2026 Registration Progress" chart:

1. **Total**: Shows 100% of registrations (no filter applied)
2. **Paid Attendees**: Applies real percentages per year:
   - 2023: 91.5% of total
   - 2024: 83% of total
   - 2026: 83% of total (using 2024 data)
3. **Complimentary**: Applies real percentages per year:
   - 2023: 8.5% of total
   - 2024: 17% of total
   - 2026: 17% of total (using 2024 data)

## Data Source
- All data imported from: `excel-analysis/360-ATC-MarketingDashboardATC2026.xlsx`
- Sheet: "Pass Types"

## Previous Issue
The filters were using an estimated 60% comp / 40% paid split, which was **incorrect**.
The actual data shows it's mostly paid attendees (83-91.5%), not complimentary.

## Result
✅ Filters now work with **real, accurate data** from the Excel sheet
✅ Each year uses its own specific paid/comp breakdown
✅ No more hardcoded estimates
