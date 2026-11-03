import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packages = [
  { folder: 'frontend', checks: ['vite', 'react'] },
  { folder: 'backend', checks: ['express', 'mongoose', 'nodemon'] },
]

for (const item of packages) {
  const packageRoot = resolve(root, item.folder)
  const missing = item.checks.some((name) => !existsSync(resolve(packageRoot, 'node_modules', name, 'package.json')))
  if (!missing) {
    console.log(`[setup] ${item.folder} dependencies are ready.`)
    continue
  }

  console.log(`[setup] Installing ${item.folder} dependencies from package-lock.json...`)
  const result = spawnSync('npm', ['ci', '--no-audit', '--no-fund'], {
    cwd: packageRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
}
