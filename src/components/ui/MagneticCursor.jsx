import useMagneticCursor from '../../hooks/useMagneticCursor'

/**
 * Custom magnetic cursor + ambient particle trail. Renders nothing on
 * touch-only devices (`pointer: fine` fails the media query check inside the
 * hook). Mount once near the app root, outside <Routes>, so it persists
 * across navigation.
 */
export default function MagneticCursor() {
  const { enabled, cursorState, dotRef, ringRef, canvasRef } = useMagneticCursor()

  if (!enabled) return null

  return (
    <div className="magnetic-cursor" aria-hidden="true">
      <canvas ref={canvasRef} className="magnetic-cursor-canvas" />
      <div ref={ringRef} className="cursor-ring" data-state={cursorState} />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
