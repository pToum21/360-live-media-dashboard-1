import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId')

  if (!clientId) {
    return NextResponse.json({ error: 'Client ID required' }, { status: 400 })
  }

  try {
    const registrations = await prisma.gA4Registration.findMany({
      where: { clientId },
      orderBy: { weekStarting: 'asc' },
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Error fetching GA4 registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GA4 registrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      clientId,
      weekStarting,
      totalRegistrations,
      organicSearch,
      email,
      direct,
      paidSocial,
      referral,
    } = body

    if (!clientId || !weekStarting || totalRegistrations === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, weekStarting, totalRegistrations' },
        { status: 400 }
      )
    }

    const registration = await prisma.gA4Registration.create({
      data: {
        clientId,
        weekStarting: new Date(weekStarting),
        totalRegistrations,
        organicSearch: organicSearch || null,
        email: email || null,
        direct: direct || null,
        paidSocial: paidSocial || null,
        referral: referral || null,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error('Error creating GA4 registration:', error)
    return NextResponse.json(
      { error: 'Failed to create GA4 registration' },
      { status: 500 }
    )
  }
}
