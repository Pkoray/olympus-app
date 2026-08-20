import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Volume2, VolumeX, Menu, X, Languages, Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useLang } from '../../context/LangContext'
import { useAmbientAudio } from '../../context/AudioContext'
import useHaptics from '../../hooks/useHaptics'

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/pantheon', key: 'nav.pantheon' },
  { to: '/family-tree', key: 'nav.tree' },
  { to: '/map', key: 'nav.map' },
  { to: '/constellations', key: 'nav.constellations' },
  { to: '/vault', key: 'nav.vault' },
  { to: '/katabasis', key: 'nav.katabasis' },
]

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { lang, toggleLang, t } = useLang()
  const { muted, toggleMute } = useAmbientAudio()
  const haptics = useHaptics()
  const [open, setOpen] = useState(false)

  const handleToggleLang = () => {
    toggleLang()
    haptics.toggle()
  }

  const handleToggleTheme = () => {
    toggleTheme()
    haptics.toggle()
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-abyss-950/70 via-abyss-950/20 to-transparent opacity-0 dark:opacity-100 transition-opacity" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-marble-50/80 via-marble-50/20 to-transparent opacity-100 dark:opacity-0 transition-opacity" />

        <NavLink to="/" className="relative z-10 flex items-baseline gap-2">
          <span className="font-serif text-xl tracking-[0.25em] text-gradient-gold sm:text-2xl">
            {t('brand.title')}
          </span>
        </NavLink>

        <nav className="relative z-10 hidden items-center gap-4 lg:flex lg:gap-6 xl:gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-sans text-sm uppercase tracking-[0.15em] transition-colors ${
                  isActive
                    ? 'text-gold-400 dark:text-gold-300'
                    : 'text-abyss-900/60 hover:text-abyss-900 dark:text-marble-100/60 dark:hover:text-marble-100'
                }`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('olympus:open-search'))}
            aria-label={t('search.trigger')}
            className="flex items-center gap-2 rounded-full border border-gold-300/30 px-3 py-1.5 text-abyss-900/70 transition-colors hover:border-gold-300/70 hover:text-gold-500 dark:text-marble-100/70 dark:hover:text-gold-300"
          >
            <Search size={14} />
            <span className="hidden font-sans text-[10px] uppercase tracking-widest sm:inline">⌘K</span>
          </button>
          <button
            onClick={handleToggleLang}
            aria-label="Toggle language"
            className="flex items-center gap-1.5 rounded-full border border-gold-300/30 px-3 py-1.5 font-sans text-xs uppercase tracking-widest text-abyss-900/70 transition-colors hover:border-gold-300/70 hover:text-gold-500 dark:text-marble-100/70 dark:hover:text-gold-300"
          >
            <Languages size={13} />
            {lang}
          </button>
          <button
            onClick={toggleMute}
            aria-label="Toggle sound"
            className="rounded-full border border-gold-300/30 p-2 text-abyss-900/70 transition-colors hover:border-gold-300/70 hover:text-gold-500 dark:text-marble-100/70 dark:hover:text-gold-300"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border border-gold-300/30 p-2 text-abyss-900/70 transition-colors hover:border-gold-300/70 hover:text-gold-500 dark:text-marble-100/70 dark:hover:text-gold-300"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-full border border-gold-300/30 p-2 text-abyss-900/70 transition-colors hover:border-gold-300/70 hover:text-gold-500 dark:text-marble-100/70 dark:hover:text-gold-300 lg:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-gold-300/15 bg-marble-50/95 backdrop-blur-md dark:bg-abyss-950/95 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 font-sans text-sm uppercase tracking-[0.15em] ${
                      isActive ? 'text-gold-500 dark:text-gold-300' : 'text-abyss-900/70 dark:text-marble-100/70'
                    }`
                  }
                >
                  {t(l.key)}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
