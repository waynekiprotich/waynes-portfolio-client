import SEO from '@/components/SEO'
import { breadcrumbs } from '@/lib/schema'
import PageIntro from '@/components/PageIntro'
import ProjectCard from '@/components/ProjectCard'
import { PROJECTS } from '@/data/projects'
import { SITE } from '@/data/site'

export default function Work() {
  const [first, ...rest] = PROJECTS

  return (
    <>
      <SEO
        title="Work"
        description="Projects by Wayne Kiprotich: a 3D Nairobi travel guide, a Formula 1 dashboard, an M-Pesa clothing store and two competitive programming platforms, with case studies."
        path="/work"
        schema={[
          breadcrumbs([['Work', '/work']]),
          {
            '@type': 'CollectionPage',
            name: `Work by ${SITE.name}`,
            url: `${SITE.url}/work`,
            hasPart: PROJECTS.map((p) => ({
              '@type': 'CreativeWork',
              name: p.title,
              url: `${SITE.url}/work/${p.slug}`,
            })),
          },
        ]}
      />

      <PageIntro
        label={`${PROJECTS.length} projects`}
        title="Work"
        lede="Products I designed and built, front to back. Each one has a short case study: the problem, what I built and the decisions that shaped it."
      />

      <section aria-label="Projects" className="shell pb-28">
        <ProjectCard
          project={first}
          priority
          headingLevel={2}
          sizes="(min-width: 1440px) 1340px, 94vw"
          className="mb-20"
        />
        <ul className="grid gap-x-10 gap-y-20 md:grid-cols-2">
          {rest.map((project) => (
            <li key={project.slug} data-reveal="tilt">
              <ProjectCard
                project={project}
                headingLevel={2}
                sizes="(min-width: 768px) 46vw, 94vw"
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
