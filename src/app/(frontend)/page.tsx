import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ToolsGrid } from '@/components/ToolsGrid'
import { translations } from '@/i18n/translations'
import { isVisitsTrackingEnabled } from '@/lib/visits-metrics'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const lang = 'en' as const
  const t = translations[lang]

  const payload = await getPayload({ config })

  try {
    const requestHeaders = await headers()
    const userAgent = (requestHeaders.get('user-agent') ?? '').slice(0, 300)
    const isBot = /bot|crawler|spider|preview|lighthouse/i.test(userAgent)

    if (isVisitsTrackingEnabled() && !isBot) {
      await payload.create({
        collection: 'visits',
        data: {
          path: '/',
          locale: lang,
          userAgent,
        },
        overrideAccess: true,
      })
    }
  } catch {
    // Avoid blocking the homepage if analytics tracking fails.
  }

  const [{ docs: tools }, { docs: categoriesFromDB }] = await Promise.all([
    payload.find({
      collection: 'tools',
      sort: 'order',
      limit: 100,
      locale: lang,
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      limit: 100,
      locale: lang,
      sort: 'name',
    }),
  ])

  const getCategorySlug = (category: unknown): string => {
    if (!category) return ''
    if (typeof category === 'object' && category !== null && 'slug' in category) {
      return String((category as { slug: unknown }).slug ?? '')
    }
    return ''
  }

  const toolsForGrid = tools.map((tool) => ({
    id: String(tool.id),
    name: String(tool.name ?? ''),
    description: String(tool.description ?? ''),
    url: String(tool.url ?? '#'),
    category: getCategorySlug(tool.category),
    status: tool.status as 'active' | 'coming_soon' | 'deprecated',
    icon: String(tool.icon ?? 'Wrench'),
  }))

  const categoriesForGrid = categoriesFromDB.map((cat) => ({
    slug: String(cat.slug ?? ''),
    name: String(cat.name ?? ''),
    color: String(cat.color ?? 'blue'),
    icon: String(cat.icon ?? 'Wrench'),
  }))

  return (
    <ToolsGrid
      tools={toolsForGrid}
      categories={categoriesForGrid}
      allLabel={t.categories.all}
      uiTranslations={{
        openTool: t.ui.openTool,
        comingSoon: t.ui.comingSoon,
        deprecated: t.ui.deprecated,
        favorites: t.ui.favorites,
        mostUsed: t.ui.mostUsed,
        noResults: t.ui.noResults,
        searchPlaceholder: t.ui.searchPlaceholder,
        heroTitle: t.ui.heroTitle,
        heroSubtitle: t.ui.heroSubtitle,
        footerNote: t.ui.footerNote,
      }}
    />
  )
}
