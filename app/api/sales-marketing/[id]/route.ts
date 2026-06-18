import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update sales marketing campaign
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    
    const updateData: any = {}
    
    if (body.weekOf) updateData.weekOf = new Date(body.weekOf)
    if (body.targetSendDate !== undefined) {
      updateData.targetSendDate = body.targetSendDate ? new Date(body.targetSendDate) : null
    }
    if (body.audience !== undefined) updateData.audience = body.audience || null
    if (body.subjectMessage !== undefined) updateData.subjectMessage = body.subjectMessage || null
    if (body.opportunities !== undefined) updateData.opportunities = body.opportunities || null
    if (body.notes !== undefined) updateData.notes = body.notes || null
    if (body.status !== undefined) updateData.status = body.status || null
    if (body.finalLink !== undefined) updateData.finalLink = body.finalLink || null
    if (body.sent !== undefined) updateData.sent = body.sent || null
    if (body.reportSent !== undefined) updateData.reportSent = body.reportSent || null
    if (body.micrositeVisits !== undefined) {
      updateData.micrositeVisits = body.micrositeVisits ? parseInt(body.micrositeVisits) : null
    }
    if (body.openRate !== undefined) {
      updateData.openRate = body.openRate ? parseFloat(body.openRate) : null
    }
    if (body.clickRate !== undefined) {
      updateData.clickRate = body.clickRate ? parseFloat(body.clickRate) : null
    }
    if (body.bounces !== undefined) {
      updateData.bounces = body.bounces ? parseInt(body.bounces) : null
    }
    if (body.unsubs !== undefined) {
      updateData.unsubs = body.unsubs ? parseInt(body.unsubs) : null
    }

    const campaign = await prisma.salesMarketing.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error updating sales marketing campaign:', error)
    return NextResponse.json(
      { error: 'Failed to update sales marketing campaign' },
      { status: 500 }
    )
  }
}

// DELETE - Delete sales marketing campaign
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    
    await prisma.salesMarketing.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Error deleting sales marketing campaign:', error)
    return NextResponse.json(
      { error: 'Failed to delete sales marketing campaign' },
      { status: 500 }
    )
  }
}
