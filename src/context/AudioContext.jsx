import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AMBIENT_ENGINES, SFX_ENGINES } from '../audio/SoundRegistry'

const OlympusAudioContext = createContext(null)

/**
 * Fully procedural spatial audio via the Web Audio API — no external audio
 * files are bundled, so every character theme and UI micro-SFX is
 * synthesized on the fly (see `src/audio/SoundRegistry.js`). Signal chain:
 * voice/SFX sources → masterGain (mute) → StereoPannerNode (cursor/tilt
 * driven) → destination.
 */
export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(() => localStorage.getItem('olympus-muted') === 'true')
  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const pannerRef = useRef(null)
  const voiceRef = useRef(null) // { nodes: [...], gain }

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      const ac = new AC()
      ctxRef.current = ac

      const panner = ac.createStereoPanner()
      panner.connect(ac.destination)
      pannerRef.current = panner

      const master = ac.createGain()
      master.gain.value = muted ? 0 : 0.55
      master.connect(panner)
      masterRef.current = master
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [muted])

  const stop = useCallback((fade = 1.2) => {
    const ac = ctxRef.current
    const voice = voiceRef.current
    if (!ac || !voice) return
    const now = ac.currentTime
    voice.gain.gain.cancelScheduledValues(now)
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now)
    voice.gain.gain.linearRampToValueAtTime(0, now + fade)
    const nodes = voice.nodes
    setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n.stop?.()
          n.disconnect?.()
        } catch {
          /* noop */
        }
      })
    }, fade * 1000 + 60)
    voiceRef.current = null
  }, [])

  const playProfile = useCallback(
    (profile) => {
      if (!profile) return
      const ac = ensureCtx()
      stop(1.2)

      const now = ac.currentTime
      const voiceGain = ac.createGain()
      voiceGain.gain.value = 0
      voiceGain.connect(masterRef.current)

      const engine = AMBIENT_ENGINES[profile.engine] ?? AMBIENT_ENGINES.drone
      const nodes = engine(ac, voiceGain, profile)

      voiceGain.gain.linearRampToValueAtTime(1, now + 1.2)
      voiceRef.current = { nodes: [voiceGain, ...nodes], gain: voiceGain }
    },
    [ensureCtx, stop],
  )

  const playSfx = useCallback(
    (name) => {
      const builder = SFX_ENGINES[name]
      if (!builder) return
      const ac = ensureCtx()
      try {
        builder(ac, masterRef.current)
      } catch {
        /* noop — never let a UI micro-SFX crash an interaction */
      }
    },
    [ensureCtx],
  )

  /** Ramp the global stereo image toward `value` (-1..1). Safe to call before
   *  the AudioContext exists (e.g. before the first user gesture) — no-ops. */
  const setPan = useCallback((value, ramp = 0.12) => {
    const ac = ctxRef.current
    const panner = pannerRef.current
    if (!ac || !panner) return
    const clamped = Math.max(-1, Math.min(1, value))
    panner.pan.cancelScheduledValues(ac.currentTime)
    panner.pan.setValueAtTime(panner.pan.value, ac.currentTime)
    panner.pan.linearRampToValueAtTime(clamped, ac.currentTime + ramp)
  }, [])

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.linearRampToValueAtTime(
        muted ? 0 : 0.55,
        (ctxRef.current?.currentTime ?? 0) + 0.4,
      )
    }
    localStorage.setItem('olympus-muted', String(muted))
  }, [muted])

  const toggleMute = useCallback(() => {
    ensureCtx()
    setMuted((m) => !m)
  }, [ensureCtx])

  return (
    <OlympusAudioContext.Provider value={{ muted, toggleMute, playProfile, stop, playSfx, setPan }}>
      {children}
    </OlympusAudioContext.Provider>
  )
}

export function useAmbientAudio() {
  const ctx = useContext(OlympusAudioContext)
  if (!ctx) throw new Error('useAmbientAudio must be used within AudioProvider')
  return ctx
}
