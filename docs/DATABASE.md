# Database Schema Documentation

## Overview

The marketing dashboard uses **SQLite** for development with **Prisma ORM** for type-safe database access.

## 📊 Database Models

### **User** - Team Members
- Authentication and user management
- Roles: ADMIN, MANAGER, MARKETER
- Tracks who created each metric

### **WebsiteMetric** - Weekly Website Analytics
- Google Analytics data (users, traffic sources, engagement)
- SEMrush health scores
- Week-over-week percentage changes
- Traffic source breakdown (referral, organic, direct, social, email)

### **EmailCampaign** - Newsletter Performance
- Mission Brief monthly campaigns
- Open rates, click rates, delivery rates
- Unsubscribe tracking

### **SocialMetric** - Weekly Social Media Stats
- LinkedIn metrics (followers, impressions, engagement, posts)
- Instagram metrics (followers, impressions, engagement, posts)
- Weekly aggregated data

### **SocialPost** - Individual Social Posts
- Individual post tracking
- Platform (LinkedIn or Instagram)
- Impressions, engagements, engagement rate
- Link clicks
- Tagged with content categories

### **Tag** - Content Categorization
- **Audience Tags**: AssociationLeaders, Marketers, EventPlanners, Members, Clients
- **Content Tags**: BlogPost, ThoughtLeadership, CaseStudy, ClientWork, Testimonial, etc.
- Based on the Excel Tag Glossary

### **PostTag** - Post-Tag Relationship
- Many-to-many relationship between posts and tags
- Allows multiple tags per post

### **Campaign** - Campaign Page Views
- Monthly tracking by campaign source
- Page views by source (Mission Brief, Organic Search, Social, etc.)

### **Client** - Client Project Tracking
- Client/event information
- UTM and conversion tracking status
- Issues and next steps

### **Optimization** - A/B Testing
- Monthly test documentation
- Control vs Test variants
- Results and conclusions

---

## 🛠️ Useful Commands

### Prisma Commands
```bash
# View database in browser
npm run db:studio

# Reset and reseed database
npx prisma migrate reset

# Create new migration after schema changes
npx prisma migrate dev --name migration_name

# Regenerate Prisma Client
npx prisma generate

# Seed database with initial tags
npm run db:seed
```

### Database Location
- Development: `prisma/dev.db` (SQLite file)
- Gitignored automatically

---

## 🌱 Seed Data

The database is pre-seeded with:

### **Audience Tags** (5)
- Audience_AssociationLeaders
- Audience_Marketers
- Audience_EventPlanners
- Audience_Members
- Audience_Clients

### **Content Tags** (9)
- Content_BlogPost
- Content_TeamHighlight
- Content_Poll
- Content_ThoughtLeadership
- Content_EventMarketing
- Content_CaseStudy
- Content_ClientWork
- Content_Testimonial
- Content_TipsAndInsights

### **Demo User**
- Email: `demo@360livemedia.com`
- Role: MARKETER

---

## 📝 Usage in Code

```typescript
import { prisma } from '@/lib/prisma'

// Get all tags
const tags = await prisma.tag.findMany()

// Create a website metric
const metric = await prisma.websiteMetric.create({
  data: {
    weekStarting: new Date(),
    totalUsers: 1234,
    healthScore: 0.92,
    createdById: userId
  }
})

// Get social posts with tags
const posts = await prisma.socialPost.findMany({
  include: {
    tags: {
      include: {
        tag: true
      }
    }
  }
})
```

---

## 🔄 Next Steps

1. ✅ Schema designed
2. ✅ Database created
3. ✅ Initial seed data loaded
4. **⏳ Next**: Build authentication system
5. **⏳ Next**: Create API routes for CRUD operations
6. **⏳ Next**: Build dashboard pages

---

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Studio](https://www.prisma.io/studio)
- Schema file: `prisma/schema.prisma`
- Seed file: `prisma/seed.ts`
