import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Track a view (public - no auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { durationSeconds, pagesViewed } = body;

    // Get IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create view record
    const view = await prisma.shareLinkView.create({
      data: {
        shareLinkId: id,
        ipAddress,
        userAgent,
        durationSeconds,
        pagesViewed: pagesViewed || [],
      },
    });

    // Update share link summary
    await prisma.shareLink.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
        lastViewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, viewId: view.id });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
