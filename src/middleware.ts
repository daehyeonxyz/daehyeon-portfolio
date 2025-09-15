import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Admin pages require authentication
    // Since only admin can login (checked in auth.ts), 
    // any authenticated user is admin
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Must be logged in to access admin pages
        return !!token
      }
    },
  }
)

// Protected routes - only admin routes
export const config = {
  matcher: ["/admin/:path*"]
}