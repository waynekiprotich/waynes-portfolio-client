import SEO from '@/components/SEO'
import Hero from '@/components/Hero'
import Statement from '@/components/Statement'
import SelectedWork from '@/components/work/SelectedWork'
import Capabilities from '@/components/Capabilities'
import Services from '@/components/Services'
import Process from '@/components/Process'
import AboutPreview from '@/components/AboutPreview'
import JournalPreview from '@/components/JournalPreview'
import ContactCTA from '@/components/ContactCTA'

export default function Home() {
  return (
    <>
      {/* Person, business and website structured data is static in index.html. */}
      <SEO />
      <Hero />
      <Statement />
      <SelectedWork />
      <Capabilities />
      <Services limit={4} />
      <Process />
      <AboutPreview />
      <JournalPreview />
      <ContactCTA />
    </>
  )
}
