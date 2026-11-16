import { useRef } from 'react'
import { Link } from '@/lib/router'
import { LAYERS, SITE } from '@/data/site'
import useScrollFrame from '@/hooks/useScrollFrame'
import StackStage from '@/components/home/StackStage'

const NAME = ['Wayne', 'Kiprotich']
const clamp01 = (v) => Math.min(1, Math.max(0, v))

/**
 * Home opening: the hero, then the same 3D stack taken apart one layer at a
 * time as the visitor scrolls. The stage is sticky for the whole section;
 * the text scrolls over it.
 */
export default function StackStory() {
  const hero = useRef(null)
  const heroInner = useRef(null)
  const name = useRef(null)
  const steps = useRef([])
  const scene = useRef(null)

  useScrollFrame(() => {
    const heroEl = hero.current
    if (!heroEl) return
    const vh = window.innerHeight
    const mid = vh / 2

    // Reads first…
    const h = heroEl.getBoundingClientRect()
    const centers = steps.current.map((el) => {
      const r = el.getBoundingClientRect()
      return r.top + r.height / 2
    })

    const explode = clamp01(-h.top / (h.height * 0.8))
    const heroMid = h.top + h.height / 2
    let focus = 2
    if (mid <= centers[0]) {
      focus = -1 + clamp01((mid - heroMid) / (centers[0] - heroMid))
    } else {
      for (let i = 0; i < centers.length - 1; i += 1) {
        if (mid < centers[i + 1]) {
          focus = i + (mid - centers[i]) / (centers[i + 1] - centers[i])
          break
        }
      }
    }

    // …then writes.
    scene.current?.setScroll({ explode, focus })
    const active = focus < -0.4 ? -1 : Math.round(focus)
    steps.current.forEach((el, i) => {
      el.dataset.active = String(active === i)
    })
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && heroInner.current) {
      heroInner.current.style.transform = `translate3d(0, ${Math.min(0, h.top) * -0.3}px, 0)`
      heroInner.current.style.opacity = String(1 - explode * 0.9)
    }
  })

  // Letters lean toward the pointer in 3D. Transform only: nothing around
  // the name moves, so it never registers as a layout shift.
  const onNameMove = (e) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const letters = name.current?.querySelectorAll('[data-letter]')
    if (!letters) return
    const rects = Array.from(letters, (l) => l.getBoundingClientRect())
    rects.forEach((r, i) => {
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const near = clamp01(1 - Math.hypot(dx, dy) / 260)
      const el = letters[i]
      el.style.setProperty('--ly', `${-near * 18}px`)
      el.style.setProperty('--lr', `${(dx / 260) * near * -28}deg`)
      el.style.setProperty('--lc', String(near))
    })
  }
  const onNameLeave = () => {
    name.current?.querySelectorAll('[data-letter]').forEach((el) => {
      el.style.setProperty('--ly', '0px')
      el.style.setProperty('--lr', '0deg')
      el.style.setProperty('--lc', '0')
    })
  }

  return (
    <section className="relative" aria-labelledby="hero-name">
      {/* Sticky stage. The hero pulls itself up over it with a negative top
          margin, so the stage keeps its full height and stops sticking
          exactly when the last layer has scrolled past. */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 55% at 72% 42%, rgb(var(--raised) / 0.9), transparent 70%), radial-gradient(40% 40% at 20% 90%, rgb(var(--amber) / 0.08), transparent 70%)',
          }}
          aria-hidden="true"
        />
        <StackStage
          sceneRef={scene}
          className="absolute inset-x-0 top-[4%] h-[56%] sm:top-0 sm:h-[64%] lg:inset-y-0 lg:left-[34%] lg:right-0 lg:h-full"
        />
      </div>

      {/* Hero */}
      <div ref={hero} className="relative -mt-[100svh]">
        <div
          ref={heroInner}
          className="shell flex min-h-[100svh] flex-col justify-end pb-12 pt-28 sm:pb-16 lg:pb-20"
        >
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-haze" data-intro style={{ '--d': '80ms' }}>
            <span>Full-stack software engineer in {SITE.location}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-night/60 px-3 py-1 text-chalk">
              <span className="h-2 w-2 rounded-full bg-amber" aria-hidden="true" />
              {SITE.availability}
            </span>
          </p>

          <h1
            id="hero-name"
            ref={name}
            onPointerMove={onNameMove}
            onPointerLeave={onNameLeave}
            className="display mt-5 text-name [perspective:800px]"
          >
            <span className="sr-only">{SITE.name}</span>
            {NAME.map((word) => (
              <span key={word} className="name-word" aria-hidden="true">
                {Array.from(word).map((ch, i) => (
                    <span
                      key={i}
                      data-letter
                      className="inline-block"
                      style={{
                        transform: 'translate3d(0, var(--ly, 0px), 0) rotateY(var(--lr, 0deg))',
                        color: 'color-mix(in srgb, rgb(var(--chalk)), rgb(var(--amber)) calc(var(--lc, 0) * 100%))',
                        transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1), color 300ms ease',
                      }}
                    >
                      {ch}
                    </span>
                ))}
              </span>
            ))}
          </h1>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-end">
            <p className="text-lede text-chalk/90" data-intro style={{ '--d': '180ms' }}>
              I build the database, the API and the interface, and make all three hold up when real
              people use them.
            </p>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end" data-intro style={{ '--d': '260ms' }}>
              <Link to="/work" className="btn btn-amber">
                See the work
              </Link>
              <Link to="/estimator" className="btn btn-line">
                Scope a project
              </Link>
              <a href={SITE.cv} download className="link ml-1 text-[0.9375rem]">
                Download CV <span className="text-haze">(PDF, {SITE.cvSize})</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* The layers */}
      <div className="relative">
        <div className="shell pb-[12svh] pt-[14svh]">
          <h2 className="display max-w-[12ch] text-h2" data-reveal="mask">
            One engineer, the whole stack.
          </h2>
          <p className="mt-6 max-w-[30rem] text-lede text-haze" data-reveal>
            Most products break in the gaps between layers. I build all three, so there are fewer
            gaps to fall through.
          </p>
        </div>

        <ol className="shell">
          {LAYERS.map((layer, i) => (
            <li
              key={layer.id}
              ref={(el) => {
                steps.current[i] = el
              }}
              className="layer-step flex min-h-[92svh] items-end pb-[8svh] lg:items-center lg:pb-0"
            >
              <article className="max-w-[31rem] rounded-2xl border border-line bg-night/80 p-6 backdrop-blur-md sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                <p className="kicker">
                  Layer {i + 1} of {LAYERS.length}
                </p>
                <h3 className="display mt-2 text-h2">{layer.name}</h3>
                <p className="mt-4 text-lede text-chalk">{layer.title}</p>
                <p className="mt-3 text-haze">{layer.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${layer.name} tools`}>
                  {layer.tools.map((tool) => (
                    <li key={tool} className="tag">
                      {tool}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
