// Minimal offline-support service worker for the Olympus PWA shell.
// Runtime-caches core UI assets (HTML shell, JS/CSS bundles, fonts, SVGs) as
// they're requested — no build-time asset manifest needed, so this keeps
// working across Vite's hashed filenames without a bundler plugin.

const CACHE_NAME = 'olympus-cache-v1'
const CORE_ASSETS = ['/', '/manifest.webmanifest', '/icon.svg', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Navigations: network-first, falling back to the cached shell offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy))
          return res
        })
        .catch(() => caches.match('/').then((res) => res || caches.match(request)))
    )
    return
  }

  // Static assets (scripts, styles, fonts, images/SVGs): stale-while-revalidate.
  if (['style', 'script', 'font', 'image'].includes(request.destination)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => {
              if (res.ok) cache.put(request, res.clone())
              return res
            })
            .catch(() => cached)
          return cached || network
        })
      )
    )
  }
})
