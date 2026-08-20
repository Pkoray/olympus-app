import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// RTL's auto-cleanup only self-registers when it finds a global `afterEach`
// (e.g. `test.globals: true`). We import explicitly instead, so wire it up
// by hand or DOM from one test leaks into the next.
afterEach(() => cleanup())

// This Node version ships an experimental built-in localStorage that
// shadows jsdom's and is missing methods (getItem/clear throw). Replace it
// with a plain in-memory implementation so context providers that persist
// theme/lang/mute state don't crash on mount.
class MemoryStorage {
  #store = new Map()
  getItem(key) {
    return this.#store.has(key) ? this.#store.get(key) : null
  }
  setItem(key, value) {
    this.#store.set(key, String(value))
  }
  removeItem(key) {
    this.#store.delete(key)
  }
  clear() {
    this.#store.clear()
  }
  key(index) {
    return Array.from(this.#store.keys())[index] ?? null
  }
  get length() {
    return this.#store.size
  }
}
Object.defineProperty(window, 'localStorage', { value: new MemoryStorage(), configurable: true })

// jsdom doesn't implement these — framer-motion's whileInView, the
// carousel's ResizeObserver, and the theme/cursor media queries all need
// something present or they throw/no-op unpredictably during tests.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver ??= ResizeObserverMock

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
window.IntersectionObserver ??= IntersectionObserverMock

window.matchMedia ??= (query) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})
