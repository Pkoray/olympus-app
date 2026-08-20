import { Link } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import { useLang } from '../context/LangContext'

export default function NotFound() {
  const { t } = useLang()
  return (
    <PageTransition className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-8xl text-gradient-gold">404</p>
      <p className="mt-4 font-sans text-current/60">This myth has not yet been written.</p>
      <Link
        to="/"
        className="mt-8 rounded-full border border-gold-300/40 px-6 py-2.5 font-sans text-sm uppercase tracking-widest text-gold-500 dark:text-gold-300"
      >
        {t('common.back')}
      </Link>
    </PageTransition>
  )
}
