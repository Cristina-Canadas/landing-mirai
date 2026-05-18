import config from '@payload-config'
import { getPayload } from 'payload'

type ToolClickBody = {
  locale?: unknown
  path?: unknown
  toolId?: unknown
}

function cleanString(value: unknown, fallback: string, maxLength = 300): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  if (!trimmed) return fallback
  return trimmed.slice(0, maxLength)
}

function getLocalizedValue(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value
  if (value && typeof value === 'object') {
    const localized = value as Record<string, unknown>
    const next = localized.en ?? localized.es ?? Object.values(localized)[0]
    if (typeof next === 'string' && next.trim()) return next
  }
  return fallback
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ToolClickBody
    const toolId = cleanString(body.toolId, '', 80)

    if (!toolId) {
      return Response.json({ error: 'Missing toolId' }, { status: 400 })
    }

    const userAgent = cleanString(request.headers.get('user-agent'), '', 300)
    const isBot = /bot|crawler|spider|preview|lighthouse/i.test(userAgent)

    if (isBot) {
      return Response.json({ ok: true, skipped: 'bot' })
    }

    const payload = await getPayload({ config })
    const tool = await payload.findByID({
      collection: 'tools',
      id: toolId,
      depth: 0,
      locale: 'en',
      overrideAccess: true,
    })

    await payload.create({
      collection: 'toolClicks',
      data: {
        tool: tool.id,
        toolName: getLocalizedValue(tool.name, `Tool ${tool.id}`),
        toolUrl: String(tool.url ?? ''),
        locale: cleanString(body.locale, 'en', 8),
        path: cleanString(body.path, '/', 160),
        userAgent,
      },
      overrideAccess: true,
    })

    return Response.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not track tool click'
    return Response.json({ error: message }, { status: 500 })
  }
}
