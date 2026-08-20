import { useEffect, useRef } from 'react'

/**
 * Ambient twinkling background starfield, fully isolated on its own
 * <canvas> ref. Star positions/phases are generated once and animated via a
 * dedicated rAF loop that never touches React state — so this never causes a
 * re-render, and never contends with the main DOM thread beyond its own
 * `drawImage`-free 2D fills. In dark mode it's a faint glowing night sky; in
 * light mode it fades to a bronze celestial-blueprint grid instead.
 *
 * `isDark` is read from a ref (updated via effect) rather than closed over
 * directly, so toggling the theme doesn't need to tear down and restart the
 * animation loop.
 */
export default function useStarfieldCanvas(isDark) {
  const canvasRef = useRef(null)
  const isDarkRef = useRef(isDark)

  useEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = null
    let stars = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round((width * height) / 4200)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
      }))
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = (t) => {
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)
      const dark = isDarkRef.current
      const rgb = dark ? '243,226,174' : '154,107,62'

      if (!dark) {
        ctx.strokeStyle = 'rgba(154,107,62,0.08)'
        ctx.lineWidth = 1
        const grid = 48
        for (let x = 0; x < width; x += grid) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        for (let y = 0; y < height; y += grid) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
      }

      stars.forEach((s) => {
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.0006 * s.speed + s.phase))
        ctx.beginPath()
        ctx.fillStyle = `rgba(${rgb},${(twinkle * (dark ? 0.9 : 0.5)).toFixed(3)})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return canvasRef
}
