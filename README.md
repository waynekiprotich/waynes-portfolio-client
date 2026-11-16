# Wayne Kiprotich — Portfolio

Portfolio and CV of a full-stack software engineer in Nairobi. Every page is
prerendered to static HTML, then a small React app takes over for the 3D
scene, motion and page transitions.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vite build + prerender every route, 404.html, sitemap.xml
npm run preview
npm run lint
```

## Stack

React 18, Vite, Tailwind CSS 3, three.js (lazy, plain, no React renderer),
Lenis (desktop smooth scroll, lazy), react-helmet-async. Routing is ~150 lines
of local code in `src/lib/router.jsx`. There is one serverless function,
`api/estimate.js`, which forwards briefs from the scoping form to Discord.

## Design

- **Palette** comes from the CV (black, grey and gold) so the PDF and the site read
  as one identity. Tokens live in `src/styles/index.css` (`--night`, `--deep`,
  `--raised`, `--chalk`, `--haze`, `--faint`, `--amber`, `--signal`) and are
  mapped to Tailwind colours in `tailwind.config.js`. Contrast ratios for each
  text colour are noted next to the tokens; keep them at WCAG AA or better.
- **Type**: Anybody for display (one wide, heavy instance cut from the
  variable font, 8 kB), Instrument Sans for text. Both are self-hosted, subset
  (`npm run assets:fonts`) and preloaded.
- **The stack motif**: interface, API and data as three plates. It is the
  logo (`StackMark`), the 3D hero (`src/three/StackScene.js`), the scroll story
  under it, and the legend on each project card showing which layers a project
  involved.

## Where content lives

| File | Holds |
| --- | --- |
| `src/data/site.js` | Identity, links, navigation, the three layers, services, process |
| `src/data/cv.js` | The CV: profile, experience, projects, skills, education. Mirrors `public/Wayne-Kiprotich-CV.pdf`, update both together |
| `src/data/projects.js` | Every project and its case study |
| `src/data/blog.json` | Journal entries |
| `src/data/scope.js` | Options for the scoping form |

Images: put originals in `assets-source/`, list them in `scripts/images.mjs`,
run `npm run assets:images`. See `assets-source/README.md`.

## Motion

- **Hero name**: letters lean toward the pointer in 3D (transform only, so it
  never causes layout shift).
- **3D stack**: loads on the first interaction or after a few idle seconds,
  never on the critical path. A CSS poster of the same stack shows until then,
  and stays for visitors without WebGL or with Save-Data on. With reduced
  motion the scene renders without idle movement.
- **Scroll**: the stack separates and lights each layer as the story scrolls;
  the work reel pins and turns its cards in 3D on wide screens. Section
  reveals are CSS scroll-driven animations (progressive enhancement; content
  is never hidden waiting for them), and they move text without fading it, so
  contrast never drops.
- **Page transitions** use the View Transitions API; a project image morphs
  into the case-study hero.
- Everything spatial is off under `prefers-reduced-motion`.

## Low-data mode

`src/lib/device.js` flags a visitor as lite only when Save-Data is on or the
connection is 2G. Lite mode never downloads three.js (the static CSS poster
of the stack stays) and turns off backdrop blur, 3D tilt, scroll-driven
reveals and the pinned work reel. Everyone else gets the full experience; on
weaker hardware the 3D scene just lowers its particle count and pixel ratio.

## Performance and SEO

- Prerendered HTML for every route, with per-page title, description,
  canonical, Open Graph and JSON-LD (Person, ProfessionalService, WebSite,
  BreadcrumbList, CreativeWork, ProfilePage, Blog).
- CSS is inlined into each page. The app bundle starts on the frame after
  first paint (`assets/boot-*.js`), since the HTML is already complete.
- `dist/404.html` is served with a real 404 status. Legacy URLs (`/projects`,
  `/blog`) redirect permanently in `vercel.json`, which also sets the security
  headers (CSP, HSTS, frame, referrer, permissions) and cache lifetimes.
- `sitemap.xml` is generated at build time from the route list.
