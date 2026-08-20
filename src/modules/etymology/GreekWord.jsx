import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { ETYMOLOGY } from './etymologyData'
import usePronunciation from './usePronunciation'
import { useLang } from '../../context/LangContext'
import useHaptics from '../../hooks/useHaptics'

const SIZE_CLASS = {
  lg: 'text-2xl sm:text-3xl',
  md: 'text-lg',
  sm: 'text-sm',
}

/**
 * Polytonic Greek headword with an interactive per-morpheme etymology
 * tooltip and a speaker button for (approximate, Modern-Greek TTS)
 * pronunciation. Renders nothing when `characterId` has no entry in
 * `etymologyData.js` — the same graceful-fallback convention BronzeFrame
 * uses for missing statue art.
 */
export default function GreekWord({ characterId, size = 'md', className = '' }) {
  const entry = ETYMOLOGY[characterId]
  const { t } = useLang()
  const { speak, supported } = usePronunciation()
  const haptics = useHaptics()
  const [activeIndex, setActiveIndex] = useState(null)

  if (!entry) return null

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`font-greek ${SIZE_CLASS[size] ?? SIZE_CLASS.md} text-gold-500 dark:text-gold-300/90`}>
        {entry.morphemes.map((m, i) => (
          <span key={i} className="relative">
            <span
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex((cur) => (cur === i ? null : cur))}
              onClick={() => setActiveIndex((cur) => (cur === i ? null : i))}
              className="font-greek-hover cursor-help outline-none"
            >
              {m.gr}
            </span>
            <AnimatePresence>
              {activeIndex === i && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card pointer-events-none absolute left-1/2 top-full z-30 mt-3 w-56 -translate-x-1/2 rounded-xl p-3 text-left shadow-xl"
                >
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold-500 dark:text-gold-300/70">
                    {t('etymology.root')}
                  </p>
                  <p className="mt-1 font-serif text-sm italic text-abyss-900 dark:text-marble-100">{m.pie}</p>
                  <p className="mt-1.5 font-sans text-xs leading-relaxed text-current/65">{m.gloss}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        ))}
      </span>

      {supported && (
        <button
          type="button"
          onClick={() => {
            speak(entry.polytonic, entry.translit)
            haptics.tick()
          }}
          aria-label={t('etymology.pronounce')}
          className="rounded-full border border-gold-300/30 p-1.5 text-gold-500 transition-colors hover:border-gold-300/70 hover:text-gold-400 dark:text-gold-300/80"
        >
          <Volume2 size={size === 'lg' ? 15 : 12} />
        </button>
      )}
    </div>
  )
}
