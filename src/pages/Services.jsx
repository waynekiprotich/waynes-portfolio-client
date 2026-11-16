import { Link } from '@/lib/router'
import SEO from '@/components/SEO'
import { breadcrumbs } from '@/lib/schema'
import PageIntro from '@/components/PageIntro'
import { ServiceList, ProcessSteps } from '@/components/ServiceList'
import { SERVICES, SITE } from '@/data/site'

export default function Services() {
  return (
    <>
      <SEO
        title="Services"
        description="Website and web application development in Nairobi, Kenya: business websites, full-stack apps, M-Pesa e-commerce, APIs, dashboards, performance, SEO and maintenance."
        path="/services"
        schema={[
          breadcrumbs([['Services', '/services']]),
          {
            '@type': 'Service',
            serviceType: 'Web development',
            provider: { '@id': `${SITE.url}/#business` },
            areaServed: [
              { '@type': 'City', name: 'Nairobi' },
              { '@type': 'Country', name: 'Kenya' },
            ],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Web development services',
              itemListElement: SERVICES.map((s) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: s.title, description: s.body },
              })),
            },
          },
        ]}
      />

      <PageIntro
        label="Services"
        title="Websites and web apps, built end to end"
        lede="One person from the first conversation to launch and after: the database, the API, the interface and the hosting. For businesses in Kenya and teams anywhere."
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/estimator" className="btn btn-amber">
            Scope a project
          </Link>
          <Link to="/work" className="btn btn-line">
            See past work
          </Link>
        </div>
      </PageIntro>

      <section aria-labelledby="what-title" className="shell pb-20">
        <h2 id="what-title" className="sr-only">
          What I offer
        </h2>
        <ServiceList />
      </section>

      <section aria-labelledby="process-title" className="border-t border-line bg-deep">
        <div className="shell py-20 sm:py-28">
          <h2 id="process-title" className="display text-h2" data-reveal="mask">
            How a project runs
          </h2>
          <p className="mt-4 max-w-measure text-haze" data-reveal>
            Five steps, and you can see the work at every one of them.
          </p>
          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>
    </>
  )
}
