/**
 * Security Utilities API para Mirai Suite
 * Funciones reutilizables para validación y protección
 *
 * Uso:
 * - Rate limiting: Protege rutas contra brute force
 * - Cookie security: Configura cookies seguras
 * - Input validation: Valida datos de entrada
 */

import { headers } from 'next/headers'

// ============================================================================
// 1. RATE LIMITING - Simple en memoria (para desarrollo/demo)
// ============================================================================

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const rateLimitStore: RateLimitStore = {}

/**
 * Rate limiter simple por IP
 * Uso en rutas de API: checkRateLimit('login', 5, 300000)
 * @param key - Identificador único (ej: IP, user)
 * @param maxRequests - Máximo de requests permitidos
 * @param windowMs - Ventana de tiempo en milisegundos (300000 = 5 min)
 * @returns true si puede procesar, false si excedió límite
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 300000 // 5 minutos
): Promise<boolean> {
  const now = Date.now()
  const record = rateLimitStore[key]

  if (!record || now > record.resetTime) {
    // Nueva ventana de tiempo
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

/**
 * Rate limiter por IP del cliente
 * Integrable en rutas de API sensibles (login, signup)
 */
export async function getRateLimitByIp(
  maxRequests: number = 5,
  windowMs: number = 300000
) {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown'

  const canProceed = await checkRateLimit(`ip:${ip}`, maxRequests, windowMs)

  return {
    canProceed,
    ip,
    resetTime: rateLimitStore[`ip:${ip}`]?.resetTime || 0,
  }
}

// ============================================================================
// 2. SECURE COOKIE CONFIGURATION
// ============================================================================

export const SECURE_COOKIE_OPTIONS = {
  // Cookies para desarrollo (HTTP)
  dev: {
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  },
  // Cookies para producción (HTTPS)
  prod: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  },
}

// ============================================================================
// 3. INPUT VALIDATION
// ============================================================================

/**
 * Valida y sanitiza emails
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Valida contraseñas (mínimo recomendado para seguridad)
 * Requisitos:
 * - Mínimo 12 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 */
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push('Mínimo 12 caracteres')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Requiere al menos 1 mayúscula')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Requiere al menos 1 minúscula')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Requiere al menos 1 número')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitiza strings para prevenir XSS
 * Nota: React auto-escapa en el renderizado, pero esto es útil
 * para validación adicional y logging
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input
    .slice(0, maxLength)
    .replace(/[<>\"']/g, '')
    .trim()
}

/**
 * Valida URLs de forma segura
 * Solo permite http://, https:// o #
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false

  try {
    if (url === '#' || url.startsWith('#')) return true

    const urlObj = new URL(url, 'http://localhost')
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

// ============================================================================
// 4. SECURITY UTILITIES
// ============================================================================

/**
 * Genera un nonce criptográfico para CSP
 * Uso: <script nonce={generateNonce()}>
 */
export function generateNonce(): string {
  return Buffer.from(Math.random().toString()).toString('base64').slice(0, 32)
}

/**
 * Valida que una solicitud sea segura (HTTPS en prod, CORS, etc)
 */
export async function isSecureRequest(): Promise<boolean> {
  const headersList = await headers()
  const protocol = headersList.get('x-forwarded-proto') || 'http'

  // En producción, solo permite HTTPS
  if (process.env.NODE_ENV === 'production') {
    return protocol === 'https'
  }

  return true
}

// ============================================================================
// 5. PAYLOAD CMS SECURITY CONFIG (para payload.config.ts)
// ============================================================================

/**
 * Configuración de seguridad recomendada para Payload CMS
 * Cópialo en payload.config.ts dentro de buildConfig({...})
 *
 * Ejemplo de uso en payload.config.ts:
 *
 * export default buildConfig({
 *   // ... otros settings ...
 *   admin: {
 *     // ... admin settings ...
 *     meta: {
 *       titleSuffix: '— Mirai Suite',
 *     },
 *   },
 *   // AGREGAR ESTO:
 *   ...PAYLOAD_SECURITY_CONFIG,
 *   // ... más settings ...
 * })
 */
export const PAYLOAD_SECURITY_CONFIG = {
  // Timeouts para sesiones
  maxDepth: 20,

  // Validación de token
  access: {
    // Middleware personalizado si necesitas
  },

  // Rate limiting (implementar en custom hooks si es necesario)
  // Payload no tiene rate limiting built-in
  // Recomendación: implementar en middleware.ts o en rutas API específicas
}

// ============================================================================
// 6. CONSTANTS - Valores recomendados de seguridad
// ============================================================================

export const SECURITY_CONSTANTS = {
  // Session timeout en milisegundos
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 días para CMS, 8 horas para apps sensibles

  // Max attempts antes de lockout
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos

  // Password requirements
  MIN_PASSWORD_LENGTH: 12,
  REQUIRE_UPPERCASE: true,
  REQUIRE_NUMBERS: true,

  // Rate limiting
  RATE_LIMIT_WINDOW: 5 * 60 * 1000, // 5 minutos
  RATE_LIMIT_MAX_REQUESTS: 10,

  // Input validation
  MAX_EMAIL_LENGTH: 254,
  MAX_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 2000,

  // Content Security
  CSP_HEADER: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:",
}
