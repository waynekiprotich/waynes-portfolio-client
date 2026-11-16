import { useState } from 'react'
import { Link } from '@/lib/router'
import SEO from '@/components/SEO'
import { breadcrumbs } from '@/lib/schema'
import PageIntro from '@/components/PageIntro'
import { SITE } from '@/data/site'

const CHANNELS = [
  { label: 'Phone', value: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
  { label: 'GitHub', value: 'github.com/waynekiprotich', href: SITE.github, external: true },
  { label: 'LinkedIn', value: 'Wayne Kiprotich', href: SITE.linkedin, external: true },
  { label: 'Instagram', value: '@mr._.w.a.y.n.e', href: SITE.instagram, external: true },
]

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      /* Clipboard blocked: the address is on screen to select. */
    }
  }

  return (
    <>
      <SEO
        title="Contact"
        description={`Contact ${SITE.name}, a full-stack software engineer in ${SITE.location}, about a website, web app or online store.`}
        path="/contact"
        schema={[
          breadcrumbs([['Contact', '/contact']]),
          { '@type': 'ContactPage', url: `${SITE.url}/contact`, mainEntity: { '@id': `${SITE.url}/#person` } },
        ]}
      />

      <PageIntro
        label="Contact"
        title="Let’s talk about your project"
        lede="Email is quickest. If you already know roughly what you need, the scoping form gets me everything I need to reply with a plan."
      />

      <section aria-label="Contact details" className="shell pb-28">
        <div className="rounded-[1.5rem] border border-line bg-deep p-6 sm:p-10">
          <p className="text-sm text-faint">Email</p>
          <a
            href={`mailto:${SITE.email}`}
            className="display mt-2 block break-all text-[clamp(1.5rem,1rem+2.6vw,3.5rem)] leading-tight transition-colors hover:text-amber"
          >
            {SITE.email}
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={`mailto:${SITE.email}`} className="btn btn-amber">
              Write an email
            </a>
            <button type="button" onClick={copy} className="btn btn-line">
              {copied ? 'Address copied' : 'Copy address'}
            </button>
            <Link to="/estimator" className="btn btn-line">
              Scope a project
            </Link>
            <span className="sr-only" aria-live="polite">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
          </div>
        </div>

        <ul className="mt-10 border-t border-line">
          {CHANNELS.map(({ label, value, href, external }) => (
            <li key={label} className="border-b border-line" data-reveal>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group grid gap-1 py-6 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-10"
              >
                <span className="text-sm text-faint">{label}</span>
                <span className="text-[clamp(1.1rem,1rem+0.8vw,1.6rem)] transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-amber motion-reduce:group-hover:translate-x-0">
                  {value}
                  {external && <span className="sr-only"> (opens in a new tab)</span>}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-haze">Based in {SITE.location}. Working with clients in Kenya and remotely anywhere.</p>
      </section>
    </>
  )
}
