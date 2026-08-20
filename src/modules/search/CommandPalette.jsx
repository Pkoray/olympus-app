import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, CornerDownLeft } from 'lucide-react'
import { searchEntities } from './searchIndex'
import { useLang } from '../../context/LangContext'
import { useAmbientAudio } from '../../context/AudioContext'
import useHaptics from '../../hooks/useHaptics'

const TYPE_LABEL_KEY = { character: 'search.type.character', relic: 'search.type.relic', location: 'search.type.location' }

/**
 * Global Cmd+K / Ctrl+K command palette — searches every character, relic
 * and map location in one flat, client-side index (see `searchIndex.js`).
 * Selecting a result routes via React Router's `navigate()`, so this is a
 * client-side transition like any other in the app, never a hard reload.
 */
export default function CommandPalette() {
  const { lang, t } = useLang()
  const navigate = useNavigate()
  const { playSfx } = useAmbientAudio()
  const haptics = useHaptics()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const results = searchEntities(query, lang)

  useEffect(() => {
    const onKeyDown = (e) => {
      const isCombo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (isCombo) {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)

    // Lets the Navbar's search button open the palette without prop-drilling
    // or a dedicated context — dispatched by Navbar's onClick.
    const onExternalOpen = () => setOpen(true)
    window.addEventListener('olympus:open-search', onExternalOpen)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('olympus:open-search', onExternalOpen)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
      playSfx('takeoverOpen')
    } else {
      setQuery('')
      setActiveIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const select = (item) => {
    if (!item) return
    setOpen(false)
    haptics.confirm()
    playSfx('nodeClick')
    navigate(item.route, item.navState ? { state: item.navState } : undefined)
  }

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(results[activeIndex])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] bg-abyss-950/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card fixed left-1/2 top-[12vh] z-[91] w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border-gold-300/40 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-gold-300/20 px-5 py-4">
              <Search size={17} className="shrink-0 text-gold-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={t('search.placeholder')}
                className="w-full bg-transparent font-sans text-sm text-abyss-900 outline-none placeholder:text-current/40 dark:text-marble-100"
              />
              <button onClick={() => setOpen(false)} className="shrink-0 text-current/40 transition-colors hover:text-gold-400">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {query.trim() === '' && (
                <p className="px-3 py-6 text-center font-sans text-xs text-current/40">{t('search.hint')}</p>
              )}
              {query.trim() !== '' && results.length === 0 && (
                <p className="px-3 py-6 text-center font-sans text-xs text-current/40">{t('search.empty')}</p>
              )}
              {results.map((item, i) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => select(item)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    i === activeIndex ? 'bg-gold-300/15' : 'hover:bg-gold-300/5'
                  }`}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-300/30"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${item.glow}55, #5c3e24aa 70%)` }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate font-serif text-[15px] text-abyss-900 dark:text-marble-100">
                        {lang === 'tr' ? item.nameTr : item.nameEn}
                      </span>
                      {item.greek && <span className="font-greek shrink-0 text-xs text-gold-500/80 dark:text-gold-300/70">{item.greek}</span>}
                    </span>
                    {(item.epithetEn || item.epithetTr) && (
                      <span className="block truncate font-sans text-xs italic text-current/50">
                        {lang === 'tr' ? item.epithetTr : item.epithetEn}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-sans text-[10px] uppercase tracking-widest text-gold-500/70 dark:text-gold-300/50">
                    {t(TYPE_LABEL_KEY[item.type])}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-1.5 border-t border-gold-300/15 px-5 py-2.5 font-sans text-[10px] uppercase tracking-widest text-current/35">
              <CornerDownLeft size={11} />
              {t('search.enterHint')}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
