import { useEffect, useRef, useState } from 'react'

const LERP_DEFAULT = 0.18
const RING_SIZE = { default: 34, glow: 56 }
const PARTICLE_LIFE_MS = 400
const MAX_PARTICLES = 60

/**
 * Imperative rAF-driven engine behind <MagneticCursor>. Position updates
 * bypass React state entirely (refs + direct style.transform writes) so the
 * 60fps loop never triggers a re-render or touches layout — only transform
 * and canvas draws, both compositor-only operations.
 *
 * Interactive targets opt in via `data-cursor="glow"` (statue/entity-takeover
 * cards — ring expands and pulses gold). Detected via a single delegated
 * pointerover/pointerout listener so it keeps working across route changes
 * with zero extra wiring.
 */
export default function useMagneticCursor() {
  const [enabled, setEnabled] = useState(false)
  const [cursorState, setCursorState] = useState('default')

  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const canvasRef = useRef(null)

  const pointer = useRef({ x: -100, y: -100 })
  const lastPointer = useRef({ x: -100, y: -100 })
  const follower = useRef({ x: -100, y: -100 })
  const activeEl = useRef(null)
  const cursorStateRef = useRef('default')
  const particles = useRef([])
  const lastSpawn = useRef(0)
  const rafId = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setEnabled(mq.matches)
    const onChange = (e) => setEnabled(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    cursorStateRef.current = cursorState
    if (ringRef.current) {
      const size = RING_SIZE[cursorState] ?? RING_SIZE.default
      ringRef.current.style.width = `${size}px`
      ringRef.current.style.height = `${size}px`
    }
  }, [cursorState])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('cursor-ready')

    const onMove = (e) => {
      pointer.current.x = e.clientX
      pointer.current.y = e.clientY
    }
    const onOver = (e) => {
      const el = e.target.closest?.('[data-cursor]')
      if (el) {
        activeEl.current = el
        setCursorState(el.dataset.cursor)
      }
    }
    const onOut = (e) => {
      const el = e.target.closest?.('[data-cursor]')
      if (el && (!e.relatedTarget || !el.contains(e.relatedTarget))) {
        activeEl.current = null
        setCursorState('default')
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const resize = () => {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = (t) => {
      const tx = pointer.current.x
      const ty = pointer.current.y
      follower.current.x += (tx - follower.current.x) * LERP_DEFAULT
      follower.current.y += (ty - follower.current.y) * LERP_DEFAULT

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${pointer.current.x}px, ${pointer.current.y}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${follower.current.x}px, ${follower.current.y}px, 0) translate(-50%, -50%)`
      }

      const dx = pointer.current.x - lastPointer.current.x
      const dy = pointer.current.y - lastPointer.current.y
      if (Math.hypot(dx, dy) > 6 && t - lastSpawn.current > 28 && particles.current.length < MAX_PARTICLES) {
        particles.current.push({ x: pointer.current.x, y: pointer.current.y, born: t })
        lastSpawn.current = t
      }
      lastPointer.current.x = pointer.current.x
      lastPointer.current.y = pointer.current.y

      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const isDark = document.documentElement.classList.contains('dark')
        const rgb = isDark ? '212,175,55' : '156,107,62'
        particles.current = particles.current.filter((p) => t - p.born < PARTICLE_LIFE_MS)
        particles.current.forEach((p) => {
          const age = (t - p.born) / PARTICLE_LIFE_MS
          const alpha = 1 - age
          const size = 2.6 * (1 - age * 0.6)
          ctx.beginPath()
          ctx.fillStyle = `rgba(${rgb},${(alpha * 0.5).toFixed(3)})`
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('cursor-ready')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      window.removeEventListener('resize', resize)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [enabled])

  return { enabled, cursorState, dotRef, ringRef, canvasRef }
}
