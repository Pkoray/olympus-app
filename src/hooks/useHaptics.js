import { useCallback, useMemo } from 'react'

/**
 * Thin wrapper around `navigator.vibrate` with graceful degradation on
 * browsers/devices that don't support it (desktop, iOS Safari, etc).
 * Pattern presets map to the interactions defined in the design spec.
 */
export default function useHaptics() {
  const supported = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

  const vibrate = useCallback(
    (pattern) => {
      if (!supported) return
      try {
        navigator.vibrate(pattern)
      } catch {
        /* noop */
      }
    },
    [supported],
  )

  return useMemo(
    () => ({
      supported,
      vibrate,
      /** Carousel item snap / scroll tick — ultra-light tactile tick. */
      tick: () => vibrate(8),
      /** Node-tree connection tap — crisp single confirmation tap. */
      confirm: () => vibrate(15),
      /** Theme / language toggle — soft tactile click. */
      toggle: () => vibrate(10),
      /** Entity immersive takeover open — dual-pulse heartbeat. */
      takeover: () => vibrate([20, 40, 30]),
    }),
    [supported, vibrate],
  )
}
