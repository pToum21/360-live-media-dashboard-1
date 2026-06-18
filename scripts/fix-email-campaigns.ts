import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Checking email campaigns...')

    // Get ATC client
    const atcClient = await prisma.client.findFirst({
      where: { 
        OR: [
          { name: { contains: 'ATC', mode: 'insensitive' } },
          { slug: 'atc' }
        ]
      }
    })

    if (!atcClient) {
      console.error('❌ ATC client not found!')
      return
    }

    console.log(`✅ Found ATC client: ${atcClient.name} (${atcClient.id})`)

    // Get all email campaigns without a clientId
    const orphanedCampaigns = await prisma.emailCampaign.findMany({
      where: {
        OR: [
          { clientId: null },
          { clientId: undefined }
        ]
      }
    })

    console.log(`\n📊 Found ${orphanedCampaigns.length} orphaned campaigns`)

    if (orphanedCampaigns.length > 0) {
      console.log('\n🔧 Fixing orphaned campaigns...')
      
      for (const campaign of orphanedCampaigns) {
        await prisma.emailCampaign.update({
          where: { id: campaign.id },
          data: { clientId: atcClient.id }
        })
        console.log(`  ✓ Fixed: ${campaign.name}`)
      }
    }

    // Get all ATC campaigns
    const atcCampaigns = await prisma.emailCampaign.findMany({
      where: { clientId: atcClient.id },
      orderBy: { deploymentDate: 'desc' }
    })

    console.log(`\n✅ Total ATC campaigns: ${atcCampaigns.length}`)
    
    if (atcCampaigns.length > 0) {
      console.log('\n📋 Current ATC campaigns:')
      atcCampaigns.forEach(c => {
        console.log(`  - ${c.name} (${c.campaignType || 'No Type'}) - ${new Date(c.deploymentDate).toLocaleDateString()}`)
      })
    }

    // Check for campaigns with old campaign types
    const campaignsWithOldTypes = atcCampaigns.filter(c => 
      c.campaignType && !['Registration Email', 'Nurture Email', 'Call for Content Email', 'Awareness Email'].includes(c.campaignType)
    )

    if (campaignsWithOldTypes.length > 0) {
      console.log(`\n⚠️  Warning: ${campaignsWithOldTypes.length} campaigns have old campaign types:`)
      campaignsWithOldTypes.forEach(c => {
        console.log(`  - ${c.name}: "${c.campaignType}"`)
      })
      console.log('\n💡 These need to be updated to one of:')
      console.log('   • Registration Email')
      console.log('   • Nurture Email')
      console.log('   • Call for Content Email')
      console.log('   • Awareness Email')
    }

    console.log('\n✅ Done!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
