import { SignJWT, decodeJwt } from 'jose'
import type { Auth, Payload } from 'payload'

export const DEFAULT_SESSION_SECONDS = 60 * 60 * 2
export const REMEMBERED_SESSION_SECONDS = 60 * 60 * 24 * 30
export const REMEMBER_SESSION_COOKIE = 'mirai-remember-session'
export const REMEMBER_SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const JWT_RESERVED_FIELDS = new Set(['aud', 'exp', 'iat', 'iss', 'jti', 'nbf'])

function serializeCookie({
  domain,
  expires,
  httpOnly = false,
  maxAge,
  name,
  path = '/',
  sameSite,
  secure = false,
  value,
}: {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  name: string
  path?: string
  sameSite?: 'Lax' | 'None' | 'Strict'
  secure?: boolean
  value: string
}): string {
  const parts = [`${name}=${value}`]

  if (expires) parts.push(`Expires=${expires.toUTCString()}`)
  if (typeof maxAge === 'number') parts.push(`Max-Age=${maxAge}`)
  if (domain) parts.push(`Domain=${domain}`)
  if (path) parts.push(`Path=${path}`)
  if (secure) parts.push('Secure')
  if (httpOnly) parts.push('HttpOnly')
  if (sameSite) parts.push(`SameSite=${sameSite}`)

  return parts.join('; ')
}

function resolveSameSite(sameSite: Auth['cookies']['sameSite']): 'Lax' | 'None' | 'Strict' | undefined {
  if (typeof sameSite === 'string') {
    const normalized = sameSite.toLowerCase()
    if (normalized === 'lax') return 'Lax'
    if (normalized === 'none') return 'None'
    if (normalized === 'strict') return 'Strict'
  }

  if (sameSite) return 'Strict'

  return undefined
}

export function isRememberSessionEnabled(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false

  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .some((part) => part === `${REMEMBER_SESSION_COOKIE}=1`)
}

export function buildRememberSessionPreferenceCookie(enabled: boolean): string {
  return serializeCookie({
    expires: enabled ? new Date(Date.now() + REMEMBER_SESSION_COOKIE_MAX_AGE * 1000) : new Date(0),
    maxAge: enabled ? REMEMBER_SESSION_COOKIE_MAX_AGE : 0,
    name: REMEMBER_SESSION_COOKIE,
    sameSite: 'Lax',
    value: enabled ? '1' : '0',
  })
}

export function buildPayloadTokenCookie(args: {
  authConfig: Auth
  cookiePrefix: string
  expiresInSeconds: number
  token: string
}): string {
  const { authConfig, cookiePrefix, expiresInSeconds, token } = args
  const sameSite = resolveSameSite(authConfig.cookies.sameSite)
  const secure = Boolean(authConfig.cookies.secure || sameSite === 'None')

  return serializeCookie({
    domain: authConfig.cookies.domain ?? undefined,
    expires: new Date(Date.now() + expiresInSeconds * 1000),
    httpOnly: true,
    maxAge: expiresInSeconds,
    name: `${cookiePrefix}-token`,
    sameSite,
    secure,
    value: token,
  })
}

export function getFieldsToSignFromToken(token: string): Record<string, unknown> {
  const decoded = decodeJwt(token)

  return Object.fromEntries(Object.entries(decoded).filter(([key]) => !JWT_RESERVED_FIELDS.has(key)))
}

export async function signSessionToken(args: {
  expiresInSeconds: number
  fieldsToSign: Record<string, unknown>
  secret: string
}): Promise<{ exp: number; token: string }> {
  const { expiresInSeconds, fieldsToSign, secret } = args
  const secretKey = new TextEncoder().encode(secret)
  const issuedAt = Math.floor(Date.now() / 1000)
  const exp = issuedAt + expiresInSeconds

  const token = await new SignJWT(fieldsToSign)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(exp)
    .sign(secretKey)

  return { exp, token }
}

export async function updateUserSessionExpiration(args: {
  collection: string
  expiresInSeconds: number
  payload: Payload
  sid?: string
  userID: number | string
}): Promise<void> {
  const { collection, expiresInSeconds, payload, sid, userID } = args

  if (!sid) return

  const user = await payload.db.findOne({
    collection,
    where: {
      id: {
        equals: userID,
      },
    },
  })

  const userWithSessions = user as (Record<string, unknown> & { sessions?: Record<string, unknown>[] }) | null

  if (!userWithSessions || !Array.isArray(userWithSessions.sessions)) return

  const nextExpiry = new Date(Date.now() + expiresInSeconds * 1000)
  const sessions = userWithSessions.sessions.map((session: Record<string, unknown>) => {
    if (session.id !== sid) return session

    return {
      ...session,
      expiresAt: nextExpiry,
    }
  })

  await payload.db.updateOne({
    collection,
    data: {
      sessions,
    },
    id: userID,
    returning: false,
  })
}
