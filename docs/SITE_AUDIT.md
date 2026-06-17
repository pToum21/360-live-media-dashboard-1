# 360 Marketing Dashboard - Comprehensive Site Audit

## Audit Date: June 17, 2026

This document audits every chart, graph, and data display across the entire dashboard to verify:
1. Data is displaying correctly
2. Each has a corresponding CRUD interface for data entry

---

## 1. MAIN DASHBOARD (`/dashboard`)

### Charts & Data Displays:

#### A. Six Rs Framework
- **Component**: `SixRsFramework`
- **Data Sources**:
  - Relevance: `WebsiteMetric.totalUsers`
  - Retention: Comp registrations from `PassType`
  - Revenue: `RevenueProjection.actualRevenue`
  - Reach: `EventRegistration.totalRegistrations`
  - Reputation: N/A (not tracked yet)
  - ROI: N/A (not tracked yet)
- **Status**: ⏳ AUDITING

#### B. Multi-Year Registration Chart
- **Component**: `MultiYearRegistrationChart`
- **Data Source**: `EventRegistration` (2023, 2024, 2026)
- **Features**: Filterable by Total/Paid/Comp
- **CRUD Page**: ❓ CHECKING

#### C. Registration Actuals vs Goal Chart
- **Component**: `RegistrationActualsVsGoalChart`
- **Data Source**: `PassType` aggregated data
- **CRUD Page**: ❓ CHECKING

#### D. Revenue Gauge Chart
- **Component**: `RevenueGaugeChart`
- **Data Source**: `RevenueProjection`
- **CRUD Page**: ❓ CHECKING

#### E. Goal Tracking Widget
- **Component**: `GoalTracking`
- **Data Sources**:
  - Website Visitors: `WebsiteMetric`
  - New Leads: `EmailMetric`
  - Event Registrations: `EventRegistration`
  - Revenue: `RevenueProjection`
- **CRUD Pages**: ❓ CHECKING

#### F. Performance Insights Widget
- **Component**: `PerformanceInsights`
- **Data Sources**: Multiple (email, social, website)
- **CRUD Pages**: ❓ CHECKING

#### G. Top Performers Widget
- **Component**: `TopPerformers`
- **Data Sources**: Email metrics
- **CRUD Page**: ❓ CHECKING

#### H. Growth Trends Widget
- **Component**: `GrowthTrends`
- **Data Sources**: Website, email, social metrics
- **CRUD Pages**: ❓ CHECKING

#### I. Filterable Website Chart
- **Component**: `FilterableWebsiteChart`
- **Data Source**: `WebsiteMetric`
- **CRUD Page**: ❓ CHECKING

#### J. Filterable Email Chart
- **Component**: `FilterableEmailChart`
- **Data Source**: `EmailMetric`
- **CRUD Page**: ❓ CHECKING

#### K. Filterable Social Chart
- **Component**: `FilterableSocialChart`
- **Data Source**: `SocialMetric`
- **CRUD Page**: ❓ CHECKING

#### L. Quick Stats Cards
- Total Registrations, Revenue, Website Traffic, Social Engagement
- **Data Sources**: Various tables
- **Status**: ⏳ AUDITING

---

## 2. EMAIL ANALYTICS PAGE (`/dashboard/email-analytics`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 3. EMAIL PAGE (`/dashboard/email`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 4. SOCIAL MEDIA PAGE (`/dashboard/social`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 5. WEBSITE PAGE (`/dashboard/website`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 6. REGISTRATIONS PAGE (`/dashboard/registrations`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 7. GA4 REGISTRATIONS PAGE (`/dashboard/ga4-registrations`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 8. PASS TYPES PAGE (`/dashboard/pass-types`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 9. REVENUE PAGE (`/dashboard/revenue`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 10. ABSTRACTS PAGE (`/dashboard/abstracts`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 11. PAID MEDIA PAGE (`/dashboard/paid-media`)

### Charts & Data Displays:

❓ TO AUDIT

---

## 12. TESTING PAGE (`/dashboard/testing`)

### Charts & Data Displays:

❓ TO AUDIT

---

## CRUD PAGES INVENTORY

### Existing Management Pages:
- `/dashboard/email` - Email data entry
- `/dashboard/social` - Social media data entry
- `/dashboard/website` - Website data entry
- `/dashboard/registrations` - Event registrations data entry
- `/dashboard/revenue` - Revenue projections data entry
- `/dashboard/abstracts` - Abstract submissions data entry
- `/dashboard/pass-types` - Pass type data entry
- `/dashboard/paid-media` - Paid media campaigns data entry
- `/dashboard/testing` - A/B testing data entry
- `/dashboard/ga4-registrations` - GA4 registration data entry

---

## AUDIT STATUS LEGEND
- ✅ Verified - Data correct, CRUD exists
- ⚠️ Warning - Data correct, but CRUD missing or incomplete
- ❌ Error - Data incorrect or missing
- ⏳ In Progress - Currently auditing
- ❓ Not Yet Checked

---

## NEXT STEPS
1. Complete audit of all pages
2. Verify data queries and calculations
3. Test CRUD operations for each data type
4. Document any missing CRUD interfaces
5. Fix any data display issues found
