import SEO from '@/components/SEO'
import StackStory from '@/components/home/StackStory'
import WorkReel from '@/components/home/WorkReel'
import AboutBand from '@/components/home/AboutBand'
import { ServiceList, ProcessSteps } from '@/components/ServiceList'
import { Link } from '@/lib/router'

export default function Home() {
  return (
    <>
      {/* Person and WebSite structured data are static in index.html. */}
      <SEO />
      <StackStory />
      <WorkReel />
      <AboutBand />

      <section aria-labelledby="services-title" className="shell py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="services-title" className="display max-w-[14ch] text-h2" data-reveal="mask">
            What I can build for you
          </h2>
          <Link to="/services" className="btn btn-line">
            Services in detail
          </Link>
        </div>
        <div className="mt-12">
          <ServiceList />
        </div>

        <h2 className="display mt-24 text-h3 sm:text-[2rem]" data-reveal>
          How a project runs
        </h2>
        <div className="mt-8">
          <ProcessSteps />
        </div>
      </section>
    </>
  )
}
