# Olympus — An Eternal Chronicle

An interactive chronicle of the Greek pantheon: 64 gods, titans, heroes and monsters, a living family tree, an illustrated map of the ancient world, a night sky of constellations, a vault of sacred relics, and a scroll-driven descent into the Underworld. Bilingual (English/Turkish), with per-character etymology (polytonic Greek + Proto-Indo-European roots), procedural spatial audio, and a Cmd+K command palette to search across everything.

## Stack

React 19 + Vite, Tailwind CSS v4, Framer Motion, React Router, `@xyflow/react` (family tree), Vitest + React Testing Library.

## Development

```bash
npm install
npm run dev          # start the dev server
npm run build         # production build
npm run preview       # serve the production build locally
npm test               # run the test suite
npm run lint            # oxlint
npm run optimize-images # regenerate .webp alongside statue/relic source images
npm run sitemap          # regenerate public/sitemap.xml
```

## Analytics (optional)

Copy `.env.example` to `.env` and fill in `VITE_ANALYTICS_*` to enable privacy-friendly pageview tracking (Umami or Plausible). Left unset, no tracking script is ever loaded.
