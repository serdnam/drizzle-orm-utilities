import { copyFileSync, readdirSync } from 'node:fs'

for (const file of readdirSync('dist')) {
  if (file.endsWith('.d.ts') && !file.endsWith('.d.ts.map')) {
    copyFileSync(`dist/${file}`, `dist/${file.replace(/\.d\.ts$/, '.d.cts')}`)
  }
}
