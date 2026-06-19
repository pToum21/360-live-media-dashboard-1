'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ShareViewTrackerProps {
  shareLinkId: string;
}

export function ShareViewTracker({ shareLinkId }: ShareViewTrackerProps) {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const pagesViewedRef = useRef<Set<string>>(new Set());
  const hasTrackedInitialView = useRef(false);

  useEffect(() => {
    // Track page view
    const pageName = pathname.split('/').pop() || 'dashboard';
    pagesViewedRef.current.add(pageName);

    // Track initial view (only once)
    if (!hasTrackedInitialView.current) {
      hasTrackedInitialView.current = true;
      trackView();
    }

    // Set up periodic tracking (every 30 seconds)
    const interval = setInterval(() => {
      trackView();
    }, 30000);

    // Track on page unload
    const handleBeforeUnload = () => {
      trackView(true);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, shareLinkId]);

  const trackView = async (isFinal: boolean = false) => {
    const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const pagesViewed = Array.from(pagesViewedRef.current);

    try {
      // Use sendBeacon for final tracking (more reliable on page unload)
      if (isFinal && navigator.sendBeacon) {
        const blob = new Blob(
          [JSON.stringify({ durationSeconds, pagesViewed })],
          { type: 'application/json' }
        );
        navigator.sendBeacon(`/api/share/${shareLinkId}/track-view`, blob);
      } else {
        // Regular fetch for periodic updates
        await fetch(`/api/share/${shareLinkId}/track-view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ durationSeconds, pagesViewed }),
        });
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  return null; // This component doesn't render anything
}
