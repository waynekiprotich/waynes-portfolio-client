/**
 * Pointer handlers for `.tilt` elements: the element leans toward the mouse
 * and a soft glare follows it. Values go straight to CSS variables, so there
 * is no React render per move. Touch and pen input are ignored, and so is
 * everyone who prefers reduced motion.
 */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// `target` lets a parent take the pointer events and tilt a child, for cards
// whose whole surface is covered by a link overlay.
const pick = (event, target) => (target && event.currentTarget.querySelector(target)) || event.currentTarget

export function tiltMove(event, strength = 7, target) {
  if (event.pointerType !== 'mouse' || reduced()) return
  const el = pick(event, target)
  const rect = el.getBoundingClientRect()
  // Clamped: the pointer may be over the card's text, below the image.
  const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
  el.style.setProperty('--ry', `${(x - 0.5) * strength * 2}deg`)
  el.style.setProperty('--rx', `${(0.5 - y) * strength * 2}deg`)
  el.style.setProperty('--gx', `${x * 100}%`)
  el.style.setProperty('--gy', `${y * 100}%`)
}

export function tiltLeave(event, target) {
  const el = pick(event, target)
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}

export const tiltProps = (strength, target) => ({
  onPointerMove: (e) => tiltMove(e, strength, target),
  onPointerLeave: (e) => tiltLeave(e, target),
})
