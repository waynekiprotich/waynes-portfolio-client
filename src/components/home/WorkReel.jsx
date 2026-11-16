import { useEffect, useRef, useState } from 'react'
import { Link } from '@/lib/router'
import { PROJECTS } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard'
import useScrollFrame from '@/hooks/useScrollFrame'

const PIN_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/**
 * Selected work. On wide screens with motion allowed, vertical scroll drives
 * a horizontal track and each card turns in 3D as it passes the centre. Below
 * that, or with reduced motion, it is a plain responsive grid: the same DOM,
 * styled by CSS, so nothing depends on JavaScript to be readable.
 */
export default function WorkReel() {
  const section = useRef(null)
  const stage = useRef(null)
  const track = useRef(null)
  const metrics = useRef({ distance: 0, cards: [], width: 0 })
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY)
    const update = () => setPinned(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Measure on layout changes only; the scroll frame below does no reads
  // except one rect.
  useEffect(() => {
    const sec = section.current
    const st = stage.current
    const tr = track.current
    if (!sec || !st || !tr) return
    if (!pinned) {
      sec.style.height = ''
      tr.style.transform = ''
      Array.from(tr.children).forEach((c) => (c.style.transform = ''))
      return
    }
    const measure = () => {
      const width = st.clientWidth
      const distance = Math.max(0, tr.scrollWidth - width)
      metrics.current = {
        width,
        distance,
        cards: Array.from(tr.children, (c) => ({ el: c, center: c.offsetLeft + c.offsetWidth / 2 })),
      }
      sec.style.height = `${window.innerHeight + distance}px`
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(st)
    ro.observe(tr)
    return () => ro.disconnect()
  }, [pinned])

  useScrollFrame(() => {
    const { distance, cards, width } = metrics.current
    if (!distance) return
    const top = section.current.getBoundingClientRect().top
    const x = clamp(-top, 0, distance)
    track.current.style.transform = `translate3d(${-x}px, 0, 0)`
    cards.forEach(({ el, center }) => {
      const d = clamp((center - x - width / 2) / (width * 0.65), -1.4, 1.4)
      el.style.transform = `perspective(1400px) rotateY(${d * -16}deg) translateZ(${-Math.abs(d) * 90}px)`
    })
  }, pinned)

  // Keyboard users tabbing through the track: scroll the page so the
  // focused card is centred, instead of letting the browser scroll the
  // clipped stage sideways.
  const onFocus = (e) => {
    if (!pinned) return
    stage.current.scrollLeft = 0
    const card = e.target.closest('[data-reel-item]')
    const item = metrics.current.cards.find((c) => c.el === card)
    if (!item) return
    const { distance, width } = metrics.current
    const x = clamp(item.center - width / 2, 0, distance)
    const sectionTop = section.current.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: sectionTop + x, behavior: 'instant' })
  }

  return (
    <section ref={section} aria-labelledby="work-title" className="relative">
      <div
        ref={stage}
        onFocus={onFocus}
        className="py-24 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-[100svh] lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:overflow-hidden lg:motion-safe:pb-0 lg:motion-safe:pt-[var(--header-h)]"
      >
        <div className="shell flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="work-title" className="display text-h2" data-reveal="mask">
              Selected work
            </h2>
            <p className="mt-4 max-w-[34rem] text-haze">
              From a 3D travel guide to an M-Pesa checkout. Each card shows which layers of the
              stack I built.
            </p>
          </div>
          <Link to="/work" className="btn btn-line">
            All projects
          </Link>
        </div>

        <ul
          ref={track}
          className="shell mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:motion-safe:mt-10 lg:motion-safe:flex lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:gap-12 lg:motion-safe:pr-[30vw]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {PROJECTS.map((project) => (
            <li
              key={project.slug}
              data-reel-item
              className="reel-item"
              style={{ transformOrigin: '50% 50%' }}
            >
              <ProjectCard
                project={project}
                sizes="(min-width: 1024px) 46vw, (min-width: 768px) 50vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
