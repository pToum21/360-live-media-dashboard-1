import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Let NextAuth handle the session check via the dashboard layout
  // Middleware just ensures the route exists
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
