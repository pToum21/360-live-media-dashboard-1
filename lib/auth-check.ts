import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isShareContext } from "@/lib/share-context"

export async function requireAuth() {
  // Skip authentication check for share context
  const isShare = await isShareContext()
  
  if (isShare) {
    return null // No session in share context
  }
  
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }
  return session
}
