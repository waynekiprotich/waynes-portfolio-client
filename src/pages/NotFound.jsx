import { Link } from '@/lib/router'
import SEO from '@/components/SEO'
import PageIntro from '@/components/PageIntro'

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="This page does not exist." path="/404" noindex />
      <PageIntro
        label="Error 404"
        title="This page is not here"
        lede="It may have moved, or the link may have a typo. These will get you back on track."
      >
        <div className="flex flex-wrap gap-3 pb-24">
          <Link to="/" className="btn btn-amber">
            Go to the home page
          </Link>
          <Link to="/work" className="btn btn-line">
            See the work
          </Link>
          <Link to="/cv" className="btn btn-line">
            Read the CV
          </Link>
        </div>
      </PageIntro>
    </>
  )
}
