import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, RotateCcw } from 'lucide-react'
import { CONSTELLATIONS, catmullRomPath } from './constellationData'
import useStarfieldCanvas from './useStarfieldCanvas'
import { useTheme } from '../../context/ThemeContext'
import { useLang } from '../../context/LangContext'
import { useAmbientAudio } from '../../context/AudioContext'
import useHaptics from '../../hooks/useHaptics'

const VIEW_W = 2000
const VIEW_H = 640
const ACTIVATE_RADIUS = 30

export default function ConstellationSky() {
  const { isDark } = useTheme()
  const { lang, t } = useLang()
  const { playSfx } = useAmbientAudio()
  const haptics = useHaptics()
  const canvasRef = useStarfieldCanvas(isDark)
  const svgRef = useRef(null)

  const [activated, setActivated] = useState(() => new Set())
  const [completed, setCompleted] = useState(() => new Set())
  const [openMythId, setOpenMythId] = useState(null)

  // Mirrors of the state above, mutated synchronously. Reading/writing state
  // directly here would be unsafe: React may batch several activations from
  // one fast drag into a single render pass, and a setState updater's body
  // isn't guaranteed to run before this function returns — so the "did this
  // just complete the constellation?" check must not depend on that timing.
  const activatedRef = useRef(new Set())
  const completedRef = useRef(new Set())

  const starIndex = useMemo(() => {
    const map = new Map()
    CONSTELLATIONS.forEach((c) => c.stars.forEach((s) => map.set(`${c.id}:${s.id}`, { ...s, constellationId: c.id })))
    return map
  }, [])

  const activateNear = useCallback(
    (svgX, svgY) => {
      let changed = false
      let newlyCompleted = null
      starIndex.forEach((star, key) => {
        if (activatedRef.current.has(key)) return
        const d = Math.hypot(star.x - svgX, star.y - svgY)
        if (d <= ACTIVATE_RADIUS) {
          activatedRef.current.add(key)
          changed = true
          const constellation = CONSTELLATIONS.find((c) => c.id === star.constellationId)
          const allOn = constellation.stars.every((s) => activatedRef.current.has(`${constellation.id}:${s.id}`))
          if (allOn && !completedRef.current.has(constellation.id)) {
            completedRef.current.add(constellation.id)
            newlyCompleted = constellation.id
          }
        }
      })
      if (!changed) return
      setActivated(new Set(activatedRef.current))
      if (newlyCompleted) {
        setCompleted(new Set(completedRef.current))
        setOpenMythId(newlyCompleted)
        playSfx('starChime')
        haptics.takeover()
      }
    },
    [starIndex, playSfx, haptics],
  )

  const handlePointerMove = useCallback(
    (e) => {
      const svg = svgRef.current
      if (!svg) return
      const ctm = svg.getScreenCTM()
      if (!ctm) return
      const inverse = ctm.inverse()
      const pt = svg.createSVGPoint()
      pt.x = e.clientX
      pt.y = e.clientY
      const loc = pt.matrixTransform(inverse)
      activateNear(loc.x, loc.y)
    },
    [activateNear],
  )

  const reset = () => {
    activatedRef.current = new Set()
    completedRef.current = new Set()
    setActivated(new Set())
    setCompleted(new Set())
    setOpenMythId(null)
  }

  const openMyth = CONSTELLATIONS.find((c) => c.id === openMythId)
  const lineColor = isDark ? '#f3e2ae' : '#7a5230'
  const guideColor = isDark ? 'rgba(243,226,174,0.1)' : 'rgba(122,82,48,0.18)'

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

      <div className="relative flex items-center justify-between gap-4 px-5 sm:px-8">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-current/40">
          {CONSTELLATIONS.reduce((n, c) => n + (completed.has(c.id) ? 1 : 0), 0)} / {CONSTELLATIONS.length}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/25 px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest text-current/60 transition-colors hover:border-gold-300/60 hover:text-gold-400"
        >
          <RotateCcw size={12} />
          {t('constellations.reset')}
        </button>
      </div>

      <div className="relative mt-4 overflow-x-auto overflow-y-hidden px-2 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width={VIEW_W}
          height={VIEW_H}
          className="block max-w-none touch-none select-none"
          onPointerMove={handlePointerMove}
        >
          <defs>
            <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {CONSTELLATIONS.map((c) => {
            const isComplete = completed.has(c.id)
            const orderedPoints = c.stars
            const minX = Math.min(...c.stars.map((s) => s.x))
            const maxX = Math.max(...c.stars.map((s) => s.x))
            const labelX = (minX + maxX) / 2
            const labelY = Math.min(...c.stars.map((s) => s.y)) - 24
            return (
              <g key={c.id}>
                {isComplete && (
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isDark ? 0.22 : 0.28 }}
                    transition={{ duration: 1.2 }}
                    d={catmullRomPath(orderedPoints)}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#star-glow)"
                  />
                )}

                {c.edges.map(([a, b], i) => {
                  const sa = c.stars.find((s) => s.id === a)
                  const sb = c.stars.find((s) => s.id === b)
                  const on = activated.has(`${c.id}:${a}`) && activated.has(`${c.id}:${b}`)
                  return (
                    <line
                      key={i}
                      x1={sa.x}
                      y1={sa.y}
                      x2={sb.x}
                      y2={sb.y}
                      stroke={on ? lineColor : guideColor}
                      strokeWidth={on ? 2 : 1}
                      filter={on ? 'url(#star-glow)' : undefined}
                      style={{ transition: 'stroke 0.4s ease' }}
                    />
                  )
                })}

                {c.stars.map((s) => {
                  const on = activated.has(`${c.id}:${s.id}`)
                  return (
                    <circle
                      key={s.id}
                      cx={s.x}
                      cy={s.y}
                      r={on ? 5 : 3}
                      fill={on ? lineColor : isDark ? 'rgba(243,226,174,0.7)' : 'rgba(122,82,48,0.55)'}
                      filter={on ? 'url(#star-glow)' : undefined}
                      style={{ transition: 'r 0.3s ease, fill 0.3s ease' }}
                    />
                  )
                })}

                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fontSize={20}
                  className="pointer-events-none select-none font-serif"
                  fill={isComplete ? lineColor : isDark ? 'rgba(243,226,174,0.35)' : 'rgba(122,82,48,0.45)'}
                >
                  {lang === 'tr' ? c.nameTr : c.nameEn}
                </text>
                <text
                  x={labelX}
                  y={labelY + 20}
                  textAnchor="middle"
                  fontSize={11}
                  letterSpacing={2}
                  className="pointer-events-none select-none font-sans uppercase"
                  fill={isDark ? 'rgba(243,226,174,0.3)' : 'rgba(122,82,48,0.4)'}
                >
                  {c.stars.filter((s) => activated.has(`${c.id}:${s.id}`)).length}/{c.stars.length} {t('constellations.progress')}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <AnimatePresence>
        {openMyth && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMythId(null)}
              className="fixed inset-0 z-40 bg-abyss-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl p-7 sm:p-9"
            >
              <button
                onClick={() => setOpenMythId(null)}
                className="absolute right-5 top-5 rounded-full border border-gold-300/25 p-1.5 text-current/60 transition-colors hover:border-gold-300 hover:text-gold-400"
              >
                <X size={15} />
              </button>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-500 dark:text-gold-300/70">
                {t('constellations.complete')}
              </p>
              <h3 className="mt-2 font-serif text-3xl text-abyss-900 dark:text-marble-100">
                {lang === 'tr' ? openMyth.nameTr : openMyth.nameEn}
              </h3>
              <p className="mt-1 font-serif italic text-gold-500/80 dark:text-gold-300/70">
                {lang === 'tr' ? openMyth.epithetTr : openMyth.epithetEn}
              </p>
              <p className="mt-5 font-sans text-sm leading-relaxed text-current/70">
                {lang === 'tr' ? openMyth.mythTr : openMyth.mythEn}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
