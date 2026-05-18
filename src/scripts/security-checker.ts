/**
 * Security Checker — Validaciones de seguridad específicas
 *
 * Utilidades para chequear:
 * - Headers de seguridad
 * - CORS configuration
 * - Cookie security
 * - Input validation
 * - Authentication
 */

export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
}

export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  path: '/',
}

/**
 * Validar que una contraseña es fuerte
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push('La contraseña debe tener al menos 12 caracteres')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener mayúsculas')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener minúsculas')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener números')
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener caracteres especiales')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitizar entrada para prevenir XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

/**
 * Validar email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Verificar si URL es segura (no JavaScript protocol)
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return !['javascript:', 'data:', 'vbscript:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Generar nonce para CSP
 */
export function generateNonce(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64')
}

/**
 * Checklist de seguridad para deployment
 */
export const SECURITY_CHECKLIST = [
  {
    category: 'Dependencies',
    checks: [
      '✓ npm audit sin vulnerabilidades críticas',
      '✓ Dependencias actualizadas',
      '✓ Evaluar supply chain risk',
    ],
  },
  {
    category: 'Secrets Management',
    checks: [
      '✓ .env no está en git (.gitignore)',
      '✓ PAYLOAD_SECRET es único y fuerte',
      '✓ DATABASE_PASSWORD es fuerte',
      '✓ No hay hardcoded secrets',
    ],
  },
  {
    category: 'Authentication',
    checks: [
      '✓ Admin tiene contraseña fuerte',
      '✓ JWT_SECRET es seguro',
      '✓ Sessions tienen timeout',
      '✓ Logout limpia cookies',
    ],
  },
  {
    category: 'HTTPS & TLS',
    checks: [
      '✓ HTTPS habilitado en producción',
      '✓ TLS 1.2+ requerido',
      '✓ HSTS habilitado',
      '✓ Certificado válido y renovable',
    ],
  },
  {
    category: 'HTTP Headers',
    checks: [
      '✓ Strict-Transport-Security configurado',
      '✓ X-Content-Type-Options: nosniff',
      '✓ X-Frame-Options: DENY',
      '✓ Content-Security-Policy configurado',
    ],
  },
  {
    category: 'CORS & CSRF',
    checks: [
      '✓ CORS restrictivo (no *)',
      '✓ CSRF tokens en formularios',
      '✓ SameSite cookies configuradas',
    ],
  },
  {
    category: 'Input Validation',
    checks: [
      '✓ Inputs validados en servidor',
      '✓ Sanitizar entrada antes de usar',
      '✓ Prepared statements en queries',
      '✓ Validar file uploads',
    ],
  },
  {
    category: 'Database',
    checks: [
      '✓ PostgreSQL en producción (no SQLite)',
      '✓ Backups encriptados y testados',
      '✓ Acceso restringido por IP',
      '✓ Query logging para auditoría',
    ],
  },
  {
    category: 'Logging & Monitoring',
    checks: [
      '✓ Logs sin datos sensibles',
      '✓ Error handling sin stack traces públicos',
      '✓ Rate limiting activo',
      '✓ Alertas de security events',
    ],
  },
  {
    category: 'Infrastructure',
    checks: [
      '✓ Principio de menor privilegio',
      '✓ Updates de seguridad automáticas',
      '✓ Firewall configurado',
      '✓ DDoS protection activo',
    ],
  },
]

/**
 * Validar configuración de CORS
 */
export function validateCORS(corsOrigins: string[]): {
  valid: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  if (corsOrigins.includes('*')) {
    warnings.push('⚠️ CORS permitido para cualquier origen (muy permisivo)')
  }

  if (corsOrigins.filter(o => o.includes('*')).length > 0) {
    warnings.push('⚠️ CORS con wildcards es inseguro')
  }

  if (corsOrigins.length === 0) {
    warnings.push('⚠️ CORS sin orígenes configurados')
  }

  return {
    valid: warnings.length === 0,
    warnings,
  }
}

/**
 * Validar rate limiting
 */
export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Demasiadas peticiones, intenta más tarde',
  statusCode: 429,
  skip: (req: any) => req.user?.isAdmin, // Skip para admins
}

/**
 * Validar timeout de sesión
 */
export const SESSION_CONFIG = {
  maxAge: 60 * 60 * 1000, // 1 hora
  idleTimeout: 15 * 60 * 1000, // 15 minutos sin actividad
  renewThreshold: 5 * 60 * 1000, // Renovar si quedan < 5 min
}

/**
 * Función para verificar si una request es segura
 */
export function isSecureRequest(req: any): {
  secure: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Verificar HTTPS
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers['x-forwarded-proto'] || req.protocol
    if (proto !== 'https') {
      issues.push('No es HTTPS')
    }
  }

  // Verificar headers de seguridad
  if (!req.headers['x-content-type-options']) {
    issues.push('Falta X-Content-Type-Options header')
  }

  // Verificar cookies
  const cookies = req.headers.cookie || ''
  if (req.path?.includes('admin') && !cookies.includes('Payload-Token')) {
    issues.push('Falta Payload authentication token')
  }

  return {
    secure: issues.length === 0,
    issues,
  }
}
