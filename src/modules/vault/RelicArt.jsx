// Procedural SVG artwork for each relic — same hand-crafted, no-external-
// assets convention as BronzeFrame's GodBust/GrapeCluster fallbacks, so the
// vault never depends on downloaded 3D models or texture files.

function GoldDefs({ id }) {
  return (
    <defs>
      <linearGradient id={`metal-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbf4df" />
        <stop offset="30%" stopColor="#e7c877" />
        <stop offset="55%" stopColor="#a67c1e" />
        <stop offset="80%" stopColor="#cd9563" />
        <stop offset="100%" stopColor="#5c3e24" />
      </linearGradient>
    </defs>
  )
}

export function BoltArt() {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full">
      <GoldDefs id="bolt" />
      <path
        d="M108 18 L58 128 L94 128 L82 222 L150 100 L112 100 Z"
        fill="url(#metal-bolt)"
        stroke="#3d2a10"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TalariaArt() {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full">
      <GoldDefs id="talaria" />
      <path
        d="M60 190 Q40 160 55 130 Q70 105 100 110 L150 120 Q168 124 165 140 Q160 158 140 156 L95 150 Q70 148 60 190 Z"
        fill="url(#metal-talaria)"
        stroke="#3d2a10"
        strokeWidth={2}
      />
      <path
        d="M100 108 Q75 60 40 55 Q65 30 100 55 Q110 75 100 108 Z"
        fill="url(#metal-talaria)"
        stroke="#3d2a10"
        strokeWidth={1.6}
        opacity={0.92}
      />
      <path
        d="M112 98 Q135 45 175 34 Q158 12 118 32 Q104 55 112 98 Z"
        fill="url(#metal-talaria)"
        stroke="#3d2a10"
        strokeWidth={1.6}
        opacity={0.92}
      />
    </svg>
  )
}

export function AegisArt() {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full">
      <GoldDefs id="aegis" />
      <circle cx="100" cy="120" r="78" fill="url(#metal-aegis)" stroke="#3d2a10" strokeWidth={2.5} />
      <circle cx="100" cy="120" r="60" fill="none" stroke="#3d2a10" strokeWidth={1.2} opacity={0.5} />
      <circle cx="100" cy="108" r="22" fill="#12160f" opacity={0.85} />
      <circle cx="92" cy="103" r="3.2" fill="#ff4d4d" />
      <circle cx="108" cy="103" r="3.2" fill="#ff4d4d" />
      <path d="M84 118 Q100 128 116 118" stroke="#ff4d4d" strokeWidth={1.4} fill="none" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <path
          key={deg}
          d="M0 0 Q6 10 2 20"
          stroke="#12160f"
          strokeWidth={2}
          fill="none"
          opacity={0.7}
          transform={`translate(${100 + 22 * Math.cos((deg * Math.PI) / 180)} ${
            108 + 22 * Math.sin((deg * Math.PI) / 180)
          }) rotate(${deg})`}
        />
      ))}
    </svg>
  )
}

export function HelmArt() {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full">
      <GoldDefs id="helm" />
      <path
        d="M60 150 C55 95 70 55 100 55 C130 55 145 95 140 150 L150 175 L50 175 Z"
        fill="url(#metal-helm)"
        stroke="#3d2a10"
        strokeWidth={2}
      />
      <path d="M92 40 L100 15 L108 40 Z" fill="url(#metal-helm)" stroke="#3d2a10" strokeWidth={1.4} />
      <path d="M70 60 Q100 35 130 60" stroke="#3d2a10" strokeWidth={1.6} fill="none" opacity={0.6} />
      <rect x="80" y="95" width="40" height="14" rx="2" fill="#0a0508" opacity={0.85} />
    </svg>
  )
}

export function FleeceArt() {
  const tufts = [
    [70, 90], [100, 78], [130, 92], [60, 130], [95, 118], [128, 132],
    [70, 168], [100, 158], [130, 170], [85, 200], [115, 200],
  ]
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full">
      <GoldDefs id="fleece" />
      {tufts.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={20} fill="url(#metal-fleece)" stroke="#3d2a10" strokeWidth={1} strokeOpacity={0.4} />
      ))}
      <path d="M78 68 Q70 45 55 42" stroke="#3d2a10" strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M122 68 Q130 45 145 42" stroke="#3d2a10" strokeWidth={4} strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function WandArt() {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full">
      <GoldDefs id="wand" />
      <rect x="94" y="70" width="12" height="140" rx="5" fill="url(#metal-wand)" stroke="#3d2a10" strokeWidth={1.6} />
      <circle cx="100" cy="55" r="20" fill="url(#metal-wand)" stroke="#3d2a10" strokeWidth={2} />
      <circle cx="100" cy="55" r="8" fill="#a8d060" opacity={0.85} />
      <path d="M100 35 Q80 20 65 28 Q78 34 82 46 Q90 38 100 35 Z" fill="url(#metal-wand)" opacity={0.9} />
      <path d="M100 35 Q120 20 135 28 Q122 34 118 46 Q110 38 100 35 Z" fill="url(#metal-wand)" opacity={0.9} />
    </svg>
  )
}

export function PithosArt() {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full">
      <GoldDefs id="pithos" />
      <ellipse cx="100" cy="200" rx="42" ry="14" fill="url(#metal-pithos)" opacity={0.85} />
      <path
        d="M62 90 C55 130 55 170 72 198 C82 214 118 214 128 198 C145 170 145 130 138 90 C150 78 150 60 138 50 L62 50 C50 60 50 78 62 90 Z"
        fill="url(#metal-pithos)"
        stroke="#3d2a10"
        strokeWidth={2}
      />
      <ellipse cx="100" cy="50" rx="38" ry="10" fill="#5c3e24" opacity={0.9} />
      <path d="M78 36 Q100 20 122 36 L118 50 Q100 40 82 50 Z" fill="url(#metal-pithos)" stroke="#3d2a10" strokeWidth={1.4} opacity={0.95} />
      <path d="M92 34 Q88 22 78 16" stroke="#e0c060" strokeWidth={2} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d="M108 34 Q114 20 126 15" stroke="#e0c060" strokeWidth={2} fill="none" opacity={0.5} strokeLinecap="round" />
    </svg>
  )
}

export function ThreadArt() {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full">
      <GoldDefs id="thread" />
      <rect x="60" y="70" width="16" height="100" rx="4" fill="url(#metal-thread)" stroke="#3d2a10" strokeWidth={1.4} />
      <rect x="124" y="70" width="16" height="100" rx="4" fill="url(#metal-thread)" stroke="#3d2a10" strokeWidth={1.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse
          key={i}
          cx="100"
          cy={78 + i * 15}
          rx="32"
          ry="9"
          fill="none"
          stroke="url(#metal-thread)"
          strokeWidth={4}
          opacity={0.85}
        />
      ))}
      <path d="M100 168 Q60 190 40 225" stroke="url(#metal-thread)" strokeWidth={2.4} fill="none" opacity={0.9} />
    </svg>
  )
}

export const RELIC_ART = {
  bolt: BoltArt,
  talaria: TalariaArt,
  aegis: AegisArt,
  helm: HelmArt,
  fleece: FleeceArt,
  wand: WandArt,
  pithos: PithosArt,
  thread: ThreadArt,
}

// Real photorealistic artifact renders (same style/pipeline as the character
// statue busts) live in src/assets/relics/<relicId>.jpg. Any relic without a
// matching file gracefully falls back to the hand-drawn SVG art above, so
// the vault never shows a broken image.
const relicModules = import.meta.glob('../../assets/relics/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
})
// .webp always wins over a same-id .jpg/.png fallback, regardless of glob
// iteration order (see scripts/optimize-images.mjs, which generates the webp
// alongside the original rather than replacing it).
export const RELIC_IMAGES = {}
for (const [path, url] of Object.entries(relicModules)) {
  const id = path.match(/([^/]+)\.[a-z]+$/i)[1]
  if (!RELIC_IMAGES[id] || path.endsWith('.webp')) RELIC_IMAGES[id] = url
}
