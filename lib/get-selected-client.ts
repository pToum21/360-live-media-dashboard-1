import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * Get the selected client ID from cookies or default to 360 Live Media
 */
export async function getSelectedClientId(): Promise<string> {
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
