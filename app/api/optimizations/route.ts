import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const optimizations = await prisma.optimization.findMany({
    orderBy: { month: 'desc' },
  })

  return NextResponse.json(optimizations)
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
    
    const optimization = await prisma.optimization.create({
      data: {
        month: body.month,
        channel: body.channel || null,
        controlTest: body.controlTest || null,
        testVariant: body.testVariant || null,
        results: body.results || null,
        conclusions: body.conclusions || null,
        createdById: user.id,
      },
    })

    return NextResponse.json(optimization)
  } catch (error) {
    console.error('Error creating optimization:', error)
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 })
  }
}
