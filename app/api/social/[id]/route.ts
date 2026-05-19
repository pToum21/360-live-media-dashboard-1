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
    
    const metric = await prisma.socialMetric.update({
      where: { id },
      data: {
        weekStarting: body.weekStarting ? new Date(body.weekStarting) : undefined,
        liFollowers: body.liFollowers,
        liImpressions: body.liImpressions,
        liEngagementRate: body.liEngagementRate,
        igFollowers: body.igFollowers,
        igImpressions: body.igImpressions,
        igEngagementRate: body.igEngagementRate,
      },
    })

    return NextResponse.json(metric)
  } catch (error) {
    console.error('Error updating social metric:', error)
    return NextResponse.json({ error: 'Failed to update metric' }, { status: 500 })
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
    await prisma.socialMetric.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting social metric:', error)
    return NextResponse.json({ error: 'Failed to delete metric' }, { status: 500 })
  }
}
