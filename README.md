# Olympus — An Eternal Chronicle

An interactive chronicle of the Greek pantheon — 64 gods, titans, heroes and monsters, each with their own shrine page, rendered portrait, and epic. Bilingual (English/Turkish) throughout, with a living family tree, an illustrated map of the ancient world, a night sky of constellations to trace, a vault of sacred relics to inspect in 3D, and a scroll-driven descent into the Underworld.

## Features

- **Pantheon & shrine pages** — every character with a bio, domain, symbol, and a multi-part epic narrative in both languages
- **Etymology** — polytonic Ancient Greek spelling and Proto-Indo-European root breakdown for all 64 names, with an interactive per-morpheme tooltip and (Modern Greek TTS) pronunciation
- **Family tree** — a pannable, zoomable relationship graph (`@xyflow/react`) from Chaos down to the heroes
- **The Map** — regions of the ancient world (Olympus, the Underworld, Troy, Crete, and more), each linked to its gods
- **Constellations** — trace the stars of five constellations to unlock their myths
- **Relics Vault** — drag-to-rotate 3D inspection of eight sacred artifacts (Zeus's master bolt, Ariadne's thread, and others), each with lore and provenance
- **Katabasis** — a scroll-linked cinematic descent through the four regions of the Underworld
- **Command palette** (⌘K) — instant search across every character, relic, and location
- **Procedural spatial audio** — every character theme and UI micro-SFX is synthesized live via the Web Audio API, panned to cursor position; no bundled audio files
- **Bilingual** — every string, name, and epithet in English and Turkish, switchable at runtime
- **Light/dark theme**, installable as a PWA, and SEO-ready (sitemap, OG/Twitter cards, structured metadata)

## Tech stack

React 19 · Vite · Tailwind CSS v4 · Framer Motion · React Router · `@xyflow/react` · Vitest + React Testing Library · oxlint

## Getting started

```bash
npm install
npm run dev       # start the dev server
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Vitest test suite |
| `npm run lint` | Run oxlint |
| `npm run optimize-images` | Regenerate `.webp` alongside every statue/relic source image |
| `npm run sitemap` | Regenerate `public/sitemap.xml` |

## Testing

Vitest + React Testing Library cover routing, the language/context layer, the search index, and the carousel's progressive-rendering behavior (a perf fix that defers off-screen cards to idle time rather than mounting all of them at once). Run with `npm test`.

## Analytics (optional)

Copy `.env.example` to `.env` and fill in `VITE_ANALYTICS_*` to enable privacy-friendly, cookie-less pageview tracking via Umami or Plausible (self-hosted or cloud). Left unset, no tracking script is ever loaded — dev, build, and tests all work with zero configuration.

## Project structure

```
src/
  pages/           route-level page components
  modules/         feature modules (search, vault, etymology, katabasis, constellations)
  components/      shared UI (layout, cards, frames)
  context/         theme, language, and audio providers
  data/            character, translation, and region data
  assets/          statue and relic portraits (source .jpg + optimized .webp)
```
