import { Link } from '@/lib/router'
import Picture from '@/components/Picture'
import { SITE, PORTRAIT } from '@/data/site'
import { EXPERIENCE, EDUCATION } from '@/data/cv'
import { tiltProps } from '@/lib/tilt'

const FACTS = [
  ['Based in', SITE.location],
  ['Working as', `${EXPERIENCE[0].role}, ${EXPERIENCE[0].start} to now`],
  ['Trained at', EDUCATION[0].org],
  ['Works with', 'Clients anywhere, remotely'],
]

export default function AboutBand() {
  return (
    <section aria-labelledby="about-title" className="border-t border-line bg-deep">
      <div className="shell grid gap-12 py-24 sm:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="mx-auto w-full max-w-[26rem] lg:mx-0" data-reveal="tilt">
          <div className="tilt relative overflow-hidden rounded-[1.5rem] border border-line" {...tiltProps(6)}>
            <Picture
              image={PORTRAIT}
              alt="Wayne Kiprotich in a dark quarter-zip over a shirt and tie, taking a mirror photo."
              sizes="(min-width: 1024px) 26rem, 90vw"
              imgClassName="aspect-[4/5] w-full object-cover object-[50%_20%]"
            />
            <span className="tilt-glare" aria-hidden="true" />
          </div>
        </div>

        <div className="lg:pt-6">
          <h2 id="about-title" className="display text-h2" data-reveal="mask">
            Hi, I’m Wayne.
          </h2>
          <div className="prose-body mt-8 text-lede" data-reveal>
            <p>
              I’m a full-stack software engineer in Nairobi. Since 2025 I’ve been building for
              independent clients: institutional websites, online stores, dashboards and
              competition platforms, each one from the database up.
            </p>
            <p>
              I care about the parts people never see as much as the parts they do: a schema that
              holds under load, an API that says what went wrong, and an interface that still feels
              quick on a cheap phone.
            </p>
          </div>

          <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-8 sm:grid-cols-2" data-reveal>
            {FACTS.map(([term, detail]) => (
              <div key={term}>
                <dt className="text-sm text-faint">{term}</dt>
                <dd className="mt-1 text-chalk">{detail}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/cv" className="btn btn-amber">
              Read my CV
            </Link>
            <Link to="/about" className="btn btn-line">
              More about me
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
