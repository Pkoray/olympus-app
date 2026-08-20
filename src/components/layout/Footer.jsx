import { useLang } from '../../context/LangContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="relative z-10 border-t border-gold-300/10 px-6 py-10 text-center">
      <p className="font-serif text-sm tracking-[0.3em] text-gold-500/70 dark:text-gold-300/50">
        {t('brand.title')}
      </p>
      <p className="mt-2 font-sans text-xs text-current/40">{t('footer.tagline')}</p>
    </footer>
  )
}
