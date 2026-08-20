import { lazy, Suspense, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'
import { AudioProvider } from './context/AudioContext'
import useSpatialAudio from './hooks/useSpatialAudio'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import MagneticCursor from './components/ui/MagneticCursor'
import CommandPalette from './modules/search/CommandPalette'
import Home from './pages/Home'
import { initAnalytics, trackPageview } from './lib/analytics'

// Home ships eagerly (it's the landing page); everything else is
// code-split so the initial bundle isn't dragging in @xyflow/react,
// canvas starfields, etc. before the first paint even happens.
const Pantheon = lazy(() => import('./pages/Pantheon'))
const CharacterPage = lazy(() => import('./pages/CharacterPage'))
const FamilyTreePage = lazy(() => import('./pages/FamilyTreePage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const ConstellationsPage = lazy(() => import('./pages/ConstellationsPage'))
const VaultPage = lazy(() => import('./pages/VaultPage'))
const KatabasisPage = lazy(() => import('./pages/KatabasisPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function SpatialAudioController() {
  useSpatialAudio()
  return null
}

function AnalyticsTracker() {
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    trackPageview(location.pathname)
  }, [location.pathname])

  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <>
      <AnalyticsTracker />
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={null}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/pantheon" element={<Pantheon />} />
            <Route path="/shrine/:id" element={<CharacterPage />} />
            <Route path="/family-tree" element={<FamilyTreePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/constellations" element={<ConstellationsPage />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/katabasis" element={<KatabasisPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <ThemeProvider>
      <LangProvider>
        <AudioProvider>
          <SpatialAudioController />
          <MagneticCursor />
          <BrowserRouter>
            <div className="relative min-h-dvh">
              <Navbar />
              <CommandPalette />
              <AnimatedRoutes />
              <Footer />
            </div>
          </BrowserRouter>
        </AudioProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
