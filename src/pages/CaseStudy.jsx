import { Link, useParams } from '@/lib/router'
import SEO from '@/components/SEO'
import { breadcrumbs } from '@/lib/schema'
import Picture from '@/components/Picture'
import { LayerLegend } from '@/components/StackMark'
import { getProject, nextProject } from '@/data/projects'
import { SITE } from '@/data/site'
import NotFound from '@/pages/NotFound'

function Section({ title, children }) {
  return (
    <section className="grid gap-4 border-t border-line py-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12" data-reveal>
      <h2 className="display text-h3">{title}</h2>
      <div className="prose-body text-lede">{children}</div>
    </section>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound />

  const { title, year, category, summary, layers, stack, image, imageAlt, live, code, study } = project
  const next = nextProject(slug)
  const ogImage = `${SITE.url}/img/${image.name}-${image.widths[image.widths.length - 1]}.webp`

  return (
    <>
      <SEO
        title={`${title} case study`}
        description={`${title}: ${summary} Built by ${SITE.name} with ${stack.slice(0, 4).join(', ')}.`}
        path={`/work/${slug}`}
        type="article"
        image={ogImage}
        imageAlt={imageAlt}
        schema={[
          breadcrumbs([
            ['Work', '/work'],
            [title, `/work/${slug}`],
          ]),
          {
            '@type': 'CreativeWork',
            name: title,
            headline: `${title} case study`,
            description: summary,
            url: `${SITE.url}/work/${slug}`,
            image: ogImage,
            dateCreated: year,
            keywords: stack.join(', '),
            creator: { '@id': `${SITE.url}/#person` },
            ...(live ? { sameAs: live } : {}),
          },
        ]}
      />

      <article>
        <header className="shell pb-10 pt-32 sm:pt-40">
          <Link to="/work" className="link text-sm">
            All work
          </Link>
          <h1 className="display mt-6 max-w-[14ch] text-h1">{title}</h1>
          <p className="mt-6 max-w-measure text-lede text-haze" data-intro style={{ '--d': '100ms' }}>
            {summary}
          </p>

          <dl
            className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 lg:grid-cols-4"
            data-intro
            style={{ '--d': '180ms' }}
          >
            <div>
              <dt className="text-sm text-faint">Year</dt>
              <dd className="mt-1">{year}</dd>
            </div>
            <div>
              <dt className="text-sm text-faint">Type</dt>
              <dd className="mt-1">{category}</dd>
            </div>
            <div>
              <dt className="text-sm text-faint">Layers</dt>
              <dd className="mt-1">
                <LayerLegend layers={layers} />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-faint">Links</dt>
              <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {live && (
                  <a href={live} target="_blank" rel="noopener noreferrer" className="link">
                    Live site<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {code && (
                  <a href={code} target="_blank" rel="noopener noreferrer" className="link">
                    Source code<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {!live && !code && <span className="text-haze">Private repository</span>}
              </dd>
            </div>
          </dl>
        </header>

        <div className="shell">
          <div
            className="overflow-hidden rounded-[1.5rem] border border-line bg-raised"
            style={{ viewTransitionName: 'project-media' }}
          >
            <Picture
              image={image}
              alt={imageAlt}
              priority
              sizes="(min-width: 1440px) 1340px, 94vw"
              imgClassName="aspect-[16/9] w-full object-cover object-top"
            />
          </div>
        </div>

        <div className="shell py-16">
          <Section title="The problem">
            <p>{study.problem}</p>
          </Section>
          <Section title="The approach">
            <p>{study.approach}</p>
          </Section>
          <Section title="What I built">
            <ul className="space-y-3">
              {study.built.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="How it fits together">
            <p>{study.architecture}</p>
          </Section>
          <Section title="Decisions">
            <div className="space-y-8">
              {study.decisions.map(({ title: t, body }) => (
                <div key={t}>
                  <h3 className="text-lg font-semibold text-chalk">{t}</h3>
                  <p className="mt-2">{body}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Stack">
            <ul className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <li key={s} className="tag text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </article>

      <nav aria-label="Next project" className="border-t border-line">
        <Link to={`/work/${next.slug}`} className="group shell block py-20 sm:py-28">
          <span className="kicker">Next project</span>
          <span className="display stretch-hover mt-3 block text-h1 transition-colors duration-300 group-hover:text-amber">
            {next.title}
          </span>
          <span className="mt-3 block max-w-measure text-haze">{next.summary}</span>
        </Link>
      </nav>
    </>
  )
}
