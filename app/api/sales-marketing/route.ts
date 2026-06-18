import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// GET - Fetch all sales marketing campaigns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current client from cookies
    const cookieStore = await cookies()
    const currentClientCookie = cookieStore.get('currentClient')
    const currentClient = currentClientCookie ? JSON.parse(currentClientCookie.value) : null

    if (!currentClient) {
      return NextResponse.json({ error: 'No client selected' }, { status: 400 })
    }

    const campaigns = await prisma.salesMarketing.findMany({
      where: {
        clientId: currentClient.id
      },
      orderBy: {
        weekOf: 'desc'
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Error fetching sales marketing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales marketing campaigns' },
      { status: 500 }
    )
  }
}

// POST - Create new sales marketing campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get current client from cookies
    const cookieStore = await cookies()
    const currentClientCookie = cookieStore.get('currentClient')
    const currentClient = currentClientCookie ? JSON.parse(currentClientCookie.value) : null

    if (!currentClient) {
      return NextResponse.json({ error: 'No client selected' }, { status: 400 })
    }

    const body = await request.json()
    
    const campaign = await prisma.salesMarketing.create({
      data: {
        weekOf: new Date(body.weekOf),
        targetSendDate: body.targetSendDate ? new Date(body.targetSendDate) : null,
        audience: body.audience || null,
        subjectMessage: body.subjectMessage || null,
        opportunities: body.opportunities || null,
        notes: body.notes || null,
        status: body.status || null,
        finalLink: body.finalLink || null,
        sent: body.sent || null,
        reportSent: body.reportSent || null,
        micrositeVisits: body.micrositeVisits ? parseInt(body.micrositeVisits) : null,
        openRate: body.openRate ? parseFloat(body.openRate) : null,
        clickRate: body.clickRate ? parseFloat(body.clickRate) : null,
        bounces: body.bounces ? parseInt(body.bounces) : null,
        unsubs: body.unsubs ? parseInt(body.unsubs) : null,
        clientId: currentClient.id,
        createdById: user.id
      }
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Error creating sales marketing campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create sales marketing campaign' },
      { status: 500 }
    )
  }
}
