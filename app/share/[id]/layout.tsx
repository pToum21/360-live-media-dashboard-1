import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ShareViewTracker } from '@/components/share/share-view-tracker';

interface ShareLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

async function getShareLink(id: string) {
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
    return null;
  }

  // Check if link is active
  if (!shareLink.isActive) {
    return null;
  }

  // Check if link has expired
  if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
    return null;
  }

  return shareLink;
}

export default async function ShareLayout({ children, params }: ShareLayoutProps) {
  const { id } = await params;
  const shareLink = await getShareLink(id);

  if (!shareLink) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Share Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            {shareLink.client.logo && (
              <img
                src={shareLink.client.logo}
                alt={shareLink.client.name}
                className="h-8 w-auto"
              />
            )}
            <div>
              <h1 className="text-sm font-semibold">{shareLink.client.name} Dashboard</h1>
              <p className="text-xs text-muted-foreground">Shared by 360 Live Media</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Read-only view
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>

      {/* View Tracker */}
      <ShareViewTracker shareLinkId={id} />

      {/* Footer Notice */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        <p>
          This is a shared view of the {shareLink.client.name} dashboard. 
          Your viewing activity is tracked for analytics purposes.
        </p>
      </footer>
    </div>
  );
}
