import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get share link details (public - for validation)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const shareLink = await prisma.shareLink.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });

    if (!shareLink) {
      return NextResponse.json({ error: 'Share link not found' }, { status: 404 });
    }

    // Check if link is active
    if (!shareLink.isActive) {
      return NextResponse.json({ error: 'This link has been revoked' }, { status: 403 });
    }

    // Check if link has expired
    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 403 });
    }

    return NextResponse.json(shareLink);
  } catch (error) {
    console.error('Error fetching share link:', error);
    return NextResponse.json({ error: 'Failed to fetch share link' }, { status: 500 });
  }
}

// DELETE - Revoke share link (requires authentication)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Instead of deleting, mark as inactive
    const shareLink = await prisma.shareLink.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Share link revoked successfully', shareLink });
  } catch (error) {
    console.error('Error revoking share link:', error);
    return NextResponse.json({ error: 'Failed to revoke share link' }, { status: 500 });
  }
}
