# Project Structure (To Be Built)

This document outlines the folder structure for the Next.js dashboard application.

## Current State
```
360-marketing-dashboard/
├── excel-analysis/          # ✅ Analysis scripts (discovery phase)
├── node_modules/            # ✅ Dependencies
├── .env.example             # ✅ Environment variables template
├── .gitignore               # ✅ Git ignore rules
├── package.json             # ✅ Package configuration
└── README.md                # ✅ Project documentation
```

## Next.js App Structure (To Build)

```
360-marketing-dashboard/
├── excel-analysis/          # Analysis scripts (for reference)
├── node_modules/
├── public/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema definition
│   ├── migrations/         # Database migrations
│   └── seed.ts             # Seed data
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/        # Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/   # Protected dashboard routes
│   │   │   ├── page.tsx           # Main dashboard
│   │   │   ├── website/           # Website analytics
│   │   │   ├── email/             # Email campaigns
│   │   │   ├── social/            # Social media
│   │   │   ├── content-tags/      # Content tagging
│   │   │   ├── clients/           # Client tracker
│   │   │   └── tests/             # A/B tests
│   │   ├── api/           # API routes
│   │   │   ├── auth/
│   │   │   ├── analytics/
│   │   │   ├── social/
│   │   │   └── sync/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn/ui components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── charts/        # Chart components
│   │   ├── forms/         # Form components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities
│   │   ├── db.ts          # Database client
│   │   ├── auth.ts        # Auth configuration
│   │   ├── api/           # API clients
│   │   │   ├── google-analytics.ts
│   │   │   ├── mailchimp.ts
│   │   │   ├── linkedin.ts
│   │   │   ├── instagram.ts
│   │   │   └── semrush.ts
│   │   └── utils.ts       # Helper functions
│   ├── types/             # TypeScript types
│   │   ├── database.ts
│   │   ├── api.ts
│   │   └── index.ts
│   └── hooks/             # Custom React hooks
│       ├── useAnalytics.ts
│       ├── useSocial.ts
│       └── useAuth.ts
├── .env.example
├── .env.local             # Local environment variables (gitignored)
├── .gitignore
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── package.json
└── README.md
```

## Component Architecture

### Dashboard Layout
```
DashboardLayout
├── Sidebar (navigation)
├── Header (user menu, notifications)
└── Main Content Area
    ├── KPI Cards
    ├── Charts
    └── Data Tables
```

### Key Components to Build

#### UI Components (using Shadcn/ui)
- `Button`
- `Card`
- `Input`
- `Select`
- `Dialog`
- `Table`
- `Tabs`
- `DatePicker`

#### Custom Components
- `KPICard` - Display key metrics with trend indicators
- `TrendChart` - Line charts for time-series data
- `BarChart` - Bar charts for comparisons
- `DataTable` - Sortable, filterable tables
- `MetricInput` - Form for manual data entry
- `TagSelector` - Multi-select for content tags
- `ClientCard` - Client project status card
- `ExportButton` - Export data to PDF/Excel

## Database Schema (Prisma)

### Core Models
- `User` - Team members with roles
- `WebsiteMetric` - Weekly website analytics
- `EmailCampaign` - Email newsletter performance
- `SocialMetric` - Weekly social media stats
- `SocialPost` - Individual posts with tags
- `Tag` - Content categorization taxonomy
- `Campaign` - Marketing campaigns
- `Client` - Client project tracking
- `Optimization` - A/B test documentation

### Relationships
- User → many WebsiteMetrics
- User → many EmailCampaigns
- User → many SocialPosts
- SocialPost → many Tags (many-to-many)
- Client → many Campaigns

## API Integration Flow

### Data Sync Process
1. **Scheduled Jobs** (cron)
   - Daily: Google Analytics sync
   - Daily: SEMrush health check
   - Weekly: Social media metrics
   - After email send: MailChimp data

2. **Manual Triggers**
   - "Sync Now" button for each data source
   - Force refresh for specific date ranges

3. **Error Handling**
   - Retry logic for failed API calls
   - Email alerts for sync failures
   - Fallback to manual entry

## Authentication Flow

1. User visits dashboard
2. Redirect to login if not authenticated
3. NextAuth.js handles session
4. Role-based access control:
   - **Marketer**: Can enter data, view reports
   - **Manager**: Can view all data, export reports
   - **Admin**: Full access + user management

## Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Initialize Next.js with TypeScript
- [ ] Set up Tailwind + Shadcn/ui
- [ ] Create database schema (Prisma)
- [ ] Implement authentication
- [ ] Build basic layout and navigation

### Phase 2: Core Features (Week 2)
- [ ] Dashboard homepage
- [ ] Website analytics page (manual entry)
- [ ] Email campaigns page
- [ ] Social media page
- [ ] Basic charts and visualizations

### Phase 3: API Integration (Weeks 3-4)
- [ ] Google Analytics API
- [ ] MailChimp API
- [ ] LinkedIn API
- [ ] Instagram API
- [ ] SEMrush API
- [ ] Automated sync jobs

### Phase 4: Advanced Features (Week 5)
- [ ] Content tagging system
- [ ] Client project tracker
- [ ] Export functionality
- [ ] Alert system
- [ ] Performance optimization

## Next Steps

1. **Create Git repository**
2. **Initialize Next.js project**: `npx create-next-app@latest`
3. **Install core dependencies**: Shadcn/ui, Prisma, NextAuth
4. **Set up database**: Create Prisma schema
5. **Start building**: Authentication → Layout → Dashboard

Ready to start building! 🚀
