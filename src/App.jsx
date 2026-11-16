import { Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from '@/lib/router'
import RootLayout from '@/layouts/RootLayout'
import Home from '@/pages/Home'
// Home is imported eagerly: it is the landing route, so splitting it only adds
// a round trip before anything can paint. Every other route is one a visitor
// navigates *to*, by which point the router has already preloaded it.
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
      <BrowserRouter url={url}>
        <RootLayout>
          <Suspense fallback={<div className="min-h-[100svh]" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<CaseStudy />} />
              {/* Legacy paths also redirect at the edge (vercel.json). */}
              <Route path="/projects" element={<Work />} />
              <Route path="/projects/:slug" element={<CaseStudy />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/estimator" element={<Estimator />} />
              <Route path="/scope" element={<Estimator />} />
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
    </HelmetProvider>
  )
}
