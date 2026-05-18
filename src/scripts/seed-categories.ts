/**
 * Seed categories + assign them to existing tools.
 * Run once: npm run seed:categories
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const CATEGORIES = [
  {
    slug: 'integration_core',
    color: 'blue' as const,
    icon: 'Settings',
    name: { es: 'Integración & Core', en: 'Integration & Core', fr: 'Intégration & Core', ca: 'Integració & Core', pt: 'Integração & Core' },
  },
  {
    slug: 'layout_css',
    color: 'green' as const,
    icon: 'Paintbrush',
    name: { es: 'Layout & CSS', en: 'Layout & CSS', fr: 'Mise en page & CSS', ca: 'Layout & CSS', pt: 'Layout & CSS' },
  },
  {
    slug: 'content_elementor',
    color: 'purple' as const,
    icon: 'FormInput',
    name: { es: 'Contenido & Elementor', en: 'Content & Elementor', fr: 'Contenu & Elementor', ca: 'Contingut & Elementor', pt: 'Conteúdo & Elementor' },
  },
  {
    slug: 'seo_audit',
    color: 'orange' as const,
    icon: 'ShieldAlert',
    name: { es: 'SEO & Auditoría', en: 'SEO & Audit', fr: 'SEO & Audit', ca: 'SEO & Auditoria', pt: 'SEO & Auditoria' },
  },
]

// Tool name (es) → category slug, from the original seed data
const TOOL_CATEGORY_MAP: Record<string, string> = {
  'Mirai Core Tools':         'integration_core',
  'Extranet Data Reader':     'integration_core',
  'Forwarder URL Creator':    'integration_core',
  'Clamp Calculator':         'layout_css',
  'CSS Sorter':               'layout_css',
  'Elementor Form Generator': 'content_elementor',
  'Pop up Image Generator':   'content_elementor',
  'XML to Elementor JSON':    'content_elementor',
  'Audit URL Checker':        'seo_audit',
  'Redirection Assistant':    'seo_audit',
  'Image Resizer':            'seo_audit',
}

async function seedCategories() {
  console.log('🌱 Seeding categories...')
  const payload = await getPayload({ config })

  // 1. Create categories
  const categoryIdMap: Record<string, number> = {}

  for (const cat of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      categoryIdMap[cat.slug] = existing.docs[0].id as number
      console.log(`⏭  Category already exists: ${cat.slug}`)
      continue
    }

    const created = await payload.create({
      collection: 'categories',
      locale: 'es',
      data: { name: cat.name.es, slug: cat.slug, color: cat.color, icon: cat.icon },
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
    console.log(`✅ Created category: ${cat.slug}`)
  }

  // 2. Assign categories to tools
  console.log('\n📎 Assigning categories to tools...')

  const { docs: tools } = await payload.find({
    collection: 'tools',
    limit: 200,
    locale: 'es',
    depth: 0,
  })

  for (const tool of tools) {
    const name = String(tool.name ?? '')
    const slug = TOOL_CATEGORY_MAP[name]

    if (!slug) {
      console.log(`⚠️  No category mapping for: "${name}" — skipped`)
      continue
    }

    const categoryId = categoryIdMap[slug]
    if (!categoryId) continue

    await payload.update({
      collection: 'tools',
      id: tool.id,
      data: { category: categoryId },
    })

    console.log(`✅ ${name} → ${slug}`)
  }

  console.log('\n✨ Done.')
  process.exit(0)
}

seedCategories().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
