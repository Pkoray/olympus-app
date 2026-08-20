import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { THEME_ICONS } from '../../data/themeIcons'

// Real portraits generated for every character (see scripts/generate-statues in
// project notes) live in src/assets/statues/<id>.jpg. Any character without a
// matching file gracefully falls back to the generated bronze/marble relief
// below, so the app never shows a broken image.
const statueModules = import.meta.glob('../../assets/statues/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
})
// .webp always wins over a same-id .jpg/.png fallback, regardless of glob
// iteration order (see scripts/optimize-images.mjs, which generates the webp
// alongside the original rather than replacing it).
const STATUE_IMAGES = {}
for (const [path, url] of Object.entries(statueModules)) {
  const id = path.match(/([^/]+)\.[a-z]+$/i)[1]
  if (!STATUE_IMAGES[id] || path.endsWith('.webp')) STATUE_IMAGES[id] = url
}

function GodBust({ glow }) {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="bronzeBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e2ae" />
          <stop offset="30%" stopColor="#c19a2e" />
          <stop offset="55%" stopColor="#7a5230" />
          <stop offset="80%" stopColor="#cd9563" />
          <stop offset="100%" stopColor="#5c3e24" />
        </linearGradient>
        <radialGradient id="bustGlow" cx="50%" cy="15%" r="75%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill="url(#bustGlow)" />
      <rect x="35" y="205" width="130" height="22" rx="3" fill="url(#bronzeBody)" opacity="0.9" />
      <rect x="20" y="223" width="160" height="12" rx="2" fill="url(#bronzeBody)" opacity="0.75" />
      <path
        d="M100 60 C60 60 45 95 48 140 C50 168 60 190 45 205 L155 205 C140 190 150 168 152 140 C155 95 140 60 100 60 Z"
        fill="url(#bronzeBody)"
      />
      <path d="M55 130 C40 150 42 185 55 205 L80 205 C68 185 65 150 78 130 Z" fill="#5c3e24" opacity="0.55" />
      <path d="M145 130 C160 150 158 185 145 205 L120 205 C132 185 135 150 122 130 Z" fill="#5c3e24" opacity="0.55" />
      <rect x="88" y="55" width="24" height="20" fill="url(#bronzeBody)" />
      <ellipse cx="100" cy="35" rx="30" ry="34" fill="url(#bronzeBody)" />
      <path d="M75 45 Q85 70 78 100" stroke="#2d1f10" strokeWidth="1.2" opacity="0.35" fill="none" />
      <path d="M130 90 Q120 130 132 170" stroke="#2d1f10" strokeWidth="1.2" opacity="0.3" fill="none" />
      <path d="M70 20 Q100 5 130 20 L124 40 Q100 28 76 40 Z" fill="#fbf4df" opacity="0.5" />
    </svg>
  )
}

function GrapeCluster({ glow }) {
  const berries = [
    [100, 70], [82, 92], [118, 92], [70, 116], [100, 116], [130, 116],
    [82, 140], [118, 140], [95, 164], [105, 164], [100, 188],
  ]
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="berryGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f3e2ae" />
          <stop offset="45%" stopColor="#c19a2e" />
          <stop offset="100%" stopColor="#5c3e24" />
        </radialGradient>
        <radialGradient id="grapeGlow" cx="50%" cy="10%" r="80%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill="url(#grapeGlow)" />
      <rect x="35" y="205" width="130" height="22" rx="3" fill="#7a5230" opacity="0.85" />
      <path d="M100 20 C90 35 110 45 100 60" stroke="#7a5230" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M100 30 C70 20 55 45 75 62 C90 70 105 55 100 30 Z" fill="#4a5a2a" opacity="0.85" />
      {berries.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={16} fill="url(#berryGrad)" stroke="#2d1f10" strokeWidth="0.6" strokeOpacity="0.3" />
      ))}
    </svg>
  )
}

export default function BronzeFrame({ character, layoutId, className = '', interactive = true }) {
  const [hovered, setHovered] = useState(false)
  const glow = character.theme?.glow ?? '#d4af37'
  const Icon = THEME_ICONS[character.theme?.bg] ?? Sparkles
  const photo = STATUE_IMAGES[character.id]

  return (
    <motion.div
      layoutId={layoutId}
      onHoverStart={() => interactive && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group relative isolate flex flex-col overflow-hidden rounded-t-[3rem] rounded-b-xl border border-gold-300/25 bg-gradient-to-b from-bronze-700/30 via-abyss-800/60 to-abyss-900/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ${className}`}
    >
      {photo ? (
        <motion.img
          src={photo}
          alt={character.nameEn}
          loading={interactive ? 'lazy' : 'eager'}
          decoding="async"
          fetchPriority={interactive ? 'auto' : 'high'}
          className="absolute inset-0 h-full w-full object-cover object-top"
          animate={{
            scale: hovered ? 1.07 : 1,
            filter: hovered ? 'brightness(0.5) saturate(1.15)' : 'brightness(0.94)',
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <div className="relative flex-1 p-3">
          {character.imageType === 'grapes' ? <GrapeCluster glow={glow} /> : <GodBust glow={glow} />}
        </div>
      )}

      <div className="bg-noise pointer-events-none absolute inset-0 z-10" />

      <div
        className="pointer-events-none absolute -inset-8 z-0 opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `radial-gradient(circle at 50% 20%, ${glow}55, transparent 65%)` }}
      />

      {photo && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-abyss-950/85 to-transparent" />
      )}

      {interactive && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            >
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 55%, ${glow}30, transparent 72%)` }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                animate={{ opacity: 0.55, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: glow }}
              >
                <Icon size={64} strokeWidth={0.9} />
              </motion.div>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-1 w-1 rounded-full"
                  style={{
                    left: `${15 + ((i * 11) % 70)}%`,
                    top: `${65 + ((i * 13) % 25)}%`,
                    background: glow,
                  }}
                  animate={{ opacity: [0, 1, 0], y: [0, -30, -46] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.16, ease: 'easeOut' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {character.asset != null && (
        <div className="absolute right-3 top-3 z-20 rounded-full border border-gold-300/40 bg-abyss-950/60 px-2 py-0.5 font-serif text-[10px] tracking-widest text-gold-200/80 backdrop-blur">
          N°{String(character.asset).padStart(2, '0')}
        </div>
      )}

      {interactive && (
        <div className="pointer-events-none absolute inset-0 z-20 rounded-t-[3rem] rounded-b-xl ring-1 ring-inset ring-gold-200/10 transition-all duration-500 group-hover:ring-gold-200/40" />
      )}
    </motion.div>
  )
}
