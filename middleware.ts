import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add pathname header for share context detection
  response.headers.set('x-pathname', request.nextUrl.pathname)

  // Handle share routes - pass share ID through headers
  if (request.nextUrl.pathname.startsWith('/share/')) {
    response.headers.set('x-share-context', 'true')

    // Extract share ID from path and pass it through headers
    const pathParts = request.nextUrl.pathname.split('/')
    const shareId = pathParts[2]

    if (shareId) {
      response.headers.set('x-share-id', shareId)
    }
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/share/:path*"],
}
