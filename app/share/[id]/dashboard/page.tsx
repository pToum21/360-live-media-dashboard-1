import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface ShareDashboardPageProps {
  params: Promise<{ id: string }>;
}

async function getShareData(shareLinkId: string) {
  const shareLink = await prisma.shareLink.findUnique({
    where: { id: shareLinkId },
    include: {
      client: true,
    },
  });

  if (!shareLink) {
    return null;
  }

  return { shareLink };
}

export default async function ShareDashboardPage({ params }: ShareDashboardPageProps) {
  const { id } = await params;
  const data = await getShareData(id);

  if (!data) {
    notFound();
  }

  const { shareLink } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {shareLink.client.name} Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          View-only access to marketing performance data
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Campaigns</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Avg Open Rate</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Impressions</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Engagement Rate</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Your Shared Dashboard</h2>
        <p className="text-muted-foreground">
          This is a read-only view of the {shareLink.client.name} marketing dashboard. 
          You can explore all the data and charts, but you cannot make any changes.
        </p>
        <p className="text-muted-foreground mt-4">
          <strong>Note:</strong> The full dashboard implementation with all charts and data 
          will be accessible once you navigate through the available sections.
        </p>
      </div>
    </div>
  );
}
