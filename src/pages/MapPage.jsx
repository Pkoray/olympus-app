import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import BackgroundScene from '../components/ui/BackgroundScene'
import AncientMap from '../components/map/AncientMap'
import GodCard from '../components/ui/GodCard'
import { REGIONS, charactersByRegion } from '../data/characters'
import { useLang } from '../context/LangContext'
import { useAmbientAudio } from '../context/AudioContext'
import useHaptics from '../hooks/useHaptics'

export default function MapPage() {
  const { lang, t } = useLang()
  const { playSfx } = useAmbientAudio()
  const haptics = useHaptics()
  const location = useLocation()
  // Arriving from the command palette's search results passes the target
  // region's id via router state, so the map opens directly on its hotspot.
  const [activeId, setActiveId] = useState(() =>
    location.state?.regionId && REGIONS[location.state.regionId] ? location.state.regionId : null,
  )
  const wasOpen = useRef(false)

  const activeRegion = activeId ? REGIONS[activeId] : null
  const residents = activeId ? charactersByRegion(activeId) : []

  useEffect(() => {
    if (activeId && !wasOpen.current) {
      playSfx('takeoverOpen')
      haptics.takeover()
    }
    wasOpen.current = Boolean(activeId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  return (
    <PageTransition className="relative min-h-dvh">
      <BackgroundScene theme={{ bg: 'underworld', primary: '#03121c', secondary: '#0a2c3a', glow: '#3ad6e0' }} />

      <div className="mx-auto max-w-6xl px-5 pb-6 pt-28 sm:px-8">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold-300/70">{t('home.section.map.kicker')}</p>
        <h1 className="mt-3 font-serif text-4xl text-marble-100 sm:text-5xl">{t('map.title')}</h1>
        <p className="mt-3 max-w-xl font-sans text-current/60">{t('map.subtitle')}</p>
      </div>

      <div className="mx-5 overflow-hidden rounded-3xl border border-gold-300/15 sm:mx-8">
        <AncientMap regions={REGIONS} activeId={activeId} onSelect={setActiveId} />
      </div>

      <AnimatePresence>
        {activeRegion && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveId(null)}
              className="fixed inset-0 z-40 bg-abyss-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) setActiveId(null)
              }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] touch-pan-y overflow-y-auto rounded-t-[2.5rem] border-t border-gold-300/25 bg-abyss-900/95 px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8 backdrop-blur-xl sm:px-10"
            >
              <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-gold-300/25 sm:hidden" />
              <div className="mx-auto flex max-w-5xl items-start justify-between">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-300/60">{t('map.residents')}</p>
                  <h2 className="mt-1 font-serif text-3xl text-marble-100">
                    {lang === 'tr' ? activeRegion.nameTr : activeRegion.nameEn}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveId(null)}
                  className="rounded-full border border-gold-300/25 p-2 text-marble-100/70 transition-colors hover:border-gold-300 hover:text-gold-300"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-6 sm:justify-start">
                {residents.map((c) => (
                  <GodCard key={c.id} character={c} />
                ))}
                {residents.length === 0 && (
                  <p className="font-sans text-sm text-marble-100/50">—</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
