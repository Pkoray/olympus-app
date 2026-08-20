import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GitBranch, Map as MapIcon, ArrowRight } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import HorizontalCarousel from '../components/ui/HorizontalCarousel'
import GodCard from '../components/ui/GodCard'
import { charactersByGroup } from '../data/characters'
import { useLang } from '../context/LangContext'

function Section({ kicker, title, desc, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-7xl px-5 py-20 sm:px-8"
    >
      <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300/70">{kicker}</p>
      <h2 className="mt-3 font-serif text-3xl text-abyss-900 dark:text-marble-100 sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-2xl font-sans text-current/60">{desc}</p>
      <div className="mt-10">{children}</div>
    </motion.section>
  )
}

export default function Home() {
  const { t } = useLang()

  return (
    <PageTransition>
      <section className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-28 sm:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300/15 blur-[140px]" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-bronze-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-sans text-xs uppercase tracking-[0.4em] text-gold-500 dark:text-gold-300/70"
          >
            {t('home.kicker')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-serif text-5xl leading-[1.05] text-abyss-900 dark:text-marble-50 sm:text-7xl"
          >
            {t('home.title1')}
            <br />
            <span className="text-gradient-gold">{t('home.title2')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mx-auto mt-8 max-w-xl font-sans text-lg text-current/60"
          >
            {t('home.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/pantheon"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-bronze-500 px-7 py-3 font-sans text-sm uppercase tracking-widest text-abyss-950 shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-transform hover:scale-105"
            >
              {t('home.cta.pantheon')}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/family-tree"
              className="inline-flex items-center gap-2 rounded-full border border-gold-300/40 px-7 py-3 font-sans text-sm uppercase tracking-widest text-abyss-900/80 transition-colors hover:border-gold-300 hover:text-gold-500 dark:text-marble-100/80 dark:hover:text-gold-300"
            >
              {t('home.cta.tree')}
            </Link>
          </motion.div>
        </div>
      </section>

      {[
        ['titans', 'primordial-titan'],
        ['gods', 'olympian'],
        ['heroes', 'hero'],
        ['monsters', 'monster'],
      ].map(([key, group]) => (
        <Section
          key={group}
          kicker={t(`home.section.${key}.kicker`)}
          title={t(`home.section.${key}.title`)}
          desc={t(`home.section.${key}.desc`)}
        >
          <HorizontalCarousel>
            {charactersByGroup(group).map((c) => (
              <GodCard key={c.id} character={c} />
            ))}
          </HorizontalCarousel>
        </Section>
      ))}

      <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 sm:px-8 md:grid-cols-2">
        {[
          { to: '/family-tree', icon: GitBranch, k: 'tree' },
          { to: '/map', icon: MapIcon, k: 'map' },
        ].map(({ to, icon: Icon, k }) => (
          <Link key={to} to={to}>
            <motion.div
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-gold-300/20 bg-gradient-to-br from-bronze-700/10 to-transparent p-8"
            >
              <Icon className="text-gold-400" size={28} />
              <h3 className="mt-5 font-serif text-2xl text-abyss-900 dark:text-marble-100">
                {t(`home.section.${k}.title`)}
              </h3>
              <p className="mt-2 max-w-md font-sans text-sm text-current/55">{t(`home.section.${k}.desc`)}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gold-500 dark:text-gold-300">
                {t(`home.section.${k}.cta`)}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </PageTransition>
  )
}
