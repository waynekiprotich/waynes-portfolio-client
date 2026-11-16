/**
 * The WK monogram. A W drawn as one zigzag stroke beside a K built from a
 * stem and a single folded arm, all one hairline-clean weight and one colour,
 * with sharp cut ends.
 * It uses currentColor, so it takes the colour of whatever it sits in.
 * Keep the path in step with scripts/brand-assets.mjs, which draws the
 * favicons from the same geometry.
 */
export const WK_PATH = 'M3 8L6.8 24L10 12L13.2 24L17 8M21.5 8V24M28.5 8L21.5 16.5M21.5 16.5L28.5 24'

export default function WKMark({ className = 'h-8 w-8', title }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="2.5"
    >
      <path d={WK_PATH} />
    </svg>
  )
}
