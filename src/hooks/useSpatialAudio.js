import { useEffect, useRef } from 'react'
import { useAmbientAudio } from '../context/AudioContext'

const THROTTLE_MS = 45

/**
 * Drives the global StereoPannerNode from the cursor's X position on desktop
 * (pointer: fine) or device tilt on mobile (deviceorientation `gamma`).
 * Event-driven rather than a rAF loop — `setPan`'s own ramp time provides the
 * smoothing, so this never touches layout and costs nothing when idle.
 * Mount once, near the app root, inside <AudioProvider>.
 */
export default function useSpatialAudio() {
  const { setPan } = useAmbientAudio()
  const lastUpdate = useRef(0)
  const orientationArmed = useRef(false)

  useEffect(() => {
    const update = (value) => {
      const now = performance.now()
      if (now - lastUpdate.current < THROTTLE_MS) return
      lastUpdate.current = now
      setPan(value, 0.18)
    }

    const onPointerMove = (e) => {
      if (!window.matchMedia?.('(pointer: fine)').matches) return
      update((e.clientX / window.innerWidth) * 2 - 1)
    }

    const onOrientation = (e) => {
      if (e.gamma == null) return
      update(Math.max(-1, Math.min(1, e.gamma / 45)))
    }

    const armOrientation = () => {
      if (orientationArmed.current) return
      orientationArmed.current = true
      const DOE = window.DeviceOrientationEvent
      if (DOE && typeof DOE.requestPermission === 'function') {
        DOE.requestPermission()
          .then((state) => {
            if (state === 'granted') window.addEventListener('deviceorientation', onOrientation, { passive: true })
          })
          .catch(() => {})
      } else if (DOE) {
        window.addEventListener('deviceorientation', onOrientation, { passive: true })
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('touchstart', armOrientation, { once: true, passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchstart', armOrientation)
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [setPan])

  return null
}
