import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const spritePath = path.join(
  root,
  'src/features/envelope/assets/sprite_digits.svg',
)
const outDir = path.join(root, 'src/features/envelope/assets/digits')

const s = fs.readFileSync(spritePath, 'utf8')
const ids = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const head =
  '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="7080" height="10241" fill-rule="evenodd" clip-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" viewBox="0 0 7080 10241"><defs><style>.fil0{fill:#fff;fill-rule:nonzero}</style></defs><g>'
const tail = '</g></svg>'

for (const id of ids) {
  const re = new RegExp(
    `<path id="digit-${id}" d="([^"]+)" class="fil0"/>`,
  )
  const m = s.match(re)
  if (!m) {
    console.error('missing digit', id)
    process.exit(1)
  }
  const body = `<path id="digit-${id}" d="${m[1]}" class="fil0"/>`
  fs.writeFileSync(path.join(outDir, `digit-${id}.svg`), head + body + tail)
}
console.log('wrote', ids.length, 'files to', outDir)
