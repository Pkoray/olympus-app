import { useEffect, useRef } from 'react'
import { useMotionValueEvent } from 'framer-motion'
import { STAGES } from './katabasisData'
import { useAmbientAudio } from '../../context/AudioContext'

/**
 * Crossfades the ambient soundscape as the reader scrolls through the four
 * Katabasis stages. `AudioContext.playProfile` already ramps out the old
 * voice and ramps in the new one over 1.2s, so this hook's only job is to
 * detect *which* quartile of scroll progress we're in and call it once per
 * stage change — never on every scroll tick.
 */
export default function useKatabasisAudio(scrollYProgress) {
  const { playProfile, stop } = useAmbientAudio()
  const stageIndexRef = useRef(-1)

  useEffect(() => {
    stageIndexRef.current = 0
    playProfile(STAGES[0].audioProfile)
    return () => stop(0.9)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const index = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length)))
    if (index !== stageIndexRef.current) {
      stageIndexRef.current = index
      playProfile(STAGES[index].audioProfile)
    }
  })
}
