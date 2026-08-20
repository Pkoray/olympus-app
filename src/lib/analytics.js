// Privacy-friendly, provider-agnostic analytics. Works with any
// cookie-less script that exposes the same shape as Umami or Plausible —
// point the three VITE_ANALYTICS_* env vars at your own instance (self-hosted
// Umami, Plausible Cloud, etc). Left unset, this is a complete no-op: no
// script is injected, so builds/dev/tests never depend on having an account.
//
// Both providers' scripts auto-track exactly one pageview when they first
// load (like a classic MPA hit). Since this is a client-routed SPA, every
// navigation *after* that first one has to be reported manually — see
// AnalyticsTracker in App.jsx, which skips the initial location and calls
// trackPageview() on every route change past it.
const PROVIDER = import.meta.env.VITE_ANALYTICS_PROVIDER // 'umami' | 'plausible'
const SCRIPT_URL = import.meta.env.VITE_ANALYTICS_SCRIPT_URL
const SITE_ID = import.meta.env.VITE_ANALYTICS_SITE_ID

const configured = Boolean(PROVIDER && SCRIPT_URL && SITE_ID)
let injected = false

export function initAnalytics() {
  if (!configured || injected) return
  injected = true
  const script = document.createElement('script')
  script.defer = true
  script.src = SCRIPT_URL
  if (PROVIDER === 'umami') script.setAttribute('data-website-id', SITE_ID)
  else if (PROVIDER === 'plausible') script.setAttribute('data-domain', SITE_ID)
  document.head.appendChild(script)
}

export function trackPageview(pathname) {
  if (!configured) return
  if (PROVIDER === 'umami') {
    window.umami?.track?.((props) => ({ ...props, url: pathname }))
  } else if (PROVIDER === 'plausible') {
    window.plausible?.('pageview', { u: window.location.origin + pathname })
  }
}
