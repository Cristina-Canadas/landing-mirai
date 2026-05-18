import config from '@payload-config'
import { getFieldsToSign, getPayload } from 'payload'

import {
  DEFAULT_SESSION_SECONDS,
  REMEMBERED_SESSION_SECONDS,
  buildPayloadTokenCookie,
  isRememberSessionEnabled,
  signSessionToken,
  updateUserSessionExpiration,
} from '../../../../lib/auth-session'

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
    const payload = await getPayload({ config })
    const authResult = await payload.auth({
      canSetHeaders: true,
      headers: request.headers,
    })

    if (!authResult.user || authResult.user.collection !== 'users') {
      return Response.json(
        {
          data: null,
          isOperational: true,
          isPublic: true,
          message: 'No autorizado',
          name: 'AuthenticationError',
          status: 403,
        },
        { status: 403 },
      )
    }

    const rememberSession = isRememberSessionEnabled(request.headers.get('cookie'))
    const expiresInSeconds = rememberSession ? REMEMBERED_SESSION_SECONDS : DEFAULT_SESSION_SECONDS
    const user = authResult.user
    const sid = typeof user._sid === 'string' ? user._sid : undefined

    const rawUser = await payload.findByID({
      collection: 'users',
      depth: 0,
      id: user.id,
      overrideAccess: true,
      showHiddenFields: true,
    })

    const fieldsToSign = getFieldsToSign({
      collectionConfig: payload.collections.users.config,
      email: rawUser.email ?? user.email,
      sid,
      user: {
        ...rawUser,
        collection: 'users',
      },
    })

    const { exp, token } = await signSessionToken({
      expiresInSeconds,
      fieldsToSign,
      secret: payload.secret,
    })

    await updateUserSessionExpiration({
      collection: 'users',
      expiresInSeconds,
      payload,
      sid,
      userID: user.id,
    })

    const headers = new Headers(authResult.responseHeaders)
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
        exp,
        message: 'Token refrescado correctamente',
        refreshedToken: token,
        setCookie: true,
        strategy: user._strategy,
        user,
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
