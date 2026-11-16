import { Link } from '@/lib/router'
import SEO from '@/components/SEO'
import { breadcrumbs } from '@/lib/schema'
import Picture from '@/components/Picture'
import { SITE, PORTRAIT } from '@/data/site'
import { EXPERIENCE, EDUCATION, SKILLS, STRENGTHS, ADDITIONAL_WORK } from '@/data/cv'
import { tiltProps } from '@/lib/tilt'

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="About Wayne Kiprotich, a full-stack software engineer in Nairobi, Kenya: experience, skills, education and how he works with clients."
        path="/about"
        type="profile"
        schema={[
          breadcrumbs([['About', '/about']]),
          {
            '@type': 'ProfilePage',
            url: `${SITE.url}/about`,
            mainEntity: { '@id': `${SITE.url}/#person` },
          },
        ]}
      />

      <div className="shell grid gap-12 pb-20 pt-32 sm:pt-40 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <header>
          <p className="kicker" data-intro style={{ '--d': '40ms' }}>
            About
          </p>
          <h1 className="display mt-4 max-w-[14ch] text-h1">
            I build software that holds up in real use.
          </h1>
          <div className="prose-body mt-8 text-lede" data-intro style={{ '--d': '140ms' }}>
            <p>
              I’m Wayne Kiprotich, a full-stack software engineer. I build web applications, secure
              REST APIs and data-driven dashboards across the JavaScript, TypeScript and Python
              ecosystems.
            </p>
            <p>
              I trained in software engineering at Moringa School and have freelanced since 2025,
              working remotely with independent clients on everything from a school’s website to
              competition platforms and online stores.
            </p>
            <p>
              I use AI-assisted tools to move faster, and I review and harden every line they
              produce before it ships. Speed is only useful if the result is correct.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3" data-intro style={{ '--d': '220ms' }}>
            <Link to="/cv" className="btn btn-amber">
              Read my CV
            </Link>
            <a href={SITE.cv} download className="btn btn-line">
              Download PDF ({SITE.cvSize})
            </a>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[28rem] lg:mx-0 lg:pt-10">
          <div className="tilt relative overflow-hidden rounded-[1.5rem] border border-line" {...tiltProps(6)}>
            <Picture
              image={PORTRAIT}
              alt="Wayne Kiprotich in a dark quarter-zip over a shirt and tie, taking a mirror photo."
              priority
              sizes="(min-width: 1024px) 28rem, 90vw"
              imgClassName="aspect-[4/5] w-full object-cover object-[50%_20%]"
            />
            <span className="tilt-glare" aria-hidden="true" />
          </div>
        </div>
      </div>

      <section aria-labelledby="experience-title" className="border-t border-line bg-deep">
        <div className="shell grid gap-10 py-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
          <h2 id="experience-title" className="display text-h2" data-reveal="mask">
            Experience
          </h2>
          <div className="space-y-12">
            {EXPERIENCE.map((job) => (
              <article key={job.role} data-reveal>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="display text-h3">{job.role}</h3>
                  <p className="text-sm text-faint">
                    {job.start} to {job.end.toLowerCase()}
                  </p>
                </div>
                <p className="mt-1 text-haze">{job.org}</p>
                <ul className="mt-6 space-y-3 text-haze">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <article data-reveal>
              <h3 className="display text-h3">Other client work</h3>
              <ul className="mt-6 space-y-3 text-haze">
                {ADDITIONAL_WORK.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="skills-title" className="shell grid gap-10 py-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        <h2 id="skills-title" className="display text-h2" data-reveal="mask">
          Skills
        </h2>
        <div className="grid gap-10 sm:grid-cols-2">
          {SKILLS.map(({ group, items }) => (
            <div key={group} data-reveal>
              <h3 className="font-semibold text-chalk">{group}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((i) => (
                  <li key={i} className="tag">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div data-reveal>
            <h3 className="font-semibold text-chalk">Strengths</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {STRENGTHS.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <h3 className="font-semibold text-chalk">Education</h3>
            {EDUCATION.map((e) => (
              <p key={e.title} className="mt-4 text-haze">
                <span className="text-chalk">{e.title}</span>, {e.org}. {e.detail}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
