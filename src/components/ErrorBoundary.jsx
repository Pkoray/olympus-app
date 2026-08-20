import { Component } from 'react'

// Class component is required here — React only invokes componentDidCatch /
// getDerivedStateFromError on class components, there's no hook equivalent.
// Kept independent of LangContext/ThemeContext since this must still render
// a working fallback even if one of those providers is what threw.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[Olympus] Uncaught error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const isTr = (typeof localStorage !== 'undefined' && localStorage.getItem('olympus-lang')) === 'tr'

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-abyss-950 px-6 text-center text-marble-100">
        <p className="font-serif text-6xl text-gradient-gold">Ω</p>
        <h1 className="mt-6 font-serif text-3xl text-marble-50 sm:text-4xl">
          {isTr ? 'Olympos sarsıldı' : 'Olympus has trembled'}
        </h1>
        <p className="mt-3 max-w-md font-sans text-sm text-marble-100/60">
          {isTr
            ? 'Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi veya ana sayfaya dönmeyi deneyin.'
            : 'Something went wrong rendering this page. Try reloading, or return to the beginning.'}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-gold-300/40 px-6 py-2.5 font-sans text-sm uppercase tracking-widest text-gold-300 transition-colors hover:border-gold-300 hover:bg-gold-300/10"
          >
            {isTr ? 'Yenile' : 'Reload'}
          </button>
          <a
            href="/"
            className="rounded-full border border-gold-300/15 px-6 py-2.5 font-sans text-sm uppercase tracking-widest text-marble-100/70 transition-colors hover:border-gold-300/40 hover:text-gold-300"
          >
            {isTr ? 'Ana Sayfa' : 'Return Home'}
          </a>
        </div>
      </div>
    )
  }
}
