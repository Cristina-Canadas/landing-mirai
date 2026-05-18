import config from '@payload-config'
import { getPayload } from 'payload'

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
          error: 'No autorizado',
          message: 'No autorizado',
          status: 403,
        },
        { status: 403 },
      )
    }

    const { docs } = await payload.find({
      collection: 'tools',
      depth: 0,
      limit: 0,
      overrideAccess: true,
      sort: '_order',
      select: {
        id: true,
        order: true,
      },
    })

    let updated = 0

    for (const [index, doc] of docs.entries()) {
      const nextOrder = index + 1

      if (doc.order === nextOrder) {
        continue
      }

      await payload.update({
        collection: 'tools',
        id: doc.id,
        data: {
          order: nextOrder,
        },
        overrideAccess: true,
      })

      updated += 1
    }

    return Response.json({
      message: `Orden guardado correctamente. ${updated} herramientas actualizadas.`,
      updated,
    })
  } catch (error) {
    return getErrorResponse(error)
  }
}
