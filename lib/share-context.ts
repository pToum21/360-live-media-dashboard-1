import { headers } from 'next/headers'

export async function isShareContext() {
  try {
    const headersList = await headers()
    return headersList.get('x-share-context') === 'true'
  } catch {
    return false
  }
}

export async function getShareIdFromContext() {
  try {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    
    if (pathname.startsWith('/share/')) {
      const parts = pathname.split('/')
      return parts[2] // The share ID is the second segment
    }
  } catch {
    return null
  }
  
  return null
}
