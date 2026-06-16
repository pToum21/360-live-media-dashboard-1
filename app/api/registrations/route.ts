import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const registration = await prisma.eventRegistration.create({
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
      clientId: body.clientId,
      createdById: session.user.id,
    },
  })

  return NextResponse.json(registration)
}
