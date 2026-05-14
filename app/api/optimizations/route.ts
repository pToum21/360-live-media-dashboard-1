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
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const optimization = await prisma.optimization.create({
      data: {
        month: new Date(body.month),
        channel: body.channel || null,
        testDescription: body.testDescription || null,
        results: body.results || null,
      },
    })

    return NextResponse.json(optimization)
  } catch (error) {
    console.error('Error creating optimization:', error)
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 })
  }
}
