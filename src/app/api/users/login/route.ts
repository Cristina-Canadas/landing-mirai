import config from '@payload-config'
import { getPayload } from 'payload'

import {
  DEFAULT_SESSION_SECONDS,
  REMEMBERED_SESSION_SECONDS,
  buildPayloadTokenCookie,
  getFieldsToSignFromToken,
  isRememberSessionEnabled,
  signSessionToken,
  updateUserSessionExpiration,
} from '../../../../lib/auth-session'

async function getLoginBody(request: Request): Promise<{ email: string; password: string }> {
  const contentType = request.headers.get('content-type') ?? ''

  const extractCredentials = (value: unknown): { email: string; password: string } => {
    const payload =
      typeof value === 'object' && value !== null && '_payload' in value && typeof value._payload === 'string'
        ? JSON.parse(value._payload)
        : value

    return {
      email: typeof payload?.email === 'string' ? payload.email : '',
      password: typeof payload?.password === 'string' ? payload.password : '',
    }
  }

  if (contentType.includes('application/json')) {
    const body = await request.json()

    return extractCredentials(body)
  }

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const payload = formData.get('_payload')

    if (typeof payload === 'string') {
      return extractCredentials({ _payload: payload })
    }

    return extractCredentials({
      email: formData.get('email'),
      password: formData.get('password'),
    })
  }

  const text = await request.text()
  const searchParams = new URLSearchParams(text)

  if (searchParams.get('_payload')) {
    return extractCredentials({ _payload: searchParams.get('_payload') })
  }

  return extractCredentials({
    email: searchParams.get('email'),
    password: searchParams.get('password'),
  })
}

function getErrorResponse(error: unknown): Response {
  const status =
    typeof error === 'object' && error && 'status' in error && typeof error.status === 'number'
      ? error.status
      : 500

  const message = error instanceof Error ? error.message : 'Error interno del servidor'
  const name =
    typeof error === 'object' && error && 'name' in error && typeof error.name === 'string'
      ? error.name
      : 'APIError'

  return Response.json(
    {
      data: null,
      isOperational: true,
      isPublic: true,
      message,
      name,
      status,
    },
    { status },
  )
}

export async function POST(request: Request) {
  try {
    const body = await getLoginBody(request)
    const payload = await getPayload({ config })
    const rememberSession = isRememberSessionEnabled(request.headers.get('cookie'))
    const expiresInSeconds = rememberSession ? REMEMBERED_SESSION_SECONDS : DEFAULT_SESSION_SECONDS

    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: body.email,
        password: body.password,
      },
      req: {
        headers: request.headers,
      },
    })

    if (!loginResult.token) {
      throw new Error('Payload no devolvió un token de autenticación.')
    }

    if (!loginResult.user) {
      throw new Error('Payload no devolvió el usuario autenticado.')
    }

    const fieldsToSign = getFieldsToSignFromToken(loginResult.token)
    const { exp, token } = await signSessionToken({
      expiresInSeconds,
      fieldsToSign,
      secret: payload.secret,
    })

    await updateUserSessionExpiration({
      collection: 'users',
      expiresInSeconds,
      payload,
      sid: typeof fieldsToSign.sid === 'string' ? fieldsToSign.sid : undefined,
      userID: loginResult.user.id,
    })

    const headers = new Headers()
    headers.append(
      'Set-Cookie',
      buildPayloadTokenCookie({
        authConfig: payload.collections.users.config.auth,
        cookiePrefix: payload.config.cookiePrefix,
        expiresInSeconds,
        token,
      }),
    )

    return Response.json(
      {
        message: 'Autenticación correcta',
        ...loginResult,
        exp,
        token,
      },
      {
        headers,
        status: 200,
      },
    )
  } catch (error) {
    return getErrorResponse(error)
  }
}
