import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const projection = await prisma.revenueProjection.update({
    where: { id },
    data: {
      date: new Date(body.date),
      category: body.category,
      projectedRevenue: body.projectedRevenue,
      actualRevenue: body.actualRevenue,
      projectedRegistrations: body.projectedRegistrations,
      actualRegistrations: body.actualRegistrations,
    },
  })

  return NextResponse.json(projection)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  await prisma.revenueProjection.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
