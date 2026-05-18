import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const workspace = fsSync.realpathSync(process.cwd())
const target = path.resolve(workspace, '.next')
const lockId = crypto.createHash('sha1').update(workspace).digest('hex').slice(0, 16)
const lockFile = path.join(os.tmpdir(), `mirai-next-dev-${lockId}.json`)
const retryableCodes = new Set(['EBUSY', 'ENOTEMPTY', 'EPERM'])

function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false

  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function readLock() {
  try {
    return JSON.parse(fsSync.readFileSync(lockFile, 'utf8'))
  } catch {
    return null
  }
}

function assertSafeTarget() {
  const relativeTarget = path.relative(workspace, target)
  const isInsideWorkspace = relativeTarget && !relativeTarget.startsWith('..') && !path.isAbsolute(relativeTarget)

  if (!isInsideWorkspace || path.basename(target) !== '.next') {
    console.error(`[clean:next] Refusing to delete unsafe path: ${target}`)
    process.exit(1)
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

assertSafeTarget()

const lock = readLock()
if (lock && isPidAlive(lock.pid)) {
  console.error(
    [
      `[clean:next] A dev server for this project appears to be running.`,
      `  Workspace: ${workspace}`,
      `  PID: ${lock.pid}`,
      `  Port: ${lock.port ?? 'unknown'}`,
      ``,
      `Stop the dev server before cleaning .next. This avoids deleting manifests while`,
      `Next.js is still reading or writing them.`,
    ].join('\n'),
  )
  process.exit(1)
}

if (!fsSync.existsSync(target)) {
  console.log('[clean:next] .next does not exist. Nothing to clean.')
  process.exit(0)
}

let lastError

for (let attempt = 1; attempt <= 6; attempt += 1) {
  try {
    await fs.rm(target, { recursive: true, force: true })

    if (!fsSync.existsSync(target)) {
      console.log('[clean:next] Removed .next successfully.')
      process.exit(0)
    }
  } catch (error) {
    lastError = error

    if (!retryableCodes.has(error.code)) {
      break
    }
  }

  await wait(250 * attempt)
}

console.error(
  [
    `[clean:next] Could not remove .next safely.`,
    `  Path: ${target}`,
    `  Reason: ${lastError?.code ?? 'UNKNOWN'} ${lastError?.message ?? ''}`.trimEnd(),
    ``,
    `Close any running Next.js dev servers, terminals, editors previewing the app,`,
    `or antivirus scans touching .next, then run npm run clean:next again.`,
  ].join('\n'),
)
process.exit(1)
