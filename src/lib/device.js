/**
 * Whether to switch off the heavy parts of the site (WebGL, backdrop blur,
 * scroll-driven 3D, animation). Deliberately narrow: only when the visitor
 * has asked for less data (Save-Data) or is on a 2G connection, where
 * three.js would take minutes to arrive. Ordinary phones, laptops and 3G
 * keep the full experience; the 3D scene loads late and lowers its own
 * particle count and pixel ratio on weaker hardware (see StackStage).
 *
 * Lite mode keeps every piece of content and every link. main.jsx writes the
 * result to <html data-lite>, which the stylesheet reads.
 */
export function isLowEnd() {
  if (typeof navigator === 'undefined') return false
  const c = navigator.connection
  if (c?.saveData) return true
  if (c?.effectiveType && /^(slow-2g|2g)$/.test(c.effectiveType)) return true
  return false
}
