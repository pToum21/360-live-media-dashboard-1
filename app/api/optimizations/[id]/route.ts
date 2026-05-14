import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const optimization = await prisma.optimization.update({
      where: { id: params.id },
      data: {
        month: body.month ? new Date(body.month) : undefined,
        channel: body.channel,
        testDescription: body.testDescription,
        results: body.results,
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
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.optimization.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting optimization:', error)
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 })
  }
}
