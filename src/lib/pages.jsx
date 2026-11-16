import { lazy, useState } from 'react'

/**
 * A lazily loaded page that can also be loaded ahead of time.
 *
 * The build prerenders every route's HTML. If the client then rendered a plain
 * `lazy()` page, it would replace that HTML with the Suspense fallback until
 * the chunk arrived. Preloading the current route first, and rendering the
 * loaded module directly once it exists, swaps the prerendered markup straight
 * for the live page. The router also preloads before each navigation, so view
 * transitions snapshot the real next page.
 */
function page(load) {
  let Loaded = null
  let pending = null
  const run = () => {
    pending ??= load().then((mod) => {
      Loaded = mod.default
      return mod
    })
    return pending
  }
  const Lazy = lazy(run)

  function Page(props) {
    // Chosen once per mount, so a page never switches component type (and
    // loses its state) when its chunk finishes loading in the background.
    const [Component] = useState(() => Loaded ?? Lazy)
    return <Component {...props} />
  }

  Page.preload = run
  return Page
}

export const Work = page(() => import('@/pages/Work'))
export const CaseStudy = page(() => import('@/pages/CaseStudy'))
export const About = page(() => import('@/pages/About'))
export const Services = page(() => import('@/pages/Services'))
export const Estimator = page(() => import('@/pages/Estimator'))
export const Journal = page(() => import('@/pages/Journal'))
export const CV = page(() => import('@/pages/CV'))
export const Contact = page(() => import('@/pages/Contact'))
export const NotFound = page(() => import('@/pages/NotFound'))

// Mirrors the <Route> table in App.jsx. Home is bundled eagerly and needs no entry.
const PRELOADS = [
  [/^\/(work|projects)\/?$/, Work],
  [/^\/(work|projects)\/[^/]+\/?$/, CaseStudy],
  [/^\/about\/?$/, About],
  [/^\/services\/?$/, Services],
  [/^\/(estimator|scope)\/?$/, Estimator],
  [/^\/(journal|blog)\/?$/, Journal],
  [/^\/cv\/?$/, CV],
  [/^\/contact\/?$/, Contact],
]

export function preloadRoute(pathname) {
  if (pathname === '/' || pathname === '') return Promise.resolve()
  const match = PRELOADS.find(([pattern]) => pattern.test(pathname))
  return (match ? match[1] : NotFound).preload()
}
