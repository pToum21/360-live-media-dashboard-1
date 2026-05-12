# 360 Live Media - Marketing Dashboard

A modern, automated marketing analytics dashboard built to replace manual Excel-based reporting workflows. This dashboard automatically syncs data from multiple marketing platforms and provides real-time insights for the 360 Live Media marketing team.

## 🎯 Problem Statement

Currently, the marketing team spends **2-3 hours every week** manually copying data from multiple platforms into a complex Excel spreadsheet with 12 tabs. This dashboard automates 70-80% of that work while providing better visualizations and real-time data.

## 📊 What This Dashboard Tracks

### Automated Data Collection
- **Website Analytics** - Traffic, users, engagement (Google Analytics 4)
- **SEO Health** - Site health scores (SEMrush)
- **Email Campaigns** - Open rates, click rates, deliverability (MailChimp)
- **Social Media** - LinkedIn & Instagram performance metrics
- **Campaign Attribution** - UTM-based traffic source tracking

### Manual Entry (Simplified Forms)
- **Content Tagging** - Categorize social posts by audience and content type
- **Client Projects** - Track analytics implementation status
- **A/B Testing** - Document experiments and results

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL (Supabase or Vercel Postgres)
- **ORM**: Prisma
- **Authentication**: NextAuth.js / Clerk
- **Charts**: Recharts
- **Hosting**: Vercel

## 📁 Project Structure

```
360-marketing-dashboard/
├── excel-analysis/          # Scripts used to analyze the original Excel file
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API clients
│   └── db/                  # Database schema and queries
├── prisma/                  # Prisma schema and migrations
├── public/                  # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- API keys for:
  - Google Analytics 4
  - SEMrush
  - MailChimp
  - LinkedIn
  - Instagram (via Facebook Graph API)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📋 Development Roadmap

### Phase 1: MVP (Weeks 1-2) ✅
- [x] Analyze existing Excel workflow
- [ ] Set up Next.js project structure
- [ ] Design database schema
- [ ] Build authentication system
- [ ] Create main dashboard layout
- [ ] Manual data entry forms

### Phase 2: API Integration (Weeks 3-4)
- [ ] Google Analytics 4 API
- [ ] MailChimp API
- [ ] LinkedIn API
- [ ] Instagram Graph API
- [ ] SEMrush API
- [ ] Automated data sync (cron jobs)

### Phase 3: Advanced Features (Week 5)
- [ ] Content tagging system
- [ ] Client project tracker
- [ ] Export to PDF/Excel
- [ ] Email/Slack alerts
- [ ] Historical data visualization
- [ ] Goal tracking

## 🔌 API Setup Guides

### Google Analytics 4
1. Create project in Google Cloud Console
2. Enable Google Analytics Data API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI
5. Save credentials to `.env.local`

### MailChimp
1. Log into MailChimp account
2. Navigate to Account → Extras → API keys
3. Generate new API key
4. Save to `.env.local`

### LinkedIn
1. Create LinkedIn Developer App
2. Request Marketing Developer Platform access
3. Generate OAuth 2.0 credentials
4. Save to `.env.local`

### Instagram
1. Create Facebook Developer App
2. Add Instagram Basic Display product
3. Connect Instagram Business account
4. Generate access token
5. Save to `.env.local`

### SEMrush
1. Log into SEMrush account
2. Navigate to API section (requires paid plan)
3. Generate API key
4. Save to `.env.local`

## 📊 Data Migration

Import existing Excel data using the migration script:

```bash
npm run migrate:excel
```

This will import historical data from the existing Excel workbook into the database.

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
vercel --prod
```

## 📈 Business Impact

### Time Savings
- **Before**: 2-3 hours/week manual data entry
- **After**: 15-30 minutes/week (only tagging content)
- **Annual Savings**: ~120 hours per marketer

### Additional Benefits
- Real-time data instead of week-old snapshots
- Automated trend calculations and comparisons
- Better visualizations for stakeholder reports
- Reduced human errors in data entry
- Historical data preservation
- Faster decision-making with current metrics

## 🤝 Contributing

This is an internal project for 360 Live Media. For questions or feature requests, contact the development team.

## 📝 License

Internal use only - 360 Live Media / Smithbucklin

## 📞 Support

For technical support, contact: [Your contact info]

---

**Built with ❤️ by the 360 Live Media team**
