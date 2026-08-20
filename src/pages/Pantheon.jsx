import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/layout/PageTransition'
import GodCard from '../components/ui/GodCard'
import { CHARACTERS } from '../data/characters'
import { useLang } from '../context/LangContext'

export default function Pantheon() {
  const { t } = useLang()
  const [filter, setFilter] = useState('all')

  const filtered = CHARACTERS.filter((c) => filter === 'all' || c.group === filter)

  return (
    <PageTransition className="mx-auto min-h-dvh max-w-7xl px-5 pb-24 pt-32 sm:px-8">
      <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300/70">
        {t('home.section.gods.kicker')}
      </p>
      <h1 className="mt-3 font-serif text-4xl text-abyss-900 dark:text-marble-100 sm:text-5xl">
        {t('nav.pantheon')}
      </h1>

      <div className="mt-8 flex flex-wrap gap-3">
        {['all', 'primordial-titan', 'olympian', 'hero', 'monster'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 font-sans text-xs uppercase tracking-widest transition-colors ${
              filter === f
                ? 'border-gold-300 bg-gold-300/10 text-gold-500 dark:text-gold-300'
                : 'border-gold-300/20 text-current/50 hover:border-gold-300/50'
            }`}
          >
            {t(`filter.${f}`)}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.5 }}
            className="mx-auto"
          >
            <GodCard character={c} />
          </motion.div>
        ))}
      </motion.div>
    </PageTransition>
  )
}
