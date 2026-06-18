import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSelectedClientId } from '@/lib/get-selected-client'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaigns = await prisma.emailCampaign.findMany({
    orderBy: { deploymentDate: 'desc' },
  })

  return NextResponse.json(campaigns)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Get the currently selected client ID
    const clientId = await getSelectedClientId()
    
    console.log('📝 CREATE REQUEST - New campaign:', body.name)
    console.log('👤 Selected Client ID:', clientId)
    console.log('📝 Campaign Type:', body.campaignType)
    
    // Calculate day of week and time of day from deployment date
    const deploymentDate = new Date(body.deploymentDate)
    const dayOfWeek = deploymentDate.toLocaleDateString('en-US', { weekday: 'long' })
    const hour = deploymentDate.getHours()
    let timeOfDay = 'Morning'
    if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon'
    else if (hour >= 17) timeOfDay = 'Evening'
    
    const campaign = await prisma.emailCampaign.create({
      data: {
        deploymentDate: deploymentDate,
        name: body.name,
        subjectLine: body.subjectLine || null,
        audience: body.audience || null,
        campaignType: body.campaignType,
        openRate: body.openRate || 0,
        clickRate: body.clickRate || 0,
        deliveryRate: body.deliveryRate || 0,
        unsubscribeRate: body.unsubscribeRate || 0,
        deploymentDayOfWeek: dayOfWeek,
        deploymentTimeOfDay: timeOfDay,
        deploymentHour: hour,
        clientId: clientId, // Set the client ID!
        createdById: session.user.id,
      },
    })

    console.log('✅ Campaign created successfully:', campaign.id, campaign.name, 'ClientId:', campaign.clientId)

    // Revalidate the email pages to ensure fresh data
    revalidatePath('/dashboard/email')
    revalidatePath('/dashboard/email-analytics')

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('❌ Error creating email campaign:', error)
    return NextResponse.json({ error: 'Failed to create campaign', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
