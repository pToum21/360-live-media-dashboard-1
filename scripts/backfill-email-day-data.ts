import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔄 Backfilling day of week data for email campaigns...\n')

    // Get all campaigns
    const campaigns = await prisma.emailCampaign.findMany({
      where: {
        OR: [
          { deploymentDayOfWeek: null },
          { deploymentTimeOfDay: null },
          { deploymentHour: null }
        ]
      }
    })

    console.log(`📊 Found ${campaigns.length} campaigns missing day/time data\n`)

    let updated = 0
    for (const campaign of campaigns) {
      const deploymentDate = new Date(campaign.deploymentDate)
      const dayOfWeek = deploymentDate.toLocaleDateString('en-US', { weekday: 'long' })
      const hour = deploymentDate.getHours()
      let timeOfDay = 'Morning'
      if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon'
      else if (hour >= 17) timeOfDay = 'Evening'

      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: {
          deploymentDayOfWeek: dayOfWeek,
          deploymentTimeOfDay: timeOfDay,
          deploymentHour: hour
        }
      })

      updated++
      if (updated % 50 === 0) {
        console.log(`  ✓ Updated ${updated} campaigns...`)
      }
    }

    console.log(`\n✅ Successfully updated ${updated} campaigns!`)
    
    // Show summary
    const summary = await prisma.emailCampaign.groupBy({
      by: ['deploymentDayOfWeek'],
      _count: true,
      where: {
        deploymentDayOfWeek: { not: null }
      }
    })

    console.log('\n📊 Campaigns by day of week:')
    summary
      .sort((a, b) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return days.indexOf(a.deploymentDayOfWeek!) - days.indexOf(b.deploymentDayOfWeek!)
      })
      .forEach(s => {
        console.log(`  ${s.deploymentDayOfWeek}: ${s._count} campaigns`)
      })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
