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

  const passType = await prisma.passType.create({
    data: {
      passTypeName: body.passTypeName,
      year: body.year,
      registrationCount: body.registrationCount,
      percentOfTotal: body.percentOfTotal,
      revenue: body.revenue,
      clientId: body.clientId,
      createdById: session.user.id,
    },
  })

  return NextResponse.json(passType)
}
