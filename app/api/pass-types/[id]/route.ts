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

  const passType = await prisma.passType.update({
    where: { id },
    data: {
      passTypeName: body.passTypeName,
      year: body.year,
      registrationCount: body.registrationCount,
      percentOfTotal: body.percentOfTotal,
      revenue: body.revenue,
    },
  })

  return NextResponse.json(passType)
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

  await prisma.passType.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
