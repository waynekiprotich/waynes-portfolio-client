import { SERVICES, PROCESS } from '@/data/site'

/** Services as rows divided by hairlines, not a grid of identical cards. */
export function ServiceList({ headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  return (
    <ul className="grid border-t border-line md:grid-cols-2 md:gap-x-12">
      {SERVICES.map(({ title, body, tags }) => (
        <li key={title} className="group border-b border-line py-8" data-reveal>
          <Heading className="display text-h3 transition-colors duration-300 group-hover:text-amber">
            {title}
          </Heading>
          <p className="mt-3 max-w-[36rem] text-haze">{body}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${title}: typical tools`}>
            {tags.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

/** The process is a real sequence, so it is an ordered, numbered list. */
export function ProcessSteps({ headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
      {PROCESS.map(({ title, body }, i) => (
        <li key={title} className="bg-night p-6" data-reveal>
          <span className="display text-[2.5rem] leading-none text-amber" aria-hidden="true">
            {i + 1}
          </span>
          <Heading className="mt-6 text-lg font-semibold text-chalk">
            <span className="sr-only">Step {i + 1}: </span>
            {title}
          </Heading>
          <p className="mt-2 text-sm text-haze">{body}</p>
        </li>
      ))}
    </ol>
  )
}
