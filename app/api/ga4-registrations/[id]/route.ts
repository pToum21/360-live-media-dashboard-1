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
    const {
      weekStarting,
      totalRegistrations,
      organicSearch,
      email,
      direct,
      paidSocial,
      referral,
    } = body

    const registration = await prisma.gA4Registration.update({
      where: { id },
      data: {
        weekStarting: weekStarting ? new Date(weekStarting) : undefined,
        totalRegistrations,
        organicSearch: organicSearch || null,
        email: email || null,
        direct: direct || null,
        paidSocial: paidSocial || null,
        referral: referral || null,
      },
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error('Error updating GA4 registration:', error)
    return NextResponse.json(
      { error: 'Failed to update GA4 registration' },
      { status: 500 }
    )
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
    await prisma.gA4Registration.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting GA4 registration:', error)
    return NextResponse.json(
      { error: 'Failed to delete GA4 registration' },
      { status: 500 }
    )
  }
}
