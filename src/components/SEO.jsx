import { Helmet } from 'react-helmet-async'
import { SITE } from '@/data/site'

const DEFAULT_TITLE = `${SITE.name} | Full-Stack Software Engineer in Nairobi, Kenya`
const DEFAULT_DESCRIPTION =
  'Wayne Kiprotich is a full-stack software engineer in Nairobi, Kenya, building fast websites, web applications, APIs and M-Pesa e-commerce stores, from database to interface.'

/**
 * Per-page head tags. The build (scripts/prerender-meta.mjs) bakes this
 * output into each page's static HTML, so link unfurlers that never run
 * JavaScript still see the right title, description and image.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  type = 'website',
  image = `${SITE.url}/og-image.png`,
  imageAlt = `${SITE.name}, full-stack software engineer`,
  noindex = false,
  schema,
}) {
  const metaTitle = title ? `${title} | ${SITE.name}` : DEFAULT_TITLE
  const url = `${SITE.url}${path === '/' ? '/' : path}`
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : []

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', ...s })}
        </script>
      ))}
    </Helmet>
  )
}
