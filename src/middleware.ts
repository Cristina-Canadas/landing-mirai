import { type NextRequest, NextResponse } from 'next/server'

/**
 * Security Headers Middleware
 * Aplicadas a todas las respuestas HTTP para proteger la aplicación
 * contra ataques comunes (XSS, Clickjacking, MIME sniffing, etc.)
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // 1. Strict-Transport-Security (HSTS)
  // Obliga al navegador a usar HTTPS en las próximas 1 año
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  // 2. X-Content-Type-Options
  // Previene MIME sniffing (navegador no intenta detectar tipo de contenido)
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // 3. X-Frame-Options
  // Previene clickjacking (impide que la página se cargue en un iframe)
  response.headers.set('X-Frame-Options', 'DENY')

  // 4. X-XSS-Protection
  // Habilita protección XSS en navegadores antiguos
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // 5. Referrer-Policy
  // Controla qué información se envía en el header Referrer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // 6. Permissions-Policy (antes Feature-Policy)
  // Controla qué features del navegador puede usar la página
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  )

  // 7. Content-Security-Policy (CSP)
  // Política restrictiva para prevenir XSS y inyecciones de contenido
  // Personalizada para Next.js y Payload CMS
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js necesita unsafe-eval
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

// Aplica el middleware a todas las rutas excepto recursos estáticos
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
