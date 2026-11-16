import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from '@/lib/router'
import { NAV, SITE } from '@/data/site'
import WKMark from '@/components/WKMark'

const icon = {
  home: 'M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z',
  work: 'M4 7h16v12H4zM9 7V5h6v2',
  cv: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  scope: 'M12 5v14M5 12h14',
  menu: 'M5 8h14M5 16h14',
}

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

/** Slides a glass "lens" under whichever item is the current page. */
function useLens(pathname) {
  const box = useRef(null)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const place = () => {
      const current = el.querySelector('[aria-current="page"]')
      if (!current) {
        el.style.setProperty('--lens-o', '0')
        return
      }
      el.style.setProperty('--lens-x', `${current.offsetLeft}px`)
      el.style.setProperty('--lens-w', `${current.offsetWidth}px`)
      el.style.setProperty('--lens-o', '1')
    }
    place()
    window.addEventListener('resize', place)
    document.fonts?.ready.then(place)
    return () => window.removeEventListener('resize', place)
  }, [pathname])
  return box
}

/**
 * Navigation as floating liquid glass. Wide screens: a pill centred at the
 * top. Phones and tablets: a dock at the bottom, in thumb reach. The CV and
 * the scoping form are always one tap away in both.
 */
export default function Header() {
  const { pathname } = useLocation()
  const sheet = useRef(null)
  const pill = useLens(pathname)
  const dock = useLens(pathname)

  useEffect(() => {
    if (sheet.current?.open) sheet.current.close()
  }, [pathname])

  const openSheet = () => sheet.current?.showModal()
  const closeSheet = () => sheet.current?.close()

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />

      {/* Wide screens: top pill */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 hidden justify-center px-4 lg:flex">
        <nav ref={pill} aria-label="Main" className="glass glass-pill lens-box pointer-events-auto flex items-center gap-1 p-1.5 pl-3">
          <Link to="/" className="mr-1 flex items-center gap-2.5 py-1 pr-3" aria-label={`${SITE.name}, home`}>
            <WKMark className="h-7 w-7" />
            <span className="display text-[0.95rem] tracking-tight">Wayne</span>
          </Link>
          <span className="lens" aria-hidden="true" />
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} className="glass-link">
              {label}
            </NavLink>
          ))}
          <span className="mx-1 h-5 w-px bg-chalk/20" aria-hidden="true" />
          <Link to="/cv" className="glass-link">CV</Link>
          <Link to="/estimator" className="btn btn-amber btn-sm ml-1 whitespace-nowrap">Scope a project</Link>
        </nav>
      </header>

      {/* Phones and tablets: bottom dock */}
      <nav
        ref={dock}
        aria-label="Main"
        className="glass glass-dock lens-box fixed inset-x-3 z-50 flex items-stretch justify-between p-1.5 lg:hidden"
        style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <span className="lens" aria-hidden="true" />
        <NavLink to="/" end className="dock-item">
          <Icon d={icon.home} />
          Home
        </NavLink>
        <NavLink to="/work" className="dock-item">
          <Icon d={icon.work} />
          Work
        </NavLink>
        <NavLink to="/cv" className="dock-item">
          <Icon d={icon.cv} />
          CV
        </NavLink>
        <NavLink to="/estimator" className="dock-item dock-item-cta">
          <Icon d={icon.scope} />
          Scope
        </NavLink>
        <button type="button" onClick={openSheet} className="dock-item" aria-haspopup="dialog" aria-controls="site-menu">
          <Icon d={icon.menu} />
          Menu
        </button>
      </nav>

      <dialog ref={sheet} id="site-menu" className="menu-sheet" aria-label="Menu" onClick={(e) => e.target === e.currentTarget && closeSheet()}>
        <div className="shell flex min-h-full flex-col pb-8">
          <div className="flex h-[var(--header-h)] items-center justify-between">
            <WKMark className="h-8 w-8" />
            <button type="button" onClick={closeSheet} className="btn btn-line btn-sm">Close</button>
          </div>
          <nav aria-label="Menu" className="mt-6">
            <ul className="space-y-1">
              {[{ to: '/', label: 'Home' }, ...NAV].map(({ to, label }, i) => (
                <li key={to} className="menu-item" style={{ '--i': i }}>
                  <NavLink to={to} end={to === '/'} onClick={closeSheet} className="display block py-2 text-[2.6rem] leading-none text-chalk/85 aria-[current=page]:text-amber">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu-item mt-auto grid gap-3 pt-10" style={{ '--i': NAV.length + 1 }}>
            <Link to="/estimator" onClick={closeSheet} className="btn btn-amber">Scope a project</Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/cv" onClick={closeSheet} className="btn btn-line">Read CV</Link>
              <a href={SITE.cv} download className="btn btn-line">Download PDF</a>
            </div>
            <a href={`mailto:${SITE.email}`} className="mt-2 text-center text-sm text-haze">{SITE.email}</a>
          </div>
        </div>
      </dialog>
    </>
  )
}
