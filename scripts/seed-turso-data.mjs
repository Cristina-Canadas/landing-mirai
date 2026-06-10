/**
 * Copies all data from local payload.db to Turso.
 * Run after seed-turso-schema.mjs.
 *
 * Usage:
 *   DATABASE_URI=libsql://... DATABASE_AUTH_TOKEN=ey... node scripts/seed-turso-data.mjs
 */

import { createClient } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localDbPath = path.resolve(__dirname, '../payload.db')

const remoteUri = process.env.DATABASE_URI
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!remoteUri?.startsWith('libsql://')) {
  console.error('ERROR: DATABASE_URI must be a libsql:// Turso URL')
  process.exit(1)
}
if (!authToken) {
  console.error('ERROR: DATABASE_AUTH_TOKEN is required')
  process.exit(1)
}

const local = createClient({ url: `file:${localDbPath}` })
const turso = createClient({ url: remoteUri, authToken })

// Order matters — parent tables before child tables
const TABLE_ORDER = [
  'users',
  'users_sessions',
  'media',
  'categories',
  'categories_locales',
  'tools',
  'tools_locales',
  'visits',
  'tool_clicks',
  'payload_migrations',
  'payload_preferences',
  'payload_preferences_rels',
  'payload_locked_documents',
  'payload_locked_documents_rels',
  'payload_kv',
]

console.log(`Copying data from: ${localDbPath}`)
console.log(`Destination: ${remoteUri}\n`)

for (const table of TABLE_ORDER) {
  const result = await local.execute(`SELECT * FROM "${table}"`)
  const rows = result.rows

  if (rows.length === 0) {
    console.log(`- ${table}: empty, skipped`)
    continue
  }

  const columns = result.columns
  const placeholders = columns.map(() => '?').join(', ')
  const colNames = columns.map(c => `"${c}"`).join(', ')
  const sql = `INSERT OR IGNORE INTO "${table}" (${colNames}) VALUES (${placeholders})`

  let inserted = 0
  for (const row of rows) {
    try {
      const values = columns.map(col => {
        const val = row[col]
        // Convert ArrayBuffer/Uint8Array to base64 string for transport
        if (val instanceof Uint8Array) return Buffer.from(val).toString('base64')
        return val
      })
      await turso.execute({ sql, args: values })
      inserted++
    } catch (e) {
      if (!e.message?.includes('UNIQUE constraint')) {
        console.error(`  ✗ Row error in ${table}: ${e.message}`)
      }
    }
  }

  console.log(`✓ ${table}: ${inserted}/${rows.length} rows`)
}

console.log('\nDone!')
local.close()
turso.close()
