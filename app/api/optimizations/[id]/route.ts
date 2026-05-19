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
    
    const optimization = await prisma.optimization.update({
      where: { id },
      data: {
        month: body.month,
        channel: body.channel,
        controlTest: body.controlTest,
        testVariant: body.testVariant,
        results: body.results,
        conclusions: body.conclusions,
      },
    })

    return NextResponse.json(optimization)
  } catch (error) {
    console.error('Error updating optimization:', error)
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 })
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
    await prisma.optimization.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting optimization:', error)
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 })
  }
}
