/**
 * Prerenders every route into its own static HTML file, after `vite build`:
 *
 *  - the rendered page goes inside #root, so the first paint, crawlers and
 *    link unfurlers all get real content without running JavaScript;
 *  - the page's <SEO> output (title, description, canonical, Open Graph,
 *    structured data) replaces the <!--app-head--> marker in index.html;
 *  - dist/404.html is the not-found page, which Vercel serves with a real
 *    404 status for any path that has no file;
 *  - dist/sitemap.xml is generated from the same route list, so it can never
 *    drift from the pages that exist.
 *
 * main.jsx preloads the route's chunk and then replaces this markup with the
 * live app.
 */
import { createServer } from 'vite'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

const DIST = 'dist'
const MARKER = '<!--app-head-->'

// [path, sitemap priority]. Case studies are added from the data module.
const STATIC_ROUTES = [
  ['/', '1.0'],
  ['/work', '0.9'],
  ['/cv', '0.8'],
  ['/about', '0.8'],
  ['/services', '0.8'],
  ['/estimator', '0.7'],
  ['/contact', '0.6'],
  ['/journal', '0.5'],
]

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
  // react-helmet-async's `main` is CommonJS; bundling it lets Vite use its
  // ESM build.
  ssr: { noExternal: ['react-helmet-async'] },
})

try {
  const { PROJECTS } = await server.ssrLoadModule('/src/data/projects.js')
  const { SITE } = await server.ssrLoadModule('/src/data/site.js')
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx')

  let base = await readFile(path.join(DIST, 'index.html'), 'utf8')
  if (!base.includes(MARKER)) throw new Error(`${MARKER} missing from dist/index.html`)

  // Inline the stylesheet (about 8 kB gzipped). It is the only render-blocking
  // request, and every page needs all of it, so shipping it inside the HTML
  // saves a full round trip before first paint.
  const cssLink = base.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
  if (cssLink) {
    const css = await readFile(path.join(DIST, cssLink[1]), 'utf8')
    base = base.replace(cssLink[0], () => `<style>${css}</style>`)
  }

  // Paint first, then start the app. Every page is complete, readable HTML
  // with working links before any JavaScript runs, so the bundle does not
  // need to compete with first paint: a 1-line boot module asks for it on the
  // frame after the page is drawn.
  const entry = base.match(/<script type="module" crossorigin src="\/assets\/(index-[^"]+\.js)"><\/script>/)
  if (entry) {
    const boot = `boot-${entry[1].slice('index-'.length)}`
    await writeFile(
      path.join(DIST, 'assets', boot),
      `requestAnimationFrame(()=>setTimeout(()=>import('./${entry[1]}')))\n`
    )
    base = base.replace(entry[0], `<script type="module" src="/assets/${boot}"></script>`)
  }

  const page = async (route) => {
    const { html: body, helmet } = await render(route)
    const head = [helmet.title, helmet.meta, helmet.link, helmet.script]
      .map((part) => part.toString())
      .filter(Boolean)
      .join('\n    ')
    return base.replace(MARKER, head).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  }

  const routes = [
    ...STATIC_ROUTES,
    ...PROJECTS.map((p) => [`/work/${p.slug}`, '0.7']),
  ]

  for (const [route] of routes) {
    const dir = path.join(DIST, route)
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), await page(route))
  }

  await writeFile(path.join(DIST, '404.html'), await page('/404'))

  const today = new Date().toISOString().slice(0, 10)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ([route, priority]) =>
      `  <url><loc>${SITE.url}${route === '/' ? '/' : route}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap)
  await rm(path.join(DIST, 'spa.html'), { force: true })

  console.log(`prerendered ${routes.length} routes, 404.html and sitemap.xml`)
} finally {
  await server.close()
}
