import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, verifyCustomerToken } from '@/lib/auth'
import { JWT_COOKIE_NAME, ADMIN_JWT_COOKIE_NAME } from '@/lib/constants'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ─── Protect /api/admin/* ─────────────────────────────────────────────────
  if (pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth/')) {
    const token = req.cookies.get(ADMIN_JWT_COOKIE_NAME)?.value
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // ─── Protect /admin/* pages (redirect to login) ───────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get(ADMIN_JWT_COOKIE_NAME)?.value
    if (!token || !verifyAdminToken(token)) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ─── Protect customer API routes that need auth ───────────────────────────
  if (pathname === '/api/orders' || pathname.startsWith('/api/orders/') ||
      pathname === '/api/reservations') {
    const token = req.cookies.get(JWT_COOKIE_NAME)?.value
    if (!token || !verifyCustomerToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/orders/:path*',
    '/api/orders',
    '/api/reservations',
  ],
}
