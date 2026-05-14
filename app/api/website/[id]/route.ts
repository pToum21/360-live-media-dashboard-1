import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const metric = await prisma.websiteMetric.update({
      where: { id: params.id },
      data: {
        weekStarting: body.weekStarting ? new Date(body.weekStarting) : undefined,
        totalUsers: body.totalUsers,
        newUsers: body.newUsers,
        avgEngagementTimeSec: body.avgEngagementTimeSec,
        healthScore: body.healthScore,
        referral: body.referral,
        organicSearch: body.organicSearch,
        direct: body.direct,
        organicSocial: body.organicSocial,
        email: body.email,
      },
    })

    return NextResponse.json(metric)
  } catch (error) {
    console.error('Error updating website metric:', error)
    return NextResponse.json({ error: 'Failed to update metric' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.websiteMetric.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting website metric:', error)
    return NextResponse.json({ error: 'Failed to delete metric' }, { status: 500 })
  }
}
