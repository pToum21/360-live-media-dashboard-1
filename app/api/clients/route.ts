import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(clients)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const client = await prisma.client.create({
      data: {
        name: body.name,
        eventName: body.eventName || null,
        year: body.year || new Date().getFullYear(),
        campaignStatus: body.campaignStatus || 'Active',
        dashboardStatus: body.dashboardStatus || 'Active',
        utmTracking: body.utmTracking || false,
        conversionTracking: body.conversionTracking || 'No',
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
