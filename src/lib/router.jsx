/* eslint-disable react-refresh/only-export-components -- hooks and
   components ship together here on purpose: this is one small module
   standing in for a routing library, not a component file. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { preloadRoute } from '@/lib/pages'
import { getLenis } from '@/hooks/useLenis'

/**
 * The eight pieces of routing this site actually uses.
 *
 * react-router-dom ships its data-router runtime (loaders, fetchers, deferred
 * data, form navigation) whether or not you import any of it — 54kB gzipped,
 * on a portfolio whose entire routing need is "swap a component when the path
 * changes, and read one :slug". This is that, and nothing else.
 *
 * Behaviour kept deliberately identical to what was replaced: modified and
 * middle clicks fall through to the browser, back/forward work through
 * popstate, and NavLink's `isActive` matches a section and its children.
 */

const RouterContext = createContext(null)
const ParamsContext = createContext({})

const readLocation = () => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
})

const parseUrl = (url) => {
  const { pathname, search, hash } = new URL(url, 'http://prerender.local')
  return { pathname, search, hash }
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Runs a DOM-changing update inside a view transition where the browser
 * supports it, and plainly where it does not. Focus moves to <main> once the
 * new page is in place, so keyboard and screen reader users start at the top
 * of the new content rather than on a link that no longer exists.
 */
function transition(update) {
  const done = () => document.getElementById('main')?.focus({ preventScroll: true })
  if (!document.startViewTransition || reducedMotion()) {
    update()
    done()
    return
  }
  document.startViewTransition(update).finished.finally(done)
}

const scrollToY = (y) => {
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  window.scrollTo(0, y)
}

/** `url` is for build-time prerendering, where there is no window. */
export function BrowserRouter({ url, children }) {
  const [location, setLocation] = useState(() => (url ? parseUrl(url) : readLocation()))

  // Scroll position is stored on each history entry, so Back returns to
  // where the visitor was rather than the top of the page.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

    const onPop = (event) => {
      const y = event.state?.y ?? 0
      preloadRoute(window.location.pathname)
        .catch(() => {})
        .then(() =>
          transition(() => {
            flushSync(() => setLocation(readLocation()))
            scrollToY(y)
          })
        )
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to, { replace = false } = {}) => {
    const current = window.location.pathname + window.location.search + window.location.hash
    if (to === current) return

    const target = new URL(to, window.location.href)
    window.history.replaceState({ ...window.history.state, y: window.scrollY }, '')

    // Load the next page's chunk first, so the transition's "new" snapshot
    // is the real page, not a loading state.
    preloadRoute(target.pathname)
      .catch(() => {})
      .then(() =>
        transition(() => {
          window.history[replace ? 'replaceState' : 'pushState']({ y: 0 }, '', to)
          flushSync(() => setLocation(readLocation()))
          if (target.hash) document.getElementById(target.hash.slice(1))?.scrollIntoView()
          else scrollToY(0)
        })
      )
  }, [])

  const value = useMemo(() => ({ location, navigate }), [location, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('Router hooks must be used inside <BrowserRouter>')
  return ctx
}

export const useLocation = () => useRouter().location
export const useNavigate = () => useRouter().navigate
export const useParams = () => useContext(ParamsContext)

const segments = (path) => path.replace(/\/+$/, '').split('/').filter(Boolean)

/**
 * Returns the captured params for a match, or null. `*` matches anything,
 * which is how the catch-all route works; it is matched last because Routes
 * takes the first child that matches, in source order.
 */
function matchPath(pattern, pathname) {
  if (pattern === '*') return {}

  const pat = segments(pattern)
  const actual = segments(pathname)
  if (pat.length !== actual.length) return null

  const params = {}
  for (let i = 0; i < pat.length; i += 1) {
    if (pat[i].startsWith(':')) params[pat[i].slice(1)] = decodeURIComponent(actual[i])
    else if (pat[i] !== actual[i]) return null
  }
  return params
}

export function Route() {
  // Never rendered directly — Routes reads `path`/`element` off the element.
  return null
}

export function Routes({ children }) {
  const { pathname } = useLocation()

  const matched = useMemo(() => {
    const routes = []
    // Children may be a single element, an array, or contain falsy holes.
    const visit = (node) => {
      if (Array.isArray(node)) return node.forEach(visit)
      if (node && node.props && node.props.path) routes.push(node)
    }
    visit(children)

    for (const route of routes) {
      const params = matchPath(route.props.path, pathname)
      if (params) return { element: route.props.element, params }
    }
    return null
  }, [children, pathname])

  if (!matched) return null
  return <ParamsContext.Provider value={matched.params}>{matched.element}</ParamsContext.Provider>
}

function shouldHandle(event, target) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    (!target || target === '_self')
  )
}

/** Warm the next page's chunk as soon as intent shows (hover, focus, touch). */
const warm = (to) => () => {
  preloadRoute(to.split(/[?#]/)[0]).catch(() => {})
}

export function Link({ to, replace = false, onClick, target, ...rest }) {
  const navigate = useNavigate()

  const handleClick = (event) => {
    onClick?.(event)
    if (!shouldHandle(event, target)) return
    event.preventDefault()
    navigate(to, { replace })
  }

  return (
    <a
      href={to}
      target={target}
      onPointerEnter={warm(to)}
      onFocus={warm(to)}
      onTouchStart={warm(to)}
      {...rest}
      onClick={handleClick}
    />
  )
}

/**
 * `className` may be a string or a function of `{ isActive }`. A section is
 * active on its own path and on anything beneath it, so /work stays lit on
 * /work/apexgrid.
 */
export function NavLink({ to, className, children, end = false, ...rest }) {
  const { pathname } = useLocation()
  const isActive =
    pathname === to || (!end && to !== '/' && pathname.startsWith(`${to}/`))

  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={typeof className === 'function' ? className({ isActive }) : className}
      {...rest}
    >
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  )
}

export function Navigate({ to, replace = false }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to, { replace })
  }, [navigate, to, replace])
  return null
}
