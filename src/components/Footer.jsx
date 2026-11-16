import { Link } from '@/lib/router'
import { NAV, SITE } from '@/data/site'
import WKMark from '@/components/WKMark'

const ELSEWHERE = [
  { href: SITE.github, label: 'GitHub' },
  { href: SITE.linkedin, label: 'LinkedIn' },
  { href: SITE.instagram, label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden border-t border-line bg-deep">
      <div className="shell pb-10 pt-20 sm:pt-28">
        <h2 className="display max-w-[14ch] text-h1" data-reveal="mask">
          Have something to build?
        </h2>
        <p className="mt-6 max-w-measure text-lede text-haze">
          Tell me about it in the scoping form. It takes about three minutes, and nothing is sent
          until you press Send brief.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/estimator" className="btn btn-amber">
            Scope a project
          </Link>
          <a href={`mailto:${SITE.email}`} className="btn btn-line">
            Email me
          </a>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 rounded-lg" aria-label={`${SITE.name}, home`}>
              <WKMark className="h-9 w-9" />
              <span className="display text-lg">Wayne Kiprotich</span>
            </Link>
            <p className="mt-4 text-sm text-haze">
              {SITE.role}
              <br />
              {SITE.location}
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-sm font-semibold text-chalk">Pages</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-haze transition-colors hover:text-chalk">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-chalk">CV and contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/cv" className="text-haze transition-colors hover:text-chalk">
                  Read the CV
                </Link>
              </li>
              <li>
                <a href={SITE.cv} download className="text-haze transition-colors hover:text-chalk">
                  Download CV (PDF, {SITE.cvSize})
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="text-haze transition-colors hover:text-chalk">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phone}`} className="text-haze transition-colors hover:text-chalk">
                  {SITE.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-chalk">Elsewhere</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {ELSEWHERE.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-haze transition-colors hover:text-chalk">
                    {label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-14 text-xs text-faint">
          © {new Date().getFullYear()} {SITE.name}. Designed and built in Nairobi with React and three.js.
        </p>
      </div>
    </footer>
  )
}
