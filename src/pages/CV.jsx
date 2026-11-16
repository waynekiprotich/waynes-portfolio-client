import { Link } from '@/lib/router'
import SEO from '@/components/SEO'
import { breadcrumbs } from '@/lib/schema'
import { SITE } from '@/data/site'
import {
  PROFILE,
  EXPERIENCE,
  CV_PROJECTS,
  ADDITIONAL_WORK,
  SKILLS,
  STRENGTHS,
  EDUCATION,
} from '@/data/cv'

function Block({ title, children }) {
  return (
    <section className="border-t border-line pt-6">
      <h2 className="text-sm font-semibold text-amber">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Bullets({ items }) {
  return (
    <ul className="space-y-2 text-haze">
      {items.map((p) => (
        <li key={p} className="flex gap-3">
          <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-amber" aria-hidden="true" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * The CV as a real page: readable on any screen, indexable, and printable
 * (see the print styles in index.css). The PDF is one click away at the top.
 */
export default function CV() {
  return (
    <>
      <SEO
        title="CV"
        description={`CV of ${SITE.name}, ${SITE.role} in ${SITE.location}: experience, projects, skills and education. Read online or download the PDF.`}
        path="/cv"
        type="profile"
        schema={[
          breadcrumbs([['CV', '/cv']]),
          {
            '@type': 'ProfilePage',
            url: `${SITE.url}/cv`,
            mainEntity: { '@id': `${SITE.url}/#person` },
          },
        ]}
      />

      <div className="shell pb-24 pt-32 sm:pt-40">
        <div className="no-print flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker" data-intro style={{ '--d': '40ms' }}>
              Curriculum vitae
            </p>
            <h1 className="display mt-4 text-h1">{SITE.name}</h1>
            <p className="mt-3 text-lede text-haze">
              {SITE.role}, {SITE.location}
            </p>
          </div>
          <div className="flex flex-wrap gap-3" data-intro style={{ '--d': '140ms' }}>
            <a href={SITE.cv} download className="btn btn-amber">
              Download PDF ({SITE.cvSize})
            </a>
            <button type="button" onClick={() => window.print()} className="btn btn-line">
              Print
            </button>
            <Link to="/contact" className="btn btn-line">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-12 rounded-[1.5rem] border border-line bg-deep p-6 sm:p-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14 lg:p-14">
          <aside className="space-y-8" aria-label="Contact, skills and education">
            <Block title="Contact">
              <ul className="space-y-2 text-haze">
                <li>{SITE.location}</li>
                <li>
                  <a className="link" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a className="link" href={SITE.url}>
                    waynekiprotich.online
                  </a>
                </li>
                <li>
                  <a className="link" href={SITE.github} target="_blank" rel="noopener noreferrer">
                    github.com/waynekiprotich
                  </a>
                </li>
                <li>
                  <a className="link break-all" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn profile
                  </a>
                </li>
              </ul>
            </Block>

            <Block title="Technical skills">
              <div className="space-y-5">
                {SKILLS.map(({ group, items }) => (
                  <div key={group}>
                    <h3 className="font-semibold text-chalk">{group}</h3>
                    <p className="mt-1 text-sm text-haze">{items.join(', ')}</p>
                  </div>
                ))}
              </div>
            </Block>

            <Block title="Core strengths">
              <p className="text-sm text-haze">{STRENGTHS.join(', ')}.</p>
            </Block>

            <Block title="Education">
              {EDUCATION.map((e) => (
                <div key={e.title}>
                  <h3 className="font-semibold text-chalk">{e.title}</h3>
                  <p className="text-sm text-haze">{e.org}</p>
                  <p className="mt-1 text-sm text-haze">{e.detail}</p>
                </div>
              ))}
            </Block>
          </aside>

          <div className="space-y-10">
            <Block title="Profile">
              <p className="text-lede text-chalk/90">{PROFILE}</p>
            </Block>

            <Block title="Experience">
              {EXPERIENCE.map((job) => (
                <article key={job.role}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="display text-h3">{job.role}</h3>
                    <p className="text-sm text-faint">
                      {job.start} to {job.end.toLowerCase()}
                    </p>
                  </div>
                  <p className="mb-4 mt-1 text-sm text-haze">{job.org}</p>
                  <Bullets items={job.points} />
                </article>
              ))}
            </Block>

            <Block title="Technical projects">
              <div className="space-y-9">
                {CV_PROJECTS.map((p) => (
                  <article key={p.name}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="display text-h3">
                        {p.slug ? (
                          <Link to={`/work/${p.slug}`} className="hover:text-amber">
                            {p.name}
                          </Link>
                        ) : (
                          p.name
                        )}
                      </h3>
                      <span className="tag">{p.kind}</span>
                    </div>
                    <p className="mb-4 mt-2 text-sm text-faint">{p.stack.join(', ')}</p>
                    <Bullets items={p.points} />
                  </article>
                ))}
              </div>
            </Block>

            <Block title="Additional work">
              <Bullets items={ADDITIONAL_WORK} />
            </Block>
          </div>
        </div>
      </div>
    </>
  )
}
