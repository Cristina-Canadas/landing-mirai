import config from '@payload-config'
import { getPayload } from 'payload'

type DeleteToolBody = {
  toolId?: unknown
}

function getErrorResponse(error: unknown): Response {
  const status =
    typeof error === 'object' && error && 'status' in error && typeof error.status === 'number'
      ? error.status
      : 500

  const message = error instanceof Error ? error.message : 'Internal server error'

  return Response.json({ error: message, status }, { status })
}

function normalizeId(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : ''
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
          error: 'Unauthorized',
          message: 'Unauthorized',
          status: 403,
        },
        { status: 403 },
      )
    }

    const body = (await request.json()) as DeleteToolBody
    const toolId = normalizeId(body.toolId)

    if (!toolId) {
      return Response.json({ error: 'Missing toolId', status: 400 }, { status: 400 })
    }

    const relatedClicks = await payload.find({
      collection: 'toolClicks',
      depth: 0,
      limit: 10000,
      overrideAccess: true,
      where: {
        tool: {
          equals: toolId,
        },
      },
    })

    for (const click of relatedClicks.docs) {
      await payload.delete({
        collection: 'toolClicks',
        id: click.id,
        overrideAccess: true,
      })
    }

    await payload.delete({
      collection: 'tools',
      id: toolId,
      overrideAccess: true,
    })

    return Response.json({
      deletedAnalyticsEvents: relatedClicks.totalDocs,
      message: 'Tool deleted permanently.',
      ok: true,
    })
  } catch (error) {
    return getErrorResponse(error)
  }
}
