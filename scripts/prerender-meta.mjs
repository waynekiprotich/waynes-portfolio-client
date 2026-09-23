/**
 * Writes a per-route copy of the built index.html with that route's rendered
 * page HTML inside #root, and its real <title>, description, canonical and
 * og/twitter tags baked into the head.
 *
 * Why the head: react-helmet-async sets those tags after React runs. Google
 * executes JS and sees them, but link unfurlers — Slack, iMessage, WhatsApp,
 * LinkedIn, Twitter — do not.
 *
 * Why the body: without it every page is an empty <div id="root"> until the
 * bundle runs, so crawlers only see content if they execute JavaScript, and
 * visitors see nothing until it loads. main.jsx preloads the route's chunk and
 * then replaces this markup with the live app.
 *
 * Vercel checks the filesystem before applying a rewrite, so
 * dist/work/apexgrid/index.html wins for /work/apexgrid. Paths with no
 * prerendered file fall through to dist/spa.html, which keeps an empty root.
 *
 * Titles and descriptions come from the Helmet output of the render itself,
 * so they cannot drift from what each page passes to <SEO>.
 */
import { createServer } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const DIST = 'dist'

// Static routes. Case-study routes are added from the data module below.
const STATIC_ROUTES = ['/', '/work', '/about', '/services', '/estimator', '/journal', '/cv', '/contact']

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Replace the content of a meta tag matched by attribute, if present. */
function setMeta(html, attr, name, content) {
  const pattern = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`, 'i')
  return html.replace(pattern, `$1${escapeHtml(content)}$2`)
}

function buildHtml(base, { title, description, url, image }) {
  let html = base.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/i,
    `$1${escapeHtml(url)}$2`
  )
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'name', 'twitter:title', title)
  if (description) {
    html = setMeta(html, 'name', 'description', description)
    html = setMeta(html, 'property', 'og:description', description)
    html = setMeta(html, 'name', 'twitter:description', description)
  }
  if (image) {
    html = setMeta(html, 'property', 'og:image', image)
    html = setMeta(html, 'name', 'twitter:image', image)
  }
  return html
}

const decodeHtml = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

/** Text of the first tag in a Helmet tag string, e.g. `<title data-rh>…</title>`. */
const tagText = (tags) => decodeHtml(tags.replace(/<[^>]+>/g, ''))

/** `content` of the Helmet meta tag with the given name/property, if any. */
function helmetMeta(tags, attr, name) {
  const match = tags.match(new RegExp(`<meta[^>]*\\s${attr}="${name}"[^>]*\\scontent="([^"]*)"`, 'i'))
  return match ? decodeHtml(match[1]) : undefined
}

// Vite resolves the `@/` alias, JSX and the JSON imports for us, so pages are
// rendered from exactly the modules the browser runs.
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
  // react-helmet-async's `main` is CommonJS, whose named exports Node cannot
  // hand to an ESM import. Bundling it lets Vite use its `module` (ESM) build.
  ssr: { noExternal: ['react-helmet-async'] },
})
const { caseStudies } = await server.ssrLoadModule('/src/data/work.js')
const { SITE } = await server.ssrLoadModule('/src/data/site.js')
const { render } = await server.ssrLoadModule('/src/entry-server.jsx')

const base = await readFile(path.join(DIST, 'index.html'), 'utf8')

// Fallback for paths with no prerendered file (see vercel.json): an empty root,
// so an unknown URL never serves the home page's content under its address.
await writeFile(path.join(DIST, 'spa.html'), base)

const routes = [...STATIC_ROUTES, ...caseStudies.map((study) => `/work/${study.slug}`)]

try {
  for (const route of routes) {
    const { html: body, helmet } = await render(route)
    const meta = helmet.meta.toString()

    let html = buildHtml(base, {
      title: tagText(helmet.title.toString()),
      description: helmetMeta(meta, 'name', 'description'),
      url: `${SITE.url}${route}`,
      image: helmetMeta(meta, 'property', 'og:image'),
    })
    // Page-level structured data (e.g. ProfilePage on /about).
    html = html.replace('</head>', `${helmet.script.toString()}\n  </head>`)
    html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)

    const dir = path.join(DIST, route)
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), html)
  }
} finally {
  await server.close()
}

console.log(`prerendered ${routes.length} routes`)
