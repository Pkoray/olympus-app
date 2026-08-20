import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { THEME_ICONS } from '../../data/themeIcons'

export default function BackgroundScene({ theme }) {
  const Icon = THEME_ICONS[theme?.bg] ?? Sparkles
  const primary = theme?.primary ?? '#0a0f24'
  const secondary = theme?.secondary ?? '#1b2a5e'
  const glow = theme?.glow ?? '#ffd36b'

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        key={theme?.bg}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
        style={{ background: `radial-gradient(120% 90% at 50% -10%, ${secondary}66, transparent 60%), linear-gradient(180deg, ${primary}, #05060a 85%)` }}
      />

      <motion.div
        className="absolute left-1/2 top-1/4 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-[150px]"
        style={{ background: glow, opacity: 0.18 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.14, 0.24, 0.14] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full blur-[110px]"
        style={{ background: secondary, opacity: 0.35 }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -right-24 top-1/3 opacity-[0.07]"
        style={{ color: glow }}
        animate={{ y: [0, -24, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon size={420} strokeWidth={0.6} />
      </motion.div>

      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute block h-1 w-1 rounded-full"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
            background: glow,
            opacity: 0.5,
          }}
          animate={{ opacity: [0.1, 0.7, 0.1], y: [0, -16, 0] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}

      <div className="bg-noise absolute inset-0" />
    </div>
  )
}
