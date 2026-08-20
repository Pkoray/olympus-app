import { createContext, useContext, useMemo, useState } from 'react'
import { translations } from '../data/translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('olympus-lang') || 'en')

  const setLangPersist = (l) => {
    localStorage.setItem('olympus-lang', l)
    setLang(l)
  }

  const toggleLang = () => setLangPersist(lang === 'en' ? 'tr' : 'en')

  const t = useMemo(() => {
    const dict = translations[lang] || translations.en
    return (key) => dict[key] ?? translations.en[key] ?? key
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang: setLangPersist, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
