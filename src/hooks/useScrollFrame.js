import { useEffect, useRef } from 'react'

/**
 * Calls `onFrame()` at most once per animation frame while the page scrolls
 * or resizes, plus once on mount. The callback is read from a ref, so it can
 * close over fresh values without resubscribing. Smooth scrolling (Lenis)
 * moves the real scroll position, so native scroll events cover it too.
 */
export default function useScrollFrame(onFrame, enabled = true) {
  const callback = useRef(onFrame)
  useEffect(() => {
    callback.current = onFrame
  })

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        callback.current()
      })
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [enabled])
}
