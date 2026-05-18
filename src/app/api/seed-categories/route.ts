import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Solo disponible en development
// Llamar una sola vez: GET localhost:3000/api/seed-categories

const CATEGORIES_DATA = [
  {
    slug: 'integration_core',
    color: 'blue',
    icon: 'Settings',
    name: { es: 'Integración & Core', en: 'Integration & Core', fr: 'Intégration & Core', ca: 'Integració & Core', pt: 'Integração & Core' },
  },
  {
    slug: 'layout_css',
    color: 'green',
    icon: 'Paintbrush',
    name: { es: 'Layout & CSS', en: 'Layout & CSS', fr: 'Mise en page & CSS', ca: 'Layout & CSS', pt: 'Layout & CSS' },
  },
  {
    slug: 'content_elementor',
    color: 'purple',
    icon: 'FormInput',
    name: { es: 'Contenido & Elementor', en: 'Content & Elementor', fr: 'Contenu & Elementor', ca: 'Contingut & Elementor', pt: 'Conteúdo & Elementor' },
  },
  {
    slug: 'seo_audit',
    color: 'orange',
    icon: 'ShieldAlert',
    name: { es: 'SEO & Auditoría', en: 'SEO & Audit', fr: 'SEO & Audit', ca: 'SEO & Auditoria', pt: 'SEO & Auditoria' },
  },
]

// Mapping tool name (es) → category slug
const TOOL_CATEGORY_MAP: Record<string, string> = {
  'Mirai Core Tools': 'integration_core',
  'Extranet Data Reader': 'integration_core',
  'Forwarder URL Creator': 'integration_core',
  'Clamp Calculator': 'layout_css',
  'CSS Sorter': 'layout_css',
  'Elementor Form Generator': 'content_elementor',
  'Pop up Image Generator': 'content_elementor',
  'XML to Elementor JSON': 'content_elementor',
  'Image Resizer': 'content_elementor',
  'Audit URL Checker': 'seo_audit',
  'Redirection Assistant': 'seo_audit',
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config })

    // 1. Create categories (skip if slug already exists)
    const categoryIdMap: Record<string, number> = {}
    const categoriesCreated: string[] = []
    const categoriesSkipped: string[] = []

    for (const cat of CATEGORIES_DATA) {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.totalDocs > 0) {
        categoryIdMap[cat.slug] = existing.docs[0].id as number
        categoriesSkipped.push(cat.slug)
        continue
      }

      const created = await payload.create({
        collection: 'categories',
        locale: 'es',
        data: {
          name: cat.name.es,
          slug: cat.slug,
          color: cat.color as any,
          icon: cat.icon,
        },
      })

      for (const lang of ['en', 'fr', 'ca', 'pt'] as const) {
        await payload.update({
          collection: 'categories',
          id: created.id,
          locale: lang,
          data: { name: cat.name[lang] },
        })
      }

      categoryIdMap[cat.slug] = created.id as number
      categoriesCreated.push(cat.slug)
    }

    // 2. Assign categories to tools
    const { docs: tools } = await payload.find({
      collection: 'tools',
      limit: 200,
      locale: 'es',
      depth: 0,
    })

    const toolsUpdated: string[] = []
    const toolsSkipped: string[] = []

    for (const tool of tools) {
      const toolName = String(tool.name ?? '')
      const categorySlug = TOOL_CATEGORY_MAP[toolName]

      if (!categorySlug) {
        toolsSkipped.push(toolName)
        continue
      }

      const categoryId = categoryIdMap[categorySlug]
      if (!categoryId) {
        toolsSkipped.push(toolName)
        continue
      }

      // Only update if not already assigned
      if (tool.category && typeof tool.category === 'object' && (tool.category as any).id === categoryId) {
        toolsSkipped.push(toolName)
        continue
      }

      await payload.update({
        collection: 'tools',
        id: tool.id,
        data: { category: categoryId },
      })

      toolsUpdated.push(`${toolName} → ${categorySlug}`)
    }

    return NextResponse.json({
      message: 'Categorías creadas y asignadas correctamente.',
      categories: {
        created: categoriesCreated,
        skipped: categoriesSkipped,
      },
      tools: {
        updated: toolsUpdated,
        skipped: toolsSkipped,
      },
    })
  } catch (err) {
    console.error('Seed categories error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
