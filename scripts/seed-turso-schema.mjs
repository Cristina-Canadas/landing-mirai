/**
 * Copies the SQLite schema from local payload.db to Turso.
 * Run once to initialize the remote database tables.
 *
 * Usage:
 *   DATABASE_URI=libsql://... DATABASE_AUTH_TOKEN=ey... node scripts/seed-turso-schema.mjs
 */

import { createClient } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localDbPath = path.resolve(__dirname, '../payload.db')

const localUri = `file:${localDbPath}`
const remoteUri = process.env.DATABASE_URI
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!remoteUri || !remoteUri.startsWith('libsql://')) {
  console.error('ERROR: DATABASE_URI must be a libsql:// Turso URL')
  process.exit(1)
}
if (!authToken) {
  console.error('ERROR: DATABASE_AUTH_TOKEN is required')
  process.exit(1)
}

const local = createClient({ url: localUri })
const turso = createClient({ url: remoteUri, authToken })

console.log(`Reading schema from: ${localDbPath}`)
console.log(`Applying to: ${remoteUri}\n`)

// Get all tables and indexes from local DB
const [tables, indexes] = await Promise.all([
  local.execute(`SELECT name, sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY name`),
  local.execute(`SELECT name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL ORDER BY name`),
])

let ok = 0
let skip = 0

for (const row of tables.rows) {
  try {
    await turso.execute(row.sql)
    console.log(`✓ Table: ${row.name}`)
    ok++
  } catch (e) {
    if (e.message?.includes('already exists')) {
      console.log(`- Skip (exists): ${row.name}`)
      skip++
    } else {
      console.error(`✗ Table ${row.name}: ${e.message}`)
    }
  }
}

for (const row of indexes.rows) {
  try {
    await turso.execute(row.sql)
    console.log(`✓ Index: ${row.name}`)
    ok++
  } catch (e) {
    if (e.message?.includes('already exists')) {
      skip++
    } else {
      console.error(`✗ Index ${row.name}: ${e.message}`)
    }
  }
}

console.log(`\nDone — ${ok} created, ${skip} already existed.`)
local.close()
turso.close()
