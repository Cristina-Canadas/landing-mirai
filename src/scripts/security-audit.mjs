import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
}

const currentFile = fileURLToPath(import.meta.url)
const scriptsDir = path.dirname(currentFile)
const rootDir = path.resolve(scriptsDir, '../..')
const issues = []

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8')
}

function addIssue(severity, title, details, file) {
  issues.push({ severity, title, details, file })
}

function findParentLockfiles(startDir) {
  const matches = []
  let currentDir = path.resolve(startDir, '..')

  while (true) {
    const candidate = path.join(currentDir, 'package-lock.json')
    if (fs.existsSync(candidate)) {
      matches.push(candidate)
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) {
      break
    }

    currentDir = parentDir
  }

  return matches
}

function runAudit() {
  const packageJson = JSON.parse(readText('package.json'))
  const middlewareSource = readText('src/middleware.ts')
  const payloadConfigSource = readText('src/payload.config.ts')
  const visitsMetricsSource = readText('src/lib/visits-metrics.ts')
  const nextConfigSource = readText('next.config.ts')
  const localLockfile = path.join(rootDir, 'package-lock.json')
  const parentLockfiles = findParentLockfiles(rootDir).filter((file) => file !== localLockfile)
  const payloadSecret = process.env.PAYLOAD_SECRET

  if (packageJson.scripts?.['security:audit'] !== 'node src/scripts/security-audit.mjs') {
    addIssue('medium', 'Unexpected security:audit command', 'The package script no longer points to the local audit runner.', 'package.json')
  }

  for (const headerName of Object.keys(SECURITY_HEADERS)) {
    if (!middlewareSource.includes(headerName)) {
      addIssue('high', 'Missing security header', `The middleware does not appear to set ${headerName}.`, 'src/middleware.ts')
    }
  }

  if (!nextConfigSource.includes('turbopack')) {
    addIssue('medium', 'Turbopack root not configured', 'Next.js may resolve the wrong project root when parent folders also contain lockfiles.', 'next.config.ts')
  }

  if (parentLockfiles.length > 0) {
    addIssue(
      'medium',
      'Parent lockfile detected',
      `Found additional lockfiles above the project root: ${parentLockfiles.join(', ')}`,
      'package-lock.json',
    )
  }

  if (!payloadSecret) {
    addIssue('high', 'Missing PAYLOAD_SECRET', 'Payload will fall back to the development secret outside production.', 'src/payload.config.ts')
  } else if (payloadSecret === 'mirai-suite-dev-secret-change-in-production') {
    const severity = process.env.NODE_ENV === 'production' ? 'critical' : 'medium'
    addIssue(severity, 'Default PAYLOAD_SECRET in use', 'Replace the default secret before sharing the environment or deploying it.', 'src/payload.config.ts')
  }

  if (process.env.NODE_ENV === 'production' && String(process.env.DATABASE_URI || '').startsWith('file:')) {
    addIssue('high', 'SQLite configured in production', 'Production should use PostgreSQL or another managed database instead of a file-based SQLite URL.', 'src/payload.config.ts')
  }

  if (!payloadConfigSource.includes("throw new Error('PAYLOAD_SECRET must be defined in production.')")) {
    addIssue('medium', 'Production secret guard missing', 'Payload should fail fast when PAYLOAD_SECRET is not configured in production.', 'src/payload.config.ts')
  }

  if (!visitsMetricsSource.includes('ENABLE_VISITS_TRACKING')) {
    addIssue('medium', 'Visits tracking flag missing', 'Tracking stays on for every local request instead of being configurable per environment.', 'src/lib/visits-metrics.ts')
  }
}

function printReport() {
  const severityOrder = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  }

  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  const totals = issues.reduce(
    (acc, issue) => {
      acc[issue.severity] += 1
      return acc
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  )

  console.log('Mirai Suite security audit')
  console.log(`Root: ${rootDir}`)
  console.log(
    `Summary -> critical: ${totals.critical}, high: ${totals.high}, medium: ${totals.medium}, low: ${totals.low}`,
  )

  if (issues.length === 0) {
    console.log('No issues detected.')
    return
  }

  for (const issue of issues) {
    const fileLabel = issue.file ? ` [${issue.file}]` : ''
    console.log(`- ${issue.severity.toUpperCase()}: ${issue.title}${fileLabel}`)
    console.log(`  ${issue.details}`)
  }
}

runAudit()
printReport()

const hasBlockingIssue = issues.some((issue) => issue.severity === 'critical')
process.exit(hasBlockingIssue ? 1 : 0)
