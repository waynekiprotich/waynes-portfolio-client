/**
 * Opening block for inner pages: the page's one h1, a short lede and an
 * optional row of actions. The heading reveals with a mask on load.
 */
export default function PageIntro({ label, title, lede, children }) {
  return (
    <header className="shell pb-12 pt-32 sm:pb-16 sm:pt-40">
      {label && (
        <p className="kicker" data-intro style={{ '--d': '40ms' }}>
          {label}
        </p>
      )}
      <h1 className="display mt-4 max-w-[16ch] text-h1">{title}</h1>
      {lede && (
        <p className="mt-6 max-w-measure text-lede text-haze" data-intro style={{ '--d': '120ms' }}>
          {lede}
        </p>
      )}
      {children && (
        <div className="mt-8" data-intro style={{ '--d': '200ms' }}>
          {children}
        </div>
      )}
    </header>
  )
}
