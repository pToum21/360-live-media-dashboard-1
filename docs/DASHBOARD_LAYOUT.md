# Dashboard Layout Documentation

## Overview

The dashboard provides a comprehensive interface for managing marketing analytics across multiple channels. It features a sidebar navigation, header with user profile, and modular page structure.

## Structure

```
/dashboard
├── layout.tsx              # Main dashboard layout with auth check
├── page.tsx                # Dashboard home/overview
├── website/page.tsx        # Website Analytics
├── email/page.tsx          # Email Campaigns
├── social/page.tsx         # Social Media
├── tagging/page.tsx        # Content Tagging
├── clients/page.tsx        # Client Projects
└── testing/page.tsx        # A/B Testing
```

## Components

### DashboardNav (`components/dashboard/nav.tsx`)
Sidebar navigation with:
- 360 Live Media logo
- Navigation links to all dashboard sections
- Active state highlighting
- Footer with copyright

**Navigation Items:**
- 📊 Dashboard (Overview)
- 📈 Website Analytics
- 📧 Email Campaigns
- 👥 Social Media
- 🏷️ Content Tagging
- 🏢 Client Projects
- 🧪 A/B Testing

### DashboardHeader (`components/dashboard/header.tsx`)
Top header displaying:
- Current page title and description
- Notification bell icon (with indicator dot)
- User profile dropdown (UserNav)

### Dashboard Layout (`app/dashboard/layout.tsx`)
- Server-side authentication check
- Redirects unauthenticated users to sign-in
- Two-column layout: sidebar + main content
- Provides layout for all `/dashboard/*` routes

## Authentication Protection

### Middleware (`middleware.ts`)
- Protects all `/dashboard/*` routes
- Uses NextAuth middleware
- Redirects to `/auth/signin` if not authenticated

### Homepage Redirect (`app/page.tsx`)
- Checks for active session
- Redirects authenticated users to `/dashboard`
- Shows landing page for unauthenticated users

## Dashboard Home Page

The main dashboard page (`/dashboard`) shows:

### Welcome Section
- Personalized greeting with user's name
- Weekly status message

### Stats Cards (3 columns)
1. **Website Visitors**
   - Weekly total
   - Percentage change
   
2. **Email Open Rate**
   - Last campaign performance
   - Percentage change
   
3. **Social Engagement**
   - Average engagement rate
   - Percentage change

### Activity Section
- **Recent Activity**: Latest updates across all channels
- **Quick Actions**: Common tasks and shortcuts
  - Add Social Post
  - View Reports
  - Import Data

## Feature Pages (Placeholders)

All feature pages follow a consistent structure:
- Header with icon and title
- Description of page purpose
- Empty state with icon
- "Coming soon" message for data import

## Styling

### Color Scheme
- Primary: `#2E8741` (360 Green)
- Accent: `#84BE41` (Spring Leaf)
- Background: `#F9FAFB` (Gray 50)
- Text: `#0C1C14` (Rich Green Black)

### Design Patterns
- Card-based layout
- Rounded corners (0.75rem)
- Hover states on interactive elements
- Active state highlighting in navigation
- Consistent spacing (gap-6)

## Responsive Design

- **Desktop**: Full sidebar + main content
- **Mobile**: (To be implemented)
  - Collapsible sidebar
  - Hamburger menu
  - Stack stats cards vertically

## Next Steps

1. **Data Import**: Load historical Excel data into database
2. **Real Data Display**: Replace placeholder stats with actual metrics
3. **Charts & Visualizations**: Add Recharts for data visualization
4. **Filters & Date Ranges**: Add date pickers and filtering options
5. **Export Features**: PDF/Excel export functionality
6. **Mobile Optimization**: Responsive sidebar and layout adjustments

## Usage

### Accessing the Dashboard

1. Sign in at `/auth/signin`
2. Automatically redirected to `/dashboard`
3. Navigate using sidebar menu
4. Profile dropdown in top-right for account settings/sign out

### Adding New Sections

To add a new dashboard section:

1. Create page: `app/dashboard/new-section/page.tsx`
2. Add nav item to `components/dashboard/nav.tsx`:
   ```tsx
   {
     title: "New Section",
     href: "/dashboard/new-section",
     icon: IconComponent,
   }
   ```
3. Add page info to `components/dashboard/header.tsx`:
   ```tsx
   "/dashboard/new-section": {
     title: "New Section",
     description: "Section description",
   }
   ```

## File Count

- **7** dashboard pages (including home)
- **2** shared components (nav, header)
- **1** layout file
- **1** middleware file
- Total: **11** files created for dashboard structure
