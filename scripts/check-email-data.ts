import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Checking all email campaigns...\n')

    // Get all campaigns
    const allCampaigns = await prisma.emailCampaign.findMany({
      orderBy: { deploymentDate: 'desc' }
    })

    console.log(`Total campaigns in database: ${allCampaigns.length}\n`)

    if (allCampaigns.length === 0) {
      console.log('❌ No campaigns found in database!')
      return
    }

    // Get clients
    const clients = await prisma.client.findMany()
    const clientMap = new Map(clients.map(c => [c.id, c.name]))

    console.log('📋 All campaigns:\n')
    allCampaigns.forEach(c => {
      const clientName = c.clientId ? clientMap.get(c.clientId) || 'UNKNOWN' : 'NO CLIENT'
      console.log(`ID: ${c.id}`)
      console.log(`  Name: ${c.name}`)
      console.log(`  Type: ${c.campaignType || 'NO TYPE'}`)
      console.log(`  Client: ${clientName} (${c.clientId || 'null'})`)
      console.log(`  Date: ${new Date(c.deploymentDate).toLocaleDateString()}`)
      console.log(`  Open Rate: ${(c.openRate * 100).toFixed(1)}%`)
      console.log('')
    })

    // Check for campaigns without clientId
    const noClient = allCampaigns.filter(c => !c.clientId)
    if (noClient.length > 0) {
      console.log(`⚠️  Warning: ${noClient.length} campaigns without client:`)
      noClient.forEach(c => console.log(`  - ${c.name}`))
      console.log('')
    }

    // Group by client
    const byClient = allCampaigns.reduce((acc, c) => {
      const clientId = c.clientId || 'no-client'
      if (!acc[clientId]) acc[clientId] = []
      acc[clientId].push(c)
      return acc
    }, {} as Record<string, typeof allCampaigns>)

    console.log('📊 Campaigns by client:')
    Object.entries(byClient).forEach(([clientId, campaigns]) => {
      const clientName = clientId === 'no-client' ? 'NO CLIENT' : clientMap.get(clientId) || 'UNKNOWN'
      console.log(`  ${clientName}: ${campaigns.length} campaigns`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
