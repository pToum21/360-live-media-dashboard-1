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

  const registration = await prisma.eventRegistration.update({
    where: { id },
    data: {
      date: new Date(body.date),
      totalRegistrations: body.totalRegistrations,
      compRegistrations: body.compRegistrations,
      paidRegistrations: body.paidRegistrations,
      revenue: body.revenue,
      memberCount: body.memberCount,
      nonMemberCount: body.nonMemberCount,
      studentCount: body.studentCount,
      sponsorCount: body.sponsorCount,
      registrationGoal: body.registrationGoal,
      percentOfGoal: body.percentOfGoal,
    },
  })

  return NextResponse.json(registration)
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

  await prisma.eventRegistration.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
