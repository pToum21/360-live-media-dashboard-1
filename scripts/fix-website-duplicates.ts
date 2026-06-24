import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixDuplicates() {
  console.log('🔧 Fixing duplicate website metric entries...\n')

  const metrics = await prisma.websiteMetric.findMany({
    where: { 
      client: {
        slug: 'atc-2026'
      }
    },
    orderBy: { weekStarting: 'asc' }
  })

  console.log(`📊 Found ${metrics.length} total entries\n`)

  // Group by date
  const dateMap = new Map<string, typeof metrics>()
  
  for (const metric of metrics) {
    const dateKey = metric.weekStarting.toISOString()
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, [])
    }
    dateMap.get(dateKey)!.push(metric)
  }

  console.log(`📅 Found ${dateMap.size} unique dates\n`)

  // Find and remove duplicates
  let deletedCount = 0
  
  for (const [date, duplicates] of dateMap.entries()) {
    if (duplicates.length > 1) {
      console.log(`🔍 Found ${duplicates.length} entries for ${new Date(date).toLocaleDateString('en-US')}`)
      
      // Keep the first one, delete the rest
      for (let i = 1; i < duplicates.length; i++) {
        console.log(`   ❌ Deleting duplicate ID: ${duplicates[i].id}`)
        await prisma.websiteMetric.delete({
          where: { id: duplicates[i].id }
        })
        deletedCount++
      }
    }
  }

  console.log(`\n✅ Deleted ${deletedCount} duplicate entries`)
  console.log(`✅ Remaining entries: ${metrics.length - deletedCount}`)

  await prisma.$disconnect()
}

fixDuplicates()
  .then(() => {
    console.log('\n🎉 Duplicates removed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
