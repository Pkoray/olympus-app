// Generates a .webp alongside every statue/relic .jpg (originals kept as
// fallback). Re-run with: npm run optimize-images
import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname, basename } from 'node:path'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIRS = ['../src/assets/statues', '../src/assets/relics'].map((d) => join(__dirname, d))
const MAX_WIDTH = 800

let converted = 0
let savedBytes = 0

for (const dir of DIRS) {
  const files = readdirSync(dir).filter((f) => ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()))
  for (const file of files) {
    const src = join(dir, file)
    const dest = join(dir, `${basename(file, extname(file))}.webp`)
    const before = statSync(src).size
    await sharp(src).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest)
    const after = statSync(dest).size
    savedBytes += before - after
    converted++
  }
}

console.log(`Converted ${converted} images. JPG→WebP saved ${(savedBytes / 1024).toFixed(0)} KB (vs originals).`)
