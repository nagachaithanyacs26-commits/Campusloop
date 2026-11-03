import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const windows = process.platform === 'win32'
const tasks = []

function start(label, args, cwd) {
  console.log(`[dev] Starting ${label}...`)
  const child = spawn('npm', args, { cwd, stdio: 'inherit', shell: windows, env: process.env })
  child.on('error', (error) => console.error(`[dev] Could not start ${label}:`, error.message))
  child.on('exit', (code) => {
    if (code && code !== 0) console.error(`[dev] ${label} stopped with exit code ${code}.`)
  })
  tasks.push(child)
}

start('frontend', ['run', 'dev'], resolve(root, 'frontend'))

if (existsSync(resolve(root, 'backend', '.env'))) {
  start('backend', ['run', 'dev'], resolve(root, 'backend'))
} else {
  console.warn('[dev] Backend was not started because backend/.env is missing. Copy backend/.env.example to backend/.env and add your private service credentials.')
}

function stopAll() {
  for (const child of tasks) {
    if (!child.killed) child.kill('SIGTERM')
  }
}

process.on('SIGINT', stopAll)
process.on('SIGTERM', stopAll)
