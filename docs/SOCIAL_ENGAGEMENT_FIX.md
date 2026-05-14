# Social Engagement Data Fix

## Issue
The dashboard was showing 0% for social engagement rates, both on the main dashboard and throughout the social media page.

## Root Cause
**Two problems were identified:**

### 1. Excel Column Names Had Extra Spaces
The import script was looking for columns like `'LI Engagement Rate'`, but the actual Excel column names had spaces around them: `' LI Engagement Rate '` (with leading and trailing spaces).

This caused the import script to read `null` for all engagement rate columns, even though the data existed in Excel.

### 2. Recent Weeks Had No Data
The Excel file only has engagement rate data for January and February 2026 (17 rows with LinkedIn data, 15 with Instagram). March, April, and May 2026 weeks have impression data but no engagement rates filled in yet.

The dashboard was querying for the "latest" social metric record (May 2026), which had 0% engagement, instead of the latest record WITH engagement data.

## Solution

### 1. Fixed Import Script Column Names
Updated `scripts/import-excel-complete.ts` to use the correct column names with spaces:

```typescript
// Before:
liEngagementRate: parseFloat(row['LI Engagement Rate']) || null,
igEngagementRate: parseFloat(row['IG Engagement Rate']) || null,

// After:
liEngagementRate: parseFloat(row[' LI Engagement Rate ']) || null,
igEngagementRate: parseFloat(row[' IG Engagement Rate ']) || null,
```

Also updated all other social columns that had spaces:
- `' LI Impressions '`
- `' LI Posts Per Week '`
- `' IG Impressions '`
- `' IG Posts Per Week '`
- `' Instagram Followers '`

### 2. Updated Dashboard Query
Changed the main dashboard to query for the latest record WITH engagement rate data:

```typescript
// Before:
prisma.socialMetric.findFirst({
  where: {
    OR: [
      { liImpressions: { not: null } },
      { igImpressions: { not: null } }
    ]
  },
  orderBy: { weekStarting: 'desc' }
})

// After:
prisma.socialMetric.findFirst({
  where: {
    OR: [
      { liEngagementRate: { not: null } },
      { igEngagementRate: { not: null } }
    ]
  },
  orderBy: { weekStarting: 'desc' }
})
```

### 3. Fixed Percentage Display
Updated `app/dashboard/social/page.tsx` to properly convert decimal engagement rates to percentages:

```typescript
// Before:
{latestWeek?.liEngagementRate?.toFixed(1) || 0}%  // Would show 0.1% instead of 13.4%

// After:
{latestWeek?.liEngagementRate ? (latestWeek.liEngagementRate * 100).toFixed(1) : 0}%  // Shows 13.4%
```

Applied this fix to:
- LinkedIn engagement rate card
- Instagram engagement rate card
- Weekly performance table (both LinkedIn and Instagram columns)

## Data Verification

After the fix, verified engagement rates are now correctly imported:

**Sample Data:**
- Week of Jan 5, 2026:
  - LinkedIn: 13.4% engagement, 1,002 impressions
  - Instagram: 1.8% engagement, 218 impressions

- Week of Jan 12, 2026:
  - LinkedIn: 18.6% engagement, 714 impressions
  - Instagram: 6.2% engagement, 225 impressions

**Total Records with Engagement Data:**
- 8 weeks have both LinkedIn and Instagram engagement rates
- All data matches the Excel source exactly

## Result
- Main dashboard now shows actual social engagement rates (e.g., 6.1% avg)
- Social Media page displays correct engagement rates for LinkedIn and Instagram
- Weekly performance table shows accurate percentages
- All data matches the Excel source file exactly
