import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, GitBranch } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import BronzeFrame from '../components/ui/BronzeFrame'
import BackgroundScene from '../components/ui/BackgroundScene'
import { getCharacter, CHARACTERS } from '../data/characters'
import { useLang } from '../context/LangContext'
import { useAmbientAudio } from '../context/AudioContext'
import useHaptics from '../hooks/useHaptics'
import GreekWord from '../modules/etymology/GreekWord'

const EDGE_SWIPE_ZONE = 24
const SWIPE_DISMISS_X = 80
const SWIPE_DISMISS_MAX_Y = 60

function Kin({ ids, label }) {
  const { lang } = useLang()
  if (!ids?.length) return null
  return (
    <div>
      <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-marble-100/40">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {ids.map((id) => {
          const k = getCharacter(id)
          if (!k) return null
          return (
            <Link
              key={id}
              to={`/shrine/${id}`}
              className="rounded-full border border-gold-300/25 px-3 py-1 font-sans text-xs text-marble-100/70 transition-colors hover:border-gold-300 hover:text-gold-300"
            >
              {lang === 'tr' ? k.nameTr : k.nameEn}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function CharacterPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const character = getCharacter(id)
  const { lang, t } = useLang()
  const { playProfile, playSfx, stop } = useAmbientAudio()
  const haptics = useHaptics()
  const touchStart = useRef(null)

  const offspring = CHARACTERS.filter((c) => c.parents?.includes(id)).map((c) => c.id)

  useEffect(() => {
    if (character) {
      playProfile(character.audioProfile)
      playSfx('takeoverOpen')
      haptics.takeover()
    }
    return () => stop(0.9)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  // Edge swipe-to-dismiss: a left-edge swipe right, mirroring native "swipe
  // back" navigation for this immersive entity takeover view.
  useEffect(() => {
    const onTouchStart = (e) => {
      const t0 = e.touches[0]
      touchStart.current = t0.clientX < EDGE_SWIPE_ZONE ? { x: t0.clientX, y: t0.clientY } : null
    }
    const onTouchEnd = (e) => {
      if (!touchStart.current) return
      const t1 = e.changedTouches[0]
      const dx = t1.clientX - touchStart.current.x
      const dy = Math.abs(t1.clientY - touchStart.current.y)
      touchStart.current = null
      if (dx > SWIPE_DISMISS_X && dy < SWIPE_DISMISS_MAX_Y) {
        haptics.tick()
        navigate(-1)
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!character) {
    return (
      <PageTransition className="flex min-h-dvh items-center justify-center">
        <p className="font-serif text-2xl">Not found.</p>
      </PageTransition>
    )
  }

  const name = lang === 'tr' ? character.nameTr : character.nameEn
  const epithet = lang === 'tr' ? character.epithetTr : character.epithetEn
  const bio = lang === 'tr' ? character.bioTr : character.bioEn
  const epic = lang === 'tr' ? character.epicTr : character.epicEn
  const chapterNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI']

  return (
    <PageTransition className="text-marble-100">
      <BackgroundScene theme={character.theme} />

      <div className="mx-auto max-w-5xl px-5 pb-32 pt-28 sm:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-marble-100/50 transition-colors hover:text-gold-300"
        >
          <ArrowLeft size={14} /> {t('common.back')}
        </button>

        <div className="mt-8 grid gap-10 md:grid-cols-[280px_1fr] md:items-start">
          <BronzeFrame
            character={character}
            layoutId={`portrait-${character.id}`}
            className="mx-auto h-[340px] w-[240px] sm:h-[380px] sm:w-[260px]"
            interactive={false}
          />

          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold-300/70">
              {t(`common.${character.kind}`)}
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-2 font-serif text-4xl text-marble-50 sm:text-6xl"
            >
              {name}
            </motion.h1>
            <GreekWord characterId={character.id} size="lg" className="mt-2" />
            <p className="mt-2 font-serif text-lg italic text-gold-300/80">{epithet}</p>
            <p className="mt-6 max-w-xl font-sans leading-relaxed text-marble-100/65">{bio}</p>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:max-w-sm">
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-marble-100/40">{t('common.domain')}</p>
                <p className="mt-1 font-serif text-marble-100/85">{lang === 'tr' ? character.domainTr : character.domainEn}</p>
              </div>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-marble-100/40">{t('common.symbol')}</p>
                <p className="mt-1 font-serif text-marble-100/85">{lang === 'tr' ? character.symbolTr : character.symbolEn}</p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <Kin ids={character.parents} label={t('common.parents')} />
              <Kin ids={offspring} label={t('common.children')} />
            </div>

            <Link
              to="/family-tree"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold-300/30 px-5 py-2 font-sans text-xs uppercase tracking-widest text-marble-100/70 transition-colors hover:border-gold-300 hover:text-gold-300"
            >
              <GitBranch size={13} /> {t('common.viewOnTree')}
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-28 max-w-2xl">
          <p className="text-center font-sans text-xs uppercase tracking-[0.35em] text-gold-300/70">
            {t('common.epic')}
          </p>
          <div className="mt-16 space-y-32">
            {epic.map((paragraph, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-serif text-5xl text-gold-300/25">{chapterNumerals[i] ?? i + 1}</span>
                <p className="mt-4 font-serif text-xl leading-relaxed text-marble-100 sm:text-2xl">
                  {paragraph}
                </p>
                {i < epic.length - 1 && (
                  <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.3em] text-marble-100/30">
                    {t('common.nextChapter')} ↓
                  </p>
                )}
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
