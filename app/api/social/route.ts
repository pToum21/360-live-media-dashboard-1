import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const metrics = await prisma.socialMetric.findMany({
    orderBy: { weekStarting: 'desc' },
  })

  return NextResponse.json(metrics)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const metric = await prisma.socialMetric.create({
      data: {
        weekStarting: new Date(body.weekStarting),
        liFollowers: body.liFollowers || 0,
        liImpressions: body.liImpressions || 0,
        liEngagementRate: body.liEngagementRate || null,
        igFollowers: body.igFollowers || 0,
        igImpressions: body.igImpressions || 0,
        igEngagementRate: body.igEngagementRate || null,
      },
    })

    return NextResponse.json(metric)
  } catch (error) {
    console.error('Error creating social metric:', error)
    return NextResponse.json({ error: 'Failed to create metric' }, { status: 500 })
  }
}
