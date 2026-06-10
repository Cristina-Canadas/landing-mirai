import { type NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function computeGateToken(): string {
  const email = (process.env['GATE_EMAIL'] ?? '').toLowerCase()
  const password = process.env['GATE_PASSWORD'] ?? ''
  const secret = process.env['PAYLOAD_SECRET'] ?? 'gate-dev-fallback'
  return crypto.createHmac('sha256', secret).update(`${email}:${password}`).digest('hex')
}

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const { email = '', password = '' } = body
  const expectedEmail = (process.env['GATE_EMAIL'] ?? '').toLowerCase()
  const expectedPassword = process.env['GATE_PASSWORD'] ?? ''

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json({ error: 'Gate no configurado' }, { status: 500 })
  }

  const emailOk = email.toLowerCase() === expectedEmail
  const passwordOk = password === expectedPassword

  if (!emailOk || !passwordOk) {
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  const token = computeGateToken()
  const response = NextResponse.json({ ok: true })
  response.cookies.set('mirai_gate', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}
