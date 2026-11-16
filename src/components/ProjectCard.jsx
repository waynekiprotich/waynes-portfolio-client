import { Link } from '@/lib/router'
import Picture from '@/components/Picture'
import { LayerLegend } from '@/components/StackMark'
import { tiltProps } from '@/lib/tilt'

/**
 * Marks this card's image as the element that morphs into the case-study
 * hero during the view transition. Only for plain left clicks the router
 * will handle; any stale name from an earlier click is cleared first, since
 * two elements sharing a name cancel the transition.
 */
function claimTransition(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  document.querySelectorAll('[data-vt-media]').forEach((el) => (el.style.viewTransitionName = ''))
  const media = event.currentTarget.closest('[data-card]')?.querySelector('[data-vt-media]')
  if (media) media.style.viewTransitionName = 'project-media'
}

export default function ProjectCard({ project, sizes, priority = false, headingLevel = 3, className = '' }) {
  const { slug, title, year, category, summary, layers, image, imageAlt } = project
  const Heading = `h${headingLevel}`

  return (
    <article data-card className={`group relative ${className}`} {...tiltProps(5, '.tilt')}>
      <div className="tilt relative overflow-hidden rounded-[1.25rem] border border-line bg-raised media-zoom">
        <div data-vt-media className="aspect-[16/9]">
          <Picture
            image={image}
            alt={imageAlt}
            sizes={sizes}
            priority={priority}
            imgClassName="h-full w-full object-cover object-top"
          />
        </div>
        <span className="tilt-glare" aria-hidden="true" />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <Heading className="display text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] leading-none">
          <Link
            to={`/work/${slug}`}
            onClick={claimTransition}
            className="stretch-hover inline-block rounded after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </Heading>
        <span className="shrink-0 text-sm text-faint">{year}</span>
      </div>
      <p className="mt-1 text-sm text-faint">{category}</p>
      <p className="mt-3 max-w-[40ch] text-haze">{summary}</p>
      <div className="mt-4">
        <LayerLegend layers={layers} />
      </div>
    </article>
  )
}
