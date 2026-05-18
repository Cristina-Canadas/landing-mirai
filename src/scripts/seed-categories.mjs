/**
 * Seed categories + assign tools — direct SQLite, no Payload/Next.js context needed.
 * Run: node src/scripts/seed-categories.mjs
 */

import { createClient } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../../payload.db')
const db = createClient({ url: `file:${dbPath}` })

const CATEGORIES = [
  { slug: 'integration_core',  color: 'blue',   icon: 'Settings',   names: { es: 'Integración & Core',    en: 'Integration & Core',   fr: 'Intégration & Core',      ca: 'Integració & Core',    pt: 'Integração & Core'    } },
  { slug: 'layout_css',        color: 'green',  icon: 'Paintbrush', names: { es: 'Layout & CSS',           en: 'Layout & CSS',          fr: 'Mise en page & CSS',      ca: 'Layout & CSS',         pt: 'Layout & CSS'          } },
  { slug: 'content_elementor', color: 'purple', icon: 'FormInput',  names: { es: 'Contenido & Elementor', en: 'Content & Elementor',   fr: 'Contenu & Elementor',     ca: 'Contingut & Elementor',pt: 'Conteúdo & Elementor'  } },
  { slug: 'seo_audit',         color: 'orange', icon: 'ShieldAlert',names: { es: 'SEO & Auditoría',        en: 'SEO & Audit',           fr: 'SEO & Audit',             ca: 'SEO & Auditoria',      pt: 'SEO & Auditoria'       } },
]

const TOOL_CATEGORY_MAP = {
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

const now = new Date().toISOString()

async function main() {
  // 1. Upsert categories
  const categoryIdMap = {}

  for (const cat of CATEGORIES) {
    const existing = await db.execute({
      sql: 'SELECT id FROM categories WHERE slug = ?',
      args: [cat.slug],
    })

    let catId
    if (existing.rows.length > 0) {
      catId = Number(existing.rows[0][0])
      console.log(`⏭  Category exists: ${cat.slug} (id=${catId})`)
    } else {
      const ins = await db.execute({
        sql: 'INSERT INTO categories (slug, color, icon, updated_at, created_at) VALUES (?, ?, ?, ?, ?)',
        args: [cat.slug, cat.color, cat.icon, now, now],
      })
      catId = Number(ins.lastInsertRowid)
      console.log(`✅ Created category: ${cat.slug} (id=${catId})`)
    }

    categoryIdMap[cat.slug] = catId

    // Upsert localized names
    for (const [locale, name] of Object.entries(cat.names)) {
      const existingLocale = await db.execute({
        sql: 'SELECT id FROM categories_locales WHERE _parent_id = ? AND _locale = ?',
        args: [catId, locale],
      })

      if (existingLocale.rows.length > 0) {
        await db.execute({
          sql: 'UPDATE categories_locales SET name = ? WHERE _parent_id = ? AND _locale = ?',
          args: [name, catId, locale],
        })
      } else {
        await db.execute({
          sql: 'INSERT INTO categories_locales (_parent_id, _locale, name) VALUES (?, ?, ?)',
          args: [catId, locale, name],
        })
      }
    }
  }

  // 2. Get all tools with their Spanish names
  const toolsResult = await db.execute(`
    SELECT t.id, tl.name
    FROM tools t
    LEFT JOIN tools_locales tl ON tl._parent_id = t.id AND tl._locale = 'es'
  `)

  console.log(`\n📎 Assigning categories to ${toolsResult.rows.length} tools...`)

  for (const row of toolsResult.rows) {
    const toolId = Number(row[0])
    const toolName = String(row[1] ?? '')
    const slug = TOOL_CATEGORY_MAP[toolName]

    if (!slug) {
      console.log(`⚠️  No mapping for: "${toolName}"`)
      continue
    }

    const catId = categoryIdMap[slug]
    if (!catId) continue

    await db.execute({
      sql: 'UPDATE tools SET category_id = ? WHERE id = ?',
      args: [catId, toolId],
    })

    console.log(`✅ "${toolName}" → ${slug}`)
  }

  console.log('\n✨ Done.')
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
