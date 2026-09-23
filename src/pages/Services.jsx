import SEO from '@/components/SEO'
import PageHeader from '@/components/PageHeader'
import ServicesList from '@/components/Services'
import Process from '@/components/Process'
import ContactCTA from '@/components/ContactCTA'

export default function Services() {
  return (
    <>
      <SEO
        title="Website Development Services in Nairobi, Kenya"
        description="Website and web app development in Nairobi, Kenya: business websites, e-commerce with M-Pesa, full-stack applications, APIs, SEO and maintenance. Pricing in KES."
        path="/services"
      />

      <PageHeader
        eyebrow="Services"
        title="Web development in Nairobi, Kenya"
        lede="Websites, web applications and online stores for businesses across Kenya. Most engagements combine several of the services below; scope is agreed before anything is built."
      />

      <section className="shell pb-4" aria-labelledby="services-kenya">
        <div className="shell-inner grid gap-8 border-t border-line pt-10 md:grid-cols-2 md:gap-16">
          <h2 id="services-kenya" className="text-[clamp(1.4rem,2.4vw,2rem)] font-medium tracking-tight">
            Built for how Kenyan businesses sell
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              I am a software engineer and web developer based in Nairobi. I build business
              websites, landing pages, e-commerce stores and custom web applications, from the
              database to deployment.
            </p>
            <p>
              Stores and booking flows can take payment with M-Pesa, so customers pay the way they
              already do. Quotes are in Kenyan shillings, and I work with clients in Nairobi and
              remotely anywhere in Kenya.
            </p>
          </div>
        </div>
      </section>

      <ServicesList withHeading={false} />
      <Process />
      <ContactCTA />
    </>
  )
}
