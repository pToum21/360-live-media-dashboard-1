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

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma 5
- **Authentication**: NextAuth.js (email magic links)
- **Charts**: Recharts (planned)
- **Hosting**: Vercel (planned)

## 📁 Project Structure

```
360-marketing-dashboard/
├── app/                     # Next.js app directory (pages & routes)
│   ├── api/                 # API routes (NextAuth)
│   ├── auth/                # Authentication pages
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   └── auth/                # Auth components
├── lib/                     # Utilities and API clients
│   ├── prisma.ts            # Prisma client
│   └── auth.ts              # NextAuth config
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed data
│   └── migrations/          # Database migrations
├── types/                   # TypeScript type definitions
├── docs/                    # Documentation
│   ├── AUTHENTICATION.md    # Auth setup guide
│   ├── DATABASE.md          # Database documentation
│   ├── BRAND.md             # Brand guidelines
│   └── PROJECT_STRUCTURE.md # Architecture overview
├── excel-analysis/          # Original Excel analysis scripts
└── package.json
```

## 📚 Documentation

- **[Authentication Guide](docs/AUTHENTICATION.md)** - NextAuth setup and usage
- **[Database Schema](docs/DATABASE.md)** - Prisma models and usage
- **[Brand Guidelines](docs/BRAND.md)** - 360 Live Media design system
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Architecture and conventions
- **[Auth Setup Status](docs/AUTH_SETUP_COMPLETE.md)** - Current authentication status

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenSSL (for generating auth secrets)
- Email service for authentication (Ethereal/Gmail/SendGrid)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Edit .env with your configuration (see docs/AUTH_SETUP_COMPLETE.md)

# Generate NextAuth secret
openssl rand -base64 32
# Add the output to .env as NEXTAUTH_SECRET

# Run database migrations
npx prisma migrate dev

# Seed initial data (tags and demo user)
npm run db:seed

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the dashboard.

## 📋 Development Status

### ✅ Completed
- [x] Excel workflow analysis
- [x] Next.js project setup
- [x] Shadcn/ui components integration
- [x] 360 Live Media branding applied
- [x] Database schema design (10 models)
- [x] Prisma ORM setup with SQLite
- [x] Database migrations and seeding
- [x] NextAuth.js email authentication
- [x] User roles (ADMIN, MANAGER, MARKETER)
- [x] Auth UI (sign-in, verification, error pages)
- [x] Dashboard layout with sidebar navigation
- [x] Protected routes middleware
- [x] Dashboard home page with stats overview
- [x] All 7 dashboard section pages (placeholders)

### 🚧 In Progress
- [ ] Excel data migration script

### 📅 Upcoming
- [ ] Populate dashboard with real data
- [ ] Website Analytics page (with charts)
- [ ] Email Campaigns page (with charts)
- [ ] Social Media page (with charts)
- [ ] Content Tagging interface (functional)
- [ ] Client Projects tracker (functional)
- [ ] A/B Testing page (functional)
- [ ] API integrations (Google Analytics, MailChimp, LinkedIn, Instagram, SEMrush)
- [ ] Data visualization charts (Recharts)

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
