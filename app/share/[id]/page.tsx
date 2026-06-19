import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface SharePageProps {
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

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const shareLink = await getShareLink(id);

  if (!shareLink) {
    notFound();
  }

  // Redirect to the main share dashboard view
  redirect(`/share/${id}/dashboard`);
}
