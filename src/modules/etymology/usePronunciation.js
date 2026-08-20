import { useCallback, useMemo } from 'react'

/**
 * Speaks a headword via the browser's native SpeechSynthesis API. Note: this
 * is the honest limit of what a browser can offer — there is no "authentic
 * reconstructed Ancient Greek" TTS voice anywhere.
 *
 * Most desktop browsers ship with no Greek voice installed at all — Chrome
 * on Windows in particular almost never has one out of the box. Forcing
 * `utterance.lang = 'el-GR'` in that case produces total silence (no error,
 * just nothing audible), which is worse than an approximation. So: if a real
 * Greek voice is present, speak the polytonic text with it for the closest
 * available pronunciation; otherwise fall back to the Latin transliteration
 * (e.g. "Zeús") read by whatever default voice exists, which is always
 * audible and still a reasonable phonetic approximation.
 */
export default function usePronunciation() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = useCallback(
    (polytonic, translit) => {
      if (!supported || !polytonic) return
      try {
        window.speechSynthesis.cancel()
        const voices = window.speechSynthesis.getVoices()
        const greekVoice = voices.find((v) => v.lang?.toLowerCase().startsWith('el'))

        const utterance = new SpeechSynthesisUtterance(greekVoice ? polytonic : translit || polytonic)
        utterance.rate = 0.8
        utterance.pitch = 1
        if (greekVoice) {
          utterance.lang = 'el-GR'
          utterance.voice = greekVoice
        }

        // Queuing an utterance in the same tick as cancel() gets silently
        // dropped in some Chrome builds — a tick's delay avoids that race.
        setTimeout(() => window.speechSynthesis.speak(utterance), 0)
      } catch {
        /* noop — pronunciation is a nice-to-have, never worth crashing over */
      }
    },
    [supported],
  )

  return useMemo(() => ({ supported, speak }), [supported, speak])
}
