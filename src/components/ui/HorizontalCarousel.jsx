import { Children, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useLang } from '../../context/LangContext'
import { useAmbientAudio } from '../../context/AudioContext'
import useHaptics from '../../hooks/useHaptics'

const INITIAL_BATCH = 6
const BATCH_SIZE = 3

export default function HorizontalCarousel({ children, className = '' }) {
  const { t } = useLang()
  const { playSfx } = useAmbientAudio()
  const haptics = useHaptics()
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const scrollbarRef = useRef(null)
  const [bounds, setBounds] = useState({ viewport: 0, track: 0 })
  const x = useMotionValue(0)

  const allChildren = Children.toArray(children)
  // Mounting every card (each with its own layoutId-tracked motion component)
  // in one pass blocks the main thread for ~2s on first load. Reveal the rest
  // in idle-time batches instead — invisible to the user, but keeps the
  // initial render to roughly what's actually on screen.
  const [visibleCount, setVisibleCount] = useState(Math.min(INITIAL_BATCH, allChildren.length))
  useEffect(() => {
    if (visibleCount >= allChildren.length) return
    const schedule = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 100))
    const cancel = window.cancelIdleCallback ?? clearTimeout
    const id = schedule(() => setVisibleCount((c) => Math.min(c + BATCH_SIZE, allChildren.length)))
    return () => cancel(id)
  }, [visibleCount, allChildren.length])

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current) return
      setBounds({
        viewport: viewportRef.current.offsetWidth,
        track: trackRef.current.scrollWidth,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [children])

  const maxDrag = Math.max(bounds.track - bounds.viewport, 0)
  const thumbWidthRatio = bounds.track > 0 ? Math.min(bounds.viewport / bounds.track, 1) : 1
  const scrollbarWidth = 160
  const thumbWidth = Math.max(thumbWidthRatio * scrollbarWidth, 36)
  const thumbTravel = scrollbarWidth - thumbWidth

  const thumbX = useTransform(x, [-maxDrag, 0], [thumbTravel, 0], { clamp: true })

  const onScrollbarDrag = (_e, info) => {
    if (!scrollbarRef.current || thumbTravel <= 0) return
    const rect = scrollbarRef.current.getBoundingClientRect()
    const relX = info.point.x - rect.left - thumbWidth / 2
    const ratio = Math.min(Math.max(relX / thumbTravel, 0), 1)
    x.set(-ratio * maxDrag)
  }

  const showScrollbar = maxDrag > 4

  return (
    <div className={className}>
      <div ref={viewportRef} className="no-scrollbar overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex w-max cursor-grab gap-5 px-1 py-2 active:cursor-grabbing"
          style={{ x }}
          drag={maxDrag > 0 ? 'x' : false}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.08}
          dragTransition={{ power: 0.35, timeConstant: 220, bounceStiffness: 300, bounceDamping: 40 }}
          onDragStart={() => {
            playSfx('cardSnap')
            haptics.tick()
          }}
          onDragEnd={() => haptics.tick()}
        >
          {allChildren.slice(0, visibleCount)}
        </motion.div>
      </div>

      {showScrollbar && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <div
            ref={scrollbarRef}
            className="relative h-1.5 rounded-full bg-gold-300/15 dark:bg-gold-300/10"
            style={{ width: scrollbarWidth }}
          >
            <motion.div
              className="absolute top-1/2 h-3 -translate-y-1/2 cursor-grab rounded-full bg-gradient-to-r from-gold-200 via-gold-300 to-bronze-500 shadow-[0_0_10px_rgba(212,175,55,0.6)] active:cursor-grabbing"
              style={{ width: thumbWidth, x: thumbX }}
              drag="x"
              dragConstraints={{ left: 0, right: thumbTravel }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={onScrollbarDrag}
            />
          </div>
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-current/40">
            {t('common.dragToExplore')}
          </span>
        </div>
      )}
    </div>
  )
}
