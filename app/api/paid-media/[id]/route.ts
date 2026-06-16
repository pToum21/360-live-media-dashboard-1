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

  const paidMedia = await prisma.paidMedia.update({
    where: { id },
    data: {
      weekStarting: new Date(body.weekStarting),
      liImpressions: body.liImpressions,
      liClicks: body.liClicks,
      liSpend: body.liSpend,
      liCPC: body.liCPC,
      liCTR: body.liCTR,
      liConversions: body.liConversions,
      liCVR: body.liCVR,
      liCPA: body.liCPA,
      metaImpressions: body.metaImpressions,
      metaClicks: body.metaClicks,
      metaSpend: body.metaSpend,
      metaCPC: body.metaCPC,
      metaCTR: body.metaCTR,
      metaConversions: body.metaConversions,
      metaCVR: body.metaCVR,
      metaCPA: body.metaCPA,
      googleSearchImpressions: body.googleSearchImpressions,
      googleSearchClicks: body.googleSearchClicks,
      googleSearchSpend: body.googleSearchSpend,
      googleSearchCPC: body.googleSearchCPC,
      googleSearchCTR: body.googleSearchCTR,
      googleSearchConversions: body.googleSearchConversions,
      googleSearchCVR: body.googleSearchCVR,
      googleSearchCPA: body.googleSearchCPA,
      googleDisplayImpressions: body.googleDisplayImpressions,
      googleDisplayClicks: body.googleDisplayClicks,
      googleDisplaySpend: body.googleDisplaySpend,
      googleDisplayCPC: body.googleDisplayCPC,
      googleDisplayCTR: body.googleDisplayCTR,
      googleDisplayConversions: body.googleDisplayConversions,
      googleDisplayCVR: body.googleDisplayCVR,
      googleDisplayCPA: body.googleDisplayCPA,
    },
  })

  return NextResponse.json(paidMedia)
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

  await prisma.paidMedia.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
