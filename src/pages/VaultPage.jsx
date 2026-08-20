import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/layout/PageTransition'
import BackgroundScene from '../components/ui/BackgroundScene'
import RelicViewer from '../modules/vault/RelicViewer'
import { RELIC_ART, RELIC_IMAGES } from '../modules/vault/RelicArt'
import { RELICS } from '../modules/vault/relicsData'
import { useLang } from '../context/LangContext'
import { useAmbientAudio } from '../context/AudioContext'
import useHaptics from '../hooks/useHaptics'

export default function VaultPage() {
  const { lang, t } = useLang()
  const { playSfx } = useAmbientAudio()
  const haptics = useHaptics()
  const location = useLocation()
  // Arriving from the command palette's search results passes the target
  // relic's id via router state, so the vault opens directly on it.
  const initialId = location.state?.relicId && RELICS.some((r) => r.id === location.state.relicId)
    ? location.state.relicId
    : RELICS[0].id
  const [selectedId, setSelectedId] = useState(initialId)
  const relic = RELICS.find((r) => r.id === selectedId)

  const select = (id) => {
    if (id === selectedId) return
    setSelectedId(id)
    playSfx('nodeClick')
    haptics.confirm()
  }

  return (
    <PageTransition className="relative min-h-dvh">
      <BackgroundScene theme={relic.theme} />

      <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold-300/70">{t('vault.kicker')}</p>
        <h1 className="mt-3 font-serif text-4xl text-marble-100 sm:text-5xl">{t('vault.title')}</h1>
        <p className="mt-3 max-w-xl font-sans text-marble-100/60">{t('vault.subtitle')}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          {RELICS.map((r) => {
            const Art = RELIC_ART[r.icon]
            const photo = RELIC_IMAGES[r.id]
            const isActive = r.id === selectedId
            return (
              <button
                key={r.id}
                onClick={() => select(r.id)}
                data-cursor="glow"
                className={`group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border transition-all sm:h-28 sm:w-28 ${
                  photo ? '' : 'p-4'
                } ${
                  isActive
                    ? 'border-gold-300 bg-abyss-900/60'
                    : 'border-gold-300/15 bg-abyss-900/30 hover:border-gold-300/50'
                }`}
                style={isActive ? { boxShadow: `0 0 24px ${r.theme.glow}55` } : undefined}
              >
                {photo ? (
                  <img src={photo} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <Art />
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={relic.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="relative h-[360px] rounded-3xl border border-gold-300/15 bg-gradient-to-b from-bronze-700/10 to-abyss-900/40 sm:h-[440px]"
            >
              <RelicViewer relic={relic} active />
              <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-sans text-[11px] uppercase tracking-[0.25em] text-marble-100/35">
                {t('vault.dragHint')}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={relic.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="glass-card rounded-3xl p-7"
            >
              <h2 className="font-serif text-2xl text-marble-100">{lang === 'tr' ? relic.nameTr : relic.nameEn}</h2>
              <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-gold-300/70">
                {t('vault.wielder')} · {lang === 'tr' ? relic.wielderTr : relic.wielderEn}
              </p>

              <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.25em] text-marble-100/40">
                {t('vault.properties')}
              </p>
              <ul className="mt-2 space-y-1.5">
                {(lang === 'tr' ? relic.propertiesTr : relic.propertiesEn).map((p) => (
                  <li key={p} className="flex items-start gap-2 font-sans text-sm text-marble-100/75">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-300" />
                    {p}
                  </li>
                ))}
              </ul>

              <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.25em] text-marble-100/40">
                {t('vault.lore')}
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-marble-100/70">
                {lang === 'tr' ? relic.loreTr : relic.loreEn}
              </p>

              <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.25em] text-marble-100/40">
                {t('vault.epic')}
              </p>
              <p className="mt-1 font-serif italic text-gold-300/80">{lang === 'tr' ? relic.epicTr : relic.epicEn}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
