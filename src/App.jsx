import { Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from '@/lib/router'
import { ThemeProvider } from '@/theme/ThemeProvider'
import RootLayout from '@/layouts/RootLayout'
import RouteFallback from '@/components/RouteFallback'
import Home from '@/pages/Home'
// Home is imported eagerly, not lazily: it is the landing route, so splitting
// it only buys a second network round trip before anything can paint — the
// bundle has to load, then ask for the chunk, then render. Every other route
// is one a visitor navigates *to*, by which point the fetch is free.
import {
  Work,
  CaseStudy,
  About,
  Services,
  Estimator,
  Journal,
  CV,
  Contact,
  NotFound,
} from '@/lib/pages'

/**
 * `url` and `helmetContext` are only passed by the build-time prerender
 * (src/entry-server.jsx); in the browser the router reads window.location.
 */
export default function App({ url, helmetContext }) {
  return (
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <BrowserRouter url={url}>
          <RootLayout>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<CaseStudy />} />
                {/* Legacy paths from the previous site keep working. */}
                <Route path="/projects" element={<Work />} />
                <Route path="/projects/:slug" element={<CaseStudy />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/estimator" element={<Estimator />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/blog" element={<Journal />} />
                <Route path="/cv" element={<CV />} />
                <Route path="/contact" element={<Contact />} />
                {/* Last: Routes takes the first match in source order. */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RootLayout>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}
