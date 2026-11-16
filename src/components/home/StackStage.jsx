import { useEffect, useRef, useState } from 'react'
import { isLowEnd } from '@/lib/device'

/**
 * Hosts the 3D stack. The CSS poster paints with the HTML and stays until the
 * WebGL scene has drawn its first frame, so there is never an empty box.
 *
 * three.js (~130 kB gzipped) loads on the visitor's first interaction, or
 * once the page has been idle for a few seconds, so it never competes with
 * first paint or the first tap. Visitors without WebGL, and low-end devices
 * or slow connections (see lib/device.js), keep the static poster and never
 * download three.js at all.
 */
const IDLE_DELAY = 6500

function canUseWebGL() {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function StackStage({ sceneRef, className = '' }) {
  const host = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    if (isLowEnd() || !canUseWebGL()) return

    let scene = null
    let cancelled = false
    let timer = 0
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll']

    const load = () => {
      events.forEach((e) => window.removeEventListener(e, load))
      clearTimeout(timer)
      if (scene || cancelled) return
      import('@/three/StackScene').then(({ createStackScene }) => {
        if (cancelled) return
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const lowPower =
          (navigator.deviceMemory && navigator.deviceMemory < 4) ||
          (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
        try {
          scene = createStackScene(el, { reduced, lowPower })
        } catch {
          return // WebGL context refused: the poster stays.
        }
        sceneRef.current = scene
        // Let scroll-driven listeners push the current position into the
        // new scene, in case the page was not at the top when it loaded.
        window.dispatchEvent(new Event('resize'))
        requestAnimationFrame(() => !cancelled && setReady(true))
      })
    }

    events.forEach((e) => window.addEventListener(e, load, { passive: true, once: true }))
    timer = setTimeout(load, IDLE_DELAY)

    return () => {
      cancelled = true
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, load))
      scene?.dispose()
      if (sceneRef.current === scene) sceneRef.current = null
    }
  }, [sceneRef])

  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <div className="stack-poster" style={{ opacity: ready ? 0 : 1 }}>
        <div className="stack-poster__tower">
          <div className="stack-poster__plate" />
          <div className="stack-poster__plate" />
          <div className="stack-poster__plate" />
        </div>
      </div>
      <div
        ref={host}
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  )
}
