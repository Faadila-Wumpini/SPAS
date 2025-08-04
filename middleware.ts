import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define routes that require authentication
const protectedRoutes = ['/settings', '/dashboard']
// Define routes that should redirect to home if user is logged in
const authRoutes = ['/auth/login', '/auth/signup']

// Simple JWT decode function for Edge Runtime (without verification)
function getTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get('auth-token')?.value || null
}

// Basic JWT payload extraction (for Edge Runtime)
function parseJwtPayload(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookie
  const token = getTokenFromCookie(request)
  let isLoggedIn = false
  
  if (token) {
    const payload = parseJwtPayload(token)
    // Check if token is not expired (basic check)
    if (payload && payload.exp && payload.exp > Date.now() / 1000) {
      isLoggedIn = true
    }
  }

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to home if accessing auth routes while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}