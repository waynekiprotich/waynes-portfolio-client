/** Identity, links and the copy shared across pages. */
export const SITE = {
  name: 'Wayne Kiprotich',
  role: 'Full-Stack Software Engineer',
  location: 'Nairobi, Kenya',
  url: 'https://www.waynekiprotich.online',
  email: 'waynekip123@icloud.com',
  phone: '+25476870636',
  phoneDisplay: '+254 76870636',
  github: 'https://github.com/waynekiprotich',
  linkedin: 'https://linkedin.com/in/wayne-kiprotich-1a8ba6388',
  instagram:
    'https://www.instagram.com/mr._.w.a.y.n.e?igsh=MWYzcnFzbXR4eXdyOA%3D%3D&utm_source=qr',
  cv: '/Wayne-Kiprotich-CV.pdf',
  cvSize: '22 KB',
  availability: 'Taking on new projects',
}

/** Portrait image set (see scripts/images.mjs). */
export const PORTRAIT = { name: 'portrait', widths: [480, 720, 1080], width: 1080, height: 1350 }

/** Primary navigation. CV and the scoping wizard sit apart as actions. */
export const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

/**
 * The three layers of a product, top to bottom. The hero's 3D stack is these
 * three plates, and the scroll story under it walks through them in order.
 */
export const LAYERS = [
  {
    id: 'interface',
    name: 'Interface',
    title: 'What people see and touch',
    body:
      'Fast, accessible React interfaces that hold up on a mid-range phone and a slow network. Design handoffs from Figma built to the pixel, with motion that explains rather than decorates.',
    tools: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Three.js', 'Figma'],
  },
  {
    id: 'api',
    name: 'API',
    title: 'The rules in the middle',
    body:
      'REST APIs with validated input, JWT authentication and errors that say what went wrong. Route handlers stay thin; the business rules live in a service layer that can be tested on its own.',
    tools: ['Python', 'Flask', 'Node.js', 'Express', 'Marshmallow', 'JWT'],
  },
  {
    id: 'data',
    name: 'Data',
    title: 'Where the truth lives',
    body:
      'Schemas shaped around the queries they serve, caching where it pays, and the Ubuntu servers and containers that keep it all running after launch.',
    tools: ['PostgreSQL', 'SQLAlchemy', 'Redis', 'SQLite', 'Docker', 'Ubuntu Server'],
  },
]

export const SERVICES = [
  {
    title: 'Business websites',
    body: 'Built from scratch around your brand and what your customers need to do, not a template with your logo on it.',
    tags: ['React', 'SEO', 'Hosting'],
  },
  {
    title: 'Full-stack web applications',
    body: 'Database, API and interface designed together, so the product works as one system and is ready to grow.',
    tags: ['React', 'Flask', 'PostgreSQL'],
  },
  {
    title: 'E-commerce with M-Pesa',
    body: 'Online stores with guest checkout and M-Pesa payments, so Kenyan customers can pay the way they already do.',
    tags: ['M-Pesa', 'Checkout', 'Catalogue'],
  },
  {
    title: 'APIs and integrations',
    body: 'REST APIs with clear contracts and validated input, plus integrations with the payment, messaging and data services you rely on.',
    tags: ['REST', 'Auth', 'Webhooks'],
  },
  {
    title: 'Dashboards and data',
    body: 'Live dashboards that make busy data readable, with every loading, empty and error state designed rather than left to chance.',
    tags: ['Charts', 'Live data', 'Redis'],
  },
  {
    title: 'Performance, SEO and care',
    body: 'Faster pages, better search visibility, and ongoing fixes and updates once your site is live.',
    tags: ['Core Web Vitals', 'SEO', 'Maintenance'],
  },
]

/** A real sequence, so it is numbered. */
export const PROCESS = [
  { title: 'Scope', body: 'You describe the project in the scoping form or on a call. I reply with questions, a plan and a quote.' },
  { title: 'Design', body: 'Layouts and flows agreed before code, so there are no surprises in the build.' },
  { title: 'Build', body: 'Built in working slices you can click through on a live preview link as it grows.' },
  { title: 'Launch', body: 'Tested on real phones, deployed, and handed over with the access and notes you need.' },
  { title: 'Support', body: 'Fixes, updates and new features after launch, when real usage starts to teach us things.' },
]
