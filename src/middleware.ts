import { type NextRequest, NextResponse } from 'next/server'

const GATE_COOKIE = 'mirai_gate'
const VALID_TOKEN_RE = /^[a-f0-9]{64}$/

// Paths that bypass the gate entirely
const GATE_SKIP_PREFIXES = ['/gate', '/admin', '/_next', '/api/gate']
const GATE_SKIP_EXACT = ['/favicon.ico', '/favicon.svg', '/mirai.png']

function isGateEnabled(): boolean {
  return Boolean(process.env['GATE_EMAIL'] && process.env['GATE_PASSWORD'])
}

function hasValidGateCookie(request: NextRequest): boolean {
  const token = request.cookies.get(GATE_COOKIE)?.value ?? ''
  return VALID_TOKEN_RE.test(token)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Gate check ---
  if (isGateEnabled()) {
    const skip =
      GATE_SKIP_EXACT.includes(pathname) ||
      GATE_SKIP_PREFIXES.some((p) => pathname.startsWith(p))

    if (!skip && !hasValidGateCookie(request)) {
      const url = request.nextUrl.clone()
      url.pathname = '/gate'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // --- Security headers ---
  const response = NextResponse.next()

  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')

  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
