import { motion } from 'framer-motion'
import { useLang } from '../../context/LangContext'

const POINTS = [
  { id: 'olympus', x: 300, y: 150, kind: 'mountain' },
  { id: 'othrys', x: 110, y: 270, kind: 'mountain' },
  { id: 'underworld', x: 420, y: 430, kind: 'chasm' },
  { id: 'aegean', x: 700, y: 300, kind: 'wave' },
  { id: 'troy', x: 760, y: 130, kind: 'citadel' },
  { id: 'athens', x: 230, y: 370, kind: 'temple' },
  { id: 'crete', x: 380, y: 560, kind: 'labyrinth' },
  { id: 'icarianSea', x: 610, y: 500, kind: 'sunfall' },
]

function Marker({ point, region, active, onSelect }) {
  const { lang } = useLang()
  const name = lang === 'tr' ? region.nameTr : region.nameEn

  return (
    <g
      onClick={() => onSelect(point.id)}
      className="cursor-pointer outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(point.id)}
    >
      <motion.circle
        cx={point.x}
        cy={point.y}
        r={26}
        fill="#d4af37"
        opacity={0.12}
        animate={{ r: [22, 34, 22], opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={point.x}
        cy={point.y}
        r={active ? 10 : 7}
        fill={active ? '#f3e2ae' : '#d4af37'}
        stroke="#5c3e24"
        strokeWidth={1.5}
        whileHover={{ scale: 1.3 }}
        style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.8))' }}
      />
      <text
        x={point.x}
        y={point.y - 22}
        textAnchor="middle"
        className="pointer-events-none select-none font-serif"
        fontSize={14}
        fill={active ? '#f3e2ae' : '#e9e0cb'}
        opacity={active ? 1 : 0.85}
      >
        {name}
      </text>
    </g>
  )
}

export default function AncientMap({ regions, activeId, onSelect }) {
  return (
    <svg viewBox="0 0 900 620" className="h-full w-full">
      <defs>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a2c3a" />
          <stop offset="100%" stopColor="#041420" />
        </linearGradient>
        <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3320" />
          <stop offset="100%" stopColor="#1c1810" />
        </linearGradient>
      </defs>

      <rect width="900" height="620" fill="url(#seaGrad)" />

      {/* wave lines across the aegean */}
      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={i}
          d={`M540 ${120 + i * 55} Q 620 ${100 + i * 55} 700 ${120 + i * 55} T 860 ${120 + i * 55}`}
          stroke="#3ad6e0"
          strokeOpacity={0.12}
          strokeWidth={2}
          fill="none"
        />
      ))}

      {/* mainland */}
      <path
        d="M40 260 C 20 180 90 90 210 70 C 300 55 340 110 420 130 C 500 150 520 230 470 300
           C 520 340 500 420 420 450 C 330 480 220 470 160 420 C 90 400 40 340 40 260 Z"
        fill="url(#landGrad)"
        stroke="#7a5230"
        strokeOpacity={0.4}
      />

      {/* troy peninsula */}
      <path d="M700 90 C 740 70 800 80 800 130 C 800 170 750 180 720 160 C 700 145 690 110 700 90 Z" fill="url(#landGrad)" stroke="#7a5230" strokeOpacity={0.4} />

      {/* crete, southern island */}
      <path
        d="M220 545 C 260 525 340 520 400 530 C 460 538 520 545 540 560 C 500 578 420 585 350 582 C 290 580 240 568 220 545 Z"
        fill="url(#landGrad)"
        stroke="#7a5230"
        strokeOpacity={0.4}
      />
      {/* labyrinth spiral glyph on crete */}
      <path
        d="M380 560 m0 -18 a18 18 0 1 1 -0.1 0 M380 560 m0 -11 a11 11 0 1 0 0.1 0 M380 560 m0 -4 a4 4 0 1 1 -0.1 0"
        stroke="#e9c877"
        strokeOpacity={0.55}
        strokeWidth={1.4}
        fill="none"
      />

      {/* mountains */}
      <path d="M270 170 L300 110 L330 170 Z" fill="#5c3e24" opacity={0.7} />
      <path d="M290 170 L300 145 L312 170 Z" fill="#e9e0cb" opacity={0.5} />
      <path d="M80 290 L110 235 L140 290 Z" fill="#5c3e24" opacity={0.7} />
      <path d="M55 300 L90 250 L120 300 Z" fill="#5c3e24" opacity={0.55} />

      {/* chasm cracks near underworld */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M420 430 L${420 + (i - 1.5) * 26} ${470 + (i % 2) * 12}`}
          stroke="#8a3ff0"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />
      ))}

      {/* citadel (troy) */}
      <rect x={748} y={112} width={8} height={20} fill="#cd9563" opacity={0.8} />
      <rect x={760} y={106} width={8} height={26} fill="#cd9563" opacity={0.8} />
      <rect x={772} y={114} width={8} height={18} fill="#cd9563" opacity={0.8} />

      {/* temple (athens) */}
      <path d="M215 358 L230 342 L245 358 Z" fill="#e9e0cb" opacity={0.6} />
      <rect x={217} y={358} width={4} height={14} fill="#cd9563" opacity={0.7} />
      <rect x={228} y={358} width={4} height={14} fill="#cd9563" opacity={0.7} />
      <rect x={239} y={358} width={4} height={14} fill="#cd9563" opacity={0.7} />
      <rect x={213} y={372} width={34} height={3} fill="#cd9563" opacity={0.7} />

      {/* icarian sea — a fading sunburst over the waves */}
      <motion.g
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {[0, 45, 90, 135].map((deg) => (
          <line
            key={deg}
            x1={610}
            y1={500}
            x2={610 + 16 * Math.cos((deg * Math.PI) / 180)}
            y2={500 + 16 * Math.sin((deg * Math.PI) / 180)}
            stroke="#ffcf5c"
            strokeWidth={1.5}
          />
        ))}
      </motion.g>

      {POINTS.map((p) => (
        <Marker key={p.id} point={p} region={regions[p.id]} active={activeId === p.id} onSelect={onSelect} />
      ))}
    </svg>
  )
}
