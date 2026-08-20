import { motion, useTransform } from 'framer-motion'
import { useLang } from '../../context/LangContext'

function StyxVisual({ drift }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-40 w-[140%] rounded-full blur-3xl"
          style={{
            left: '-20%',
            top: `${20 + i * 25}%`,
            background: 'radial-gradient(ellipse at center, rgba(111,168,184,0.16), transparent 70%)',
            y: drift,
          }}
          animate={{ x: ['-5%', '5%', '-5%'] }}
          transition={{ duration: 18 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.div
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 opacity-70"
        animate={{ x: [-60, 60, -60] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="140" height="70" viewBox="0 0 140 70">
          <path d="M10 55 Q70 70 130 55 L120 62 Q70 74 20 62 Z" fill="#0a1420" stroke="#3a5a6e" strokeWidth={1} />
          <line x1="70" y1="55" x2="70" y2="18" stroke="#3a5a6e" strokeWidth={1.5} />
          <path d="M70 18 Q90 24 70 30" fill="none" stroke="#3a5a6e" strokeWidth={1.5} />
        </svg>
      </motion.div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-px w-32 opacity-20"
          style={{ left: `${10 + i * 15}%`, bottom: `${8 + (i % 3) * 4}%`, background: '#6fa8b8' }}
        />
      ))}
    </>
  )
}

function AsphodelVisual({ drift }) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-2xl"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            width: 60 + (i % 4) * 20,
            height: 90 + (i % 3) * 30,
            background: 'rgba(185,182,200,0.10)',
            y: drift,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
    </>
  )
}

function ElysianVisual({ drift }) {
  return (
    <>
      <motion.div
        className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #ffe6a3, transparent 65%)', y: drift }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 opacity-25"
        style={{ background: 'conic-gradient(from 0deg at 50% 30%, transparent, #f3d16b33, transparent 60%)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{ left: `${(i * 29) % 100}%`, top: `${60 + ((i * 17) % 35)}%`, background: '#ffe6a3' }}
          animate={{ y: [0, -60, -120], opacity: [0, 0.9, 0] }}
          transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: i * 0.35, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

function TartarusVisual({ drift }) {
  return (
    <>
      <motion.div
        className="absolute left-1/2 top-10 h-[26rem] w-72 -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: '#3a1010', y: drift }}
      />
      <svg className="absolute bottom-0 left-0 h-40 w-full opacity-90" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0 200 L0 120 L120 60 L260 140 L400 40 L560 130 L720 70 L880 150 L1040 50 L1200 120 L1200 200 Z" fill="#000000" />
      </svg>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{ left: `${20 + i * 15}%`, bottom: `${10 + (i % 3) * 6}%`, background: '#ff6a3d' }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.6, 1] }}
          transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      <svg className="absolute right-6 top-8 h-24 w-16 opacity-30" viewBox="0 0 40 100">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="20" cy={10 + i * 26} r="9" fill="none" stroke="#8a6a2a" strokeWidth={2} />
        ))}
      </svg>
    </>
  )
}

const VISUALS = { styx: StyxVisual, asphodel: AsphodelVisual, elysian: ElysianVisual, tartarus: TartarusVisual }

export default function KatabasisStage({ stage, index, total, progress }) {
  const { t } = useLang()
  const band = 1 / total
  const start = index * band
  const end = start + band
  const pad = band * 0.15

  const opacity = useTransform(progress, [start, start + pad, end - pad, end], [0, 1, 1, index === total - 1 ? 1 : 0])
  const y = useTransform(progress, [start, end], [30, -30])
  const drift = useTransform(progress, [start, end], [30, -30])

  const Visual = VISUALS[stage.visual]

  return (
    <section
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${stage.colors.top}, ${stage.colors.bottom})` }}
    >
      <div className="pointer-events-none absolute inset-0">
        <Visual drift={drift} />
      </div>

      <motion.div style={{ opacity, y }} className="relative mx-auto max-w-xl px-6 text-center">
        <p
          className="font-sans text-xs uppercase tracking-[0.35em]"
          style={{ color: stage.colors.mist }}
        >
          {t(`${stage.t}.kicker`)}
        </p>
        <h2 className="mt-4 font-serif text-4xl text-marble-50 sm:text-5xl">{t(`${stage.t}.title`)}</h2>
        <p className="mt-6 font-sans leading-relaxed text-marble-100/65">{t(`${stage.t}.body`)}</p>
      </motion.div>
    </section>
  )
}
