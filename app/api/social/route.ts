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
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Get clientId from cookies (same as other routes)
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const selectedClientSlug = cookieStore.get('selectedClient')?.value || '360-live-media'
    const client = await prisma.client.findUnique({
      where: { slug: selectedClientSlug }
    })
    
    const clientId = client?.id || null
    
    const metric = await prisma.socialMetric.create({
      data: {
        weekStarting: new Date(body.weekStarting),
        liFollowers: body.liFollowers || 0,
        liImpressions: body.liImpressions || 0,
        liEngagementRate: body.liEngagementRate || null,
        liPostsPerWeek: body.liPostsPerWeek || 0,
        igFollowers: body.igFollowers || 0,
        igImpressions: body.igImpressions || 0,
        igEngagementRate: body.igEngagementRate || null,
        igPostsPerWeek: body.igPostsPerWeek || 0,
        fbFollowers: body.fbFollowers || 0,
        fbImpressions: body.fbImpressions || 0,
        fbEngagements: body.fbEngagements || 0,
        fbPostsPerWeek: body.fbPostsPerWeek || 0,
        xFollowers: body.xFollowers || 0,
        xImpressions: body.xImpressions || 0,
        xEngagements: body.xEngagements || 0,
        xPostsPerWeek: body.xPostsPerWeek || 0,
        clientId: clientId,
        createdById: user.id,
      },
    })

    return NextResponse.json(metric)
  } catch (error) {
    console.error('Error creating social metric:', error)
    return NextResponse.json({ error: 'Failed to create metric' }, { status: 500 })
  }
}
