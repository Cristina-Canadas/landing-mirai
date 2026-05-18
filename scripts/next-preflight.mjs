import crypto from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'

const args = process.argv.slice(2)
const separatorIndex = args.indexOf('--')
const preflightArgs = separatorIndex === -1 ? args : args.slice(0, separatorIndex)
const commandArgs = separatorIndex === -1 ? [] : args.slice(separatorIndex + 1)

const portArgIndex = preflightArgs.indexOf('--port')
const port = Number(portArgIndex === -1 ? 3000 : preflightArgs[portArgIndex + 1])

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error(`[next-preflight] Invalid port: ${String(port)}`)
  process.exit(1)
}

const workspace = fs.realpathSync(process.cwd())
const lockId = crypto.createHash('sha1').update(workspace).digest('hex').slice(0, 16)
const lockFile = path.join(os.tmpdir(), `mirai-next-dev-${lockId}.json`)

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
    return JSON.parse(fs.readFileSync(lockFile, 'utf8'))
  } catch {
    return null
  }
}

function removeLockFor(pid) {
  const lock = readLock()
  if (lock?.pid === pid) {
    fs.rmSync(lockFile, { force: true })
  }
}

function checkProjectLock() {
  const lock = readLock()
  if (!lock) return

  if (!isPidAlive(lock.pid)) {
    fs.rmSync(lockFile, { force: true })
    return
  }

  console.error(
    [
      `[next-preflight] This project already has a dev server process running.`,
      `  Workspace: ${workspace}`,
      `  PID: ${lock.pid}`,
      `  Started: ${lock.startedAt ?? 'unknown'}`,
      ``,
      `Close that server before starting another one. This prevents .next manifests from being`,
      `deleted or rewritten while Next.js is still using them.`,
    ].join('\n'),
  )
  process.exit(1)
}

function checkPortAvailable(portNumber) {
  return new Promise((resolve) => {
    const server = net.createServer()

    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE' || error.code === 'EACCES') {
        resolve(false)
        return
      }

      console.error(`[next-preflight] Could not check port ${portNumber}: ${error.message}`)
      process.exit(1)
    })

    server.once('listening', () => {
      server.close(() => resolve(true))
    })

    server.listen(portNumber)
  })
}

checkProjectLock()

const isPortAvailable = await checkPortAvailable(port)
if (!isPortAvailable) {
  console.error(
    [
      `[next-preflight] Port ${port} is already in use.`,
      ``,
      `Next.js will not be started on a fallback port because multiple local dev servers`,
      `are the most likely cause of corrupted or incomplete .next manifests in this project.`,
      ``,
      `Close the process using port ${port}, then run npm run dev again.`,
    ].join('\n'),
  )
  process.exit(1)
}

const commandName = commandArgs[0] ?? 'next'
const childArgs = commandArgs.length > 0 ? commandArgs.slice(1) : ['dev', '--port', String(port)]
const isNextCommand = commandName === 'next'
const command = isNextCommand ? process.execPath : commandName
const resolvedChildArgs = isNextCommand
  ? [path.join(workspace, 'node_modules', 'next', 'dist', 'bin', 'next'), ...childArgs]
  : childArgs
const child = spawn(command, resolvedChildArgs, {
  cwd: workspace,
  env: {
    ...process.env,
    PORT: String(port),
  },
  shell: false,
  stdio: 'inherit',
})

fs.writeFileSync(
  lockFile,
  JSON.stringify(
    {
      command: [command, ...childArgs].join(' '),
      pid: child.pid,
      port,
      startedAt: new Date().toISOString(),
      workspace,
    },
    null,
    2,
  ),
)

const forwardSignal = (signal) => {
  if (child.exitCode === null) child.kill(signal)
}

process.once('SIGINT', () => forwardSignal('SIGINT'))
process.once('SIGTERM', () => forwardSignal('SIGTERM'))

child.on('exit', (code, signal) => {
  removeLockFor(child.pid)

  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})

child.on('error', (error) => {
  removeLockFor(child.pid)
  console.error(`[next-preflight] Failed to start Next.js: ${error.message}`)
  process.exit(1)
})
