// Regenerate public/sitemap.xml from the current route list + character ids.
// Run with: npm run sitemap
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { CHARACTERS } from '../src/data/characters.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Replace with the real production domain before deploying — kept in sync
// with the canonical/og:url placeholders in index.html.
const SITE_URL = 'https://olympus.example.com'

const today = new Date().toISOString().slice(0, 10)

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/pantheon', priority: '0.9', changefreq: 'weekly' },
  { path: '/family-tree', priority: '0.8', changefreq: 'monthly' },
  { path: '/map', priority: '0.7', changefreq: 'monthly' },
  { path: '/constellations', priority: '0.7', changefreq: 'monthly' },
  { path: '/vault', priority: '0.7', changefreq: 'monthly' },
  { path: '/katabasis', priority: '0.6', changefreq: 'monthly' },
]

const characterRoutes = CHARACTERS.map((c) => ({
  path: `/shrine/${c.id}`,
  priority: '0.6',
  changefreq: 'monthly',
}))

const urls = [...staticRoutes, ...characterRoutes]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const outPath = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(outPath, xml)
console.log(`Wrote ${urls.length} URLs to ${outPath}`)
