import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    
    const campaign = await prisma.emailCampaign.create({
      data: {
        deploymentDate: new Date(body.deploymentDate),
        name: body.name,
        openRate: body.openRate || 0,
        clickRate: body.clickRate || 0,
        deliveryRate: body.deliveryRate || 0,
        unsubscribeRate: body.unsubscribeRate || 0,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error creating email campaign:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
