import { cookies, headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * Get the selected client ID from cookies or share context, or default to 360 Live Media
 */
export async function getSelectedClientId(): Promise<string> {
  // Check if we're in a share context first
  const headersList = await headers()
  const shareId = headersList.get('x-share-id')
  
  if (shareId) {
    // In share context - get client from share link
    const shareLink = await prisma.shareLink.findUnique({
      where: { id: shareId },
      select: {
        client: {
          select: { id: true }
        }
      }
    })
    
    if (shareLink) {
      return shareLink.client.id
    }
  }

  // Not in share context - check cookies
  const cookieStore = await cookies()
  const selectedClientId = cookieStore.get('selectedClientId')?.value

  if (selectedClientId) {
    // Verify the client exists
    const client = await prisma.client.findUnique({
      where: { id: selectedClientId },
      select: { id: true },
    })
    if (client) {
      return client.id
    }
  }

  // Fall back to 360 Live Media as default
  const defaultClient = await prisma.client.findFirst({
    where: { slug: '360-live-media' },
    select: { id: true },
  })

  return defaultClient?.id || ''
}
