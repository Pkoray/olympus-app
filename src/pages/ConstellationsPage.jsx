import { useEffect } from 'react'
import PageTransition from '../components/layout/PageTransition'
import ConstellationSky from '../modules/constellations/ConstellationSky'
import { useLang } from '../context/LangContext'
import { useAmbientAudio } from '../context/AudioContext'

const NIGHT_SKY_PROFILE = { engine: 'void', base: 40, filter: 220, lfoRate: 0.03, lfoDepth: 40 }

export default function ConstellationsPage() {
  const { t } = useLang()
  const { playProfile, stop } = useAmbientAudio()

  useEffect(() => {
    playProfile(NIGHT_SKY_PROFILE)
    return () => stop(0.9)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageTransition className="relative min-h-dvh bg-marble-50 dark:bg-abyss-950">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300/70">
          {t('constellations.kicker')}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-abyss-900 dark:text-marble-100 sm:text-5xl">
          {t('constellations.title')}
        </h1>
        <p className="mt-3 max-w-xl font-sans text-current/60">{t('constellations.subtitle')}</p>
      </div>

      <ConstellationSky />
    </PageTransition>
  )
}
