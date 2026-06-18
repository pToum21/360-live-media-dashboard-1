import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    
    console.log('📝 UPDATE REQUEST - Campaign ID:', id)
    console.log('📝 Request Body:', JSON.stringify(body, null, 2))
    
    // Get the existing campaign first to preserve clientId
    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id }
    })
    
    if (!existingCampaign) {
      console.error('❌ Campaign not found:', id)
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
    
    console.log('✅ Found existing campaign:', existingCampaign.name, 'ClientId:', existingCampaign.clientId)
    
    // Calculate deployment date and related fields
    const deploymentDate = body.deploymentDate ? new Date(body.deploymentDate) : existingCampaign.deploymentDate
    const dayOfWeek = deploymentDate.toLocaleDateString('en-US', { weekday: 'long' })
    const hour = deploymentDate.getHours()
    let timeOfDay = 'Morning'
    if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon'
    else if (hour >= 17) timeOfDay = 'Evening'
    
    // Build update data object, including ALL fields that should be updated
    const updateData: any = {
      name: body.name,
      deploymentDate: deploymentDate,
      audience: body.audience !== undefined && body.audience !== null ? body.audience : existingCampaign.audience,
      campaignType: body.campaignType !== undefined && body.campaignType !== null ? body.campaignType : existingCampaign.campaignType,
      openRate: body.openRate,
      clickRate: body.clickRate,
      deliveryRate: body.deliveryRate,
      unsubscribeRate: body.unsubscribeRate,
      // Calculate day/time fields
      deploymentDayOfWeek: dayOfWeek,
      deploymentTimeOfDay: timeOfDay,
      deploymentHour: hour,
      // Always preserve the clientId from existing campaign
      clientId: existingCampaign.clientId,
    }
    
    console.log('💾 Update Data:', JSON.stringify(updateData, null, 2))
    
    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: updateData,
    })

    console.log('✅ Campaign updated successfully:', campaign.id, campaign.name, 'ClientId:', campaign.clientId)
    
    // Revalidate the email pages to ensure fresh data
    revalidatePath('/dashboard/email')
    revalidatePath('/dashboard/email-analytics')
    
    return NextResponse.json(campaign)
  } catch (error) {
    console.error('❌ Error updating email campaign:', error)
    return NextResponse.json({ error: 'Failed to update campaign', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.emailCampaign.delete({
      where: { id },
    })

    console.log('✅ Campaign deleted successfully:', id)
    
    // Revalidate the email pages to ensure fresh data
    revalidatePath('/dashboard/email')
    revalidatePath('/dashboard/email-analytics')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting email campaign:', error)
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
  }
}
