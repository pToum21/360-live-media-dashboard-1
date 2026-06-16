import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    
    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: {
        deploymentDate: body.deploymentDate ? new Date(body.deploymentDate) : undefined,
        name: body.name,
        audience: body.audience !== undefined ? body.audience : undefined,
        campaignType: body.campaignType !== undefined ? body.campaignType : undefined,
        openRate: body.openRate,
        clickRate: body.clickRate,
        deliveryRate: body.deliveryRate,
        unsubscribeRate: body.unsubscribeRate,
      },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error updating email campaign:', error)
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting email campaign:', error)
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
  }
}
