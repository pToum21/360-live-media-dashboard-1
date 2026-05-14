import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const metrics = await prisma.websiteMetric.findMany({
    orderBy: { weekStarting: 'desc' },
  })

  return NextResponse.json(metrics)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const metric = await prisma.websiteMetric.create({
      data: {
        weekStarting: new Date(body.weekStarting),
        totalUsers: body.totalUsers || 0,
        newUsers: body.newUsers || 0,
        avgEngagementTimeSec: body.avgEngagementTimeSec || null,
        healthScore: body.healthScore || null,
        referral: body.referral || null,
        organicSearch: body.organicSearch || null,
        direct: body.direct || null,
        organicSocial: body.organicSocial || null,
        email: body.email || null,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(metric)
  } catch (error) {
    console.error('Error creating website metric:', error)
    return NextResponse.json({ error: 'Failed to create metric' }, { status: 500 })
  }
}
