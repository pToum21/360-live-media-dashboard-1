import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Audience Tags (from Excel Tag Glossary)
  const audienceTags = [
    {
      name: 'Audience_AssociationLeaders',
      category: 'AUDIENCE',
      description: 'Content aimed at C-suite or senior leaders within associations.',
    },
    {
      name: 'Audience_Marketers',
      category: 'AUDIENCE',
      description: 'Targeting marketing professionals, especially in associations and nonprofits.',
    },
    {
      name: 'Audience_EventPlanners',
      category: 'AUDIENCE',
      description: 'Focused on event strategists, producers, and planners.',
    },
    {
      name: 'Audience_Members',
      category: 'AUDIENCE',
      description: 'Targeting current or prospective association members.',
    },
    {
      name: 'Audience_Clients',
      category: 'AUDIENCE',
      description: 'Posts intended for or about current/potential clients of 360 Live Media.',
    },
  ]

  for (const tag of audienceTags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    })
  }

  console.log('✅ Created audience tags')

  // Create Content Tags (from Excel Tag Glossary)
  const contentTags = [
    {
      name: 'Content_BlogPost',
      category: 'CONTENT',
      description: 'Features a 360 Live Media blog post or article.',
    },
    {
      name: 'Content_TeamHighlight',
      category: 'CONTENT',
      description: 'Showcases the 360LM team, culture, or behind-the-scenes moments.',
    },
    {
      name: 'Content_Poll',
      category: 'CONTENT',
      description: 'Posts using or engaging with polls.',
    },
    {
      name: 'Content_ThoughtLeadership',
      category: 'CONTENT',
      description: 'Features original ideas, POVs, or insights from 360LM experts.',
    },
    {
      name: 'Content_EventMarketing',
      category: 'CONTENT',
      description: 'Tips or strategies related to event marketing and design.',
    },
    {
      name: 'Content_CaseStudy',
      category: 'CONTENT',
      description: 'Posts that highlight successful client outcomes or project results.',
    },
    {
      name: 'Content_ClientWork',
      category: 'CONTENT',
      description: 'Showcases collaborations, campaigns, or results from client projects.',
    },
    {
      name: 'Content_Testimonial',
      category: 'CONTENT',
      description: 'Client or partner testimonials shared via social media.',
    },
    {
      name: 'Content_TipsAndInsights',
      category: 'CONTENT',
      description: 'Tips or strategies related to event marketing and design.',
    },
  ]

  for (const tag of contentTags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    })
  }

  console.log('✅ Created content tags')

  // Create a demo user
  await prisma.user.upsert({
    where: { email: 'demo@360livemedia.com' },
    update: {},
    create: {
      email: 'demo@360livemedia.com',
      name: 'Demo User',
      role: 'MARKETER',
    },
  })

  console.log('✅ Created demo user')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
