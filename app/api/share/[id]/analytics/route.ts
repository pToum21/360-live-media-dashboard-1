import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get analytics for a share link (requires authentication)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const shareLink = await prisma.shareLink.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        views: {
          orderBy: {
            viewedAt: 'desc',
          },
        },
      },
    });

    if (!shareLink) {
      return NextResponse.json({ error: 'Share link not found' }, { status: 404 });
    }

    // Calculate analytics
    const totalViews = shareLink.viewCount;
    const uniqueIPs = new Set(shareLink.views.map(v => v.ipAddress).filter(Boolean)).size;
    const avgDuration = shareLink.views.length > 0
      ? shareLink.views
          .filter(v => v.durationSeconds)
          .reduce((sum, v) => sum + (v.durationSeconds || 0), 0) / 
        (shareLink.views.filter(v => v.durationSeconds).length || 1)
      : 0;

    // Get page view breakdown
    const pageViews: Record<string, number> = {};
    shareLink.views.forEach(view => {
      view.pagesViewed.forEach(page => {
        pageViews[page] = (pageViews[page] || 0) + 1;
      });
    });

    const analytics = {
      totalViews,
      uniqueVisitors: uniqueIPs,
      avgDurationSeconds: Math.round(avgDuration),
      lastViewedAt: shareLink.lastViewedAt,
      pageViews,
      recentViews: shareLink.views.slice(0, 20), // Last 20 views
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
