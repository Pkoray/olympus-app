import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { RELIC_ART, RELIC_IMAGES } from './RelicArt'

const RUNES = ['Α', 'Ω', 'Σ', 'Δ', 'Θ', 'Ξ', 'Φ', 'Ψ']
const IDLE_SPEED = 0.12 // degrees per frame while un-touched

/**
 * A CSS-3D "vault piece" — no WebGL/Three.js dependency, no external
 * models: a hand-drawn SVG relic mounted inside a `perspective` wrapper,
 * rotated on drag via motion values (transform-only, so this never
 * triggers a React re-render mid-gesture). A specular highlight sweeps
 * across the metal as it turns, and hovering wakes glowing rune glyphs +
 * rising embers around the rim — reusing the same particle technique
 * BronzeFrame already uses on statue hover, for visual consistency.
 */
export default function RelicViewer({ relic, active }) {
  const Art = RELIC_ART[relic.icon]
  const photo = RELIC_IMAGES[relic.id]
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef(null)
  const dragStart = useRef(null)
  const rafId = useRef(null)

  const rotateY = useMotionValue(-18)
  const rotateX = useMotionValue(8)
  const highlightXPct = useTransform(rotateY, [-45, 45], [15, 85])
  const highlightYPct = useTransform(rotateX, [-30, 30], [20, 80])
  const highlightLeft = useTransform(highlightXPct, (v) => `${v}%`)
  const highlightTop = useTransform(highlightYPct, (v) => `${v}%`)

  useEffect(() => {
    if (!active) return
    const tick = () => {
      if (!dragging) rotateY.set(rotateY.get() + IDLE_SPEED)
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [active, dragging, rotateY])

  const onPointerDown = (e) => {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, ry: rotateY.get(), rx: rotateX.get() }
    containerRef.current?.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    rotateY.set(dragStart.current.ry + dx * 0.4)
    rotateX.set(Math.max(-35, Math.min(35, dragStart.current.rx - dy * 0.3)))
  }
  const onPointerUp = () => {
    setDragging(false)
    dragStart.current = null
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={() => dragging && onPointerUp()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
      style={{ perspective: 1100 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-6 overflow-hidden rounded-2xl drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]">
          {photo ? (
            <img
              src={photo}
              alt={relic.nameEn}
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          ) : (
            <Art />
          )}
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.85), transparent 55%)',
            left: highlightLeft,
            top: highlightTop,
            width: '70%',
            height: '70%',
            marginLeft: '-35%',
            marginTop: '-35%',
          }}
        />
      </motion.div>

      {hovered && (
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 rounded-full opacity-40 blur-2xl"
            style={{ background: `radial-gradient(circle, ${relic.theme.glow}55, transparent 70%)` }}
          />
          {RUNES.map((rune, i) => {
            const angle = (i / RUNES.length) * 360
            const radius = 48
            return (
              <motion.span
                key={rune}
                className="absolute font-serif text-lg"
                style={{
                  color: relic.theme.glow,
                  left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
                  top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.9, 0.6], scale: [0.6, 1.1, 1] }}
                transition={{ duration: 1.4, delay: i * 0.05, ease: 'easeOut' }}
              >
                {rune}
              </motion.span>
            )
          })}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full"
              style={{
                left: `${15 + ((i * 11) % 70)}%`,
                top: `${65 + ((i * 13) % 25)}%`,
                background: relic.theme.glow,
              }}
              animate={{ opacity: [0, 1, 0], y: [0, -30, -46] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.16, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
