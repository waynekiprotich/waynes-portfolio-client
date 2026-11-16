import { useEffect } from 'react'

let lenisInstance = null
export const getLenis = () => lenisInstance

/**
 * Smooth wheel scrolling on desktop. Loaded on demand, and skipped for
 * reduced motion and touch input, which keeps native mobile momentum, anchor
 * jumps and keyboard scrolling exactly as the platform does them.
 */
export default function useLenis() {
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || coarse) return

    let lenis = null
    let frame = 0
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenisInstance = lenis
      document.documentElement.classList.add('lenis')
      const raf = (time) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      lenis?.destroy()
      lenisInstance = null
      document.documentElement.classList.remove('lenis')
    }
  }, [])
}
