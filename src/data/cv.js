/**
 * The CV as data. It renders the /cv page, feeds the About page and the
 * structured data, and mirrors public/Wayne-Kiprotich-CV.pdf. Update both
 * together.
 */
export const PROFILE =
  'Full-stack developer working across the JavaScript/TypeScript and Python ecosystems. I build web applications, secure REST APIs and data-driven dashboards, with a keen eye for clean, high-contrast interface design. I use AI-assisted workflows to move faster, and review every line before it ships. Open to remote freelance contracts, startup roles and AI evaluation work.'

export const EXPERIENCE = [
  {
    role: 'Freelance Full-Stack Developer',
    org: 'Independent clients, remote',
    start: '2025',
    end: 'Present',
    points: [
      'Design, build and deploy custom full-stack web applications for independent clients with React and Python/Flask.',
      'Configure and maintain remote Ubuntu servers for application hosting, uptime and status logging.',
      'Turn Figma handoffs into production UI, using Model Context Protocol (MCP) tooling to keep builds pixel-accurate.',
      'Review and harden AI-generated code for accuracy, performance and security before it ships.',
      'Deliver institutional websites, technical proposal documents and promotional design assets.',
    ],
  },
]

export const CV_PROJECTS = [
  {
    name: 'StackBattle KE',
    kind: 'Full-stack',
    stack: ['Flask', 'PostgreSQL', 'SQLAlchemy', 'Marshmallow', 'JWT', 'React'],
    slug: 'stackbattle-ke',
    points: [
      'Architected a gamified competitive-programming platform for Kenyan university students, built from scratch with an app-factory pattern across 9 backend blueprints and a dedicated service layer.',
      'Implemented JWT authentication, Marshmallow-validated schemas, secured endpoints and real-time leaderboard logic.',
      'Led security audits that found and fixed hardcoded secrets, scoring exploits and blocking synchronous code execution.',
      'Rebuilt the React frontend from a single-file prototype into a scalable multi-file structure with live score tracking and code submission.',
    ],
  },
  {
    name: 'ApexGrid',
    kind: 'Data dashboard',
    stack: ['React', 'Vite', 'Flask', 'OpenF1 API', 'PostgreSQL', 'Redis'],
    slug: 'apexgrid',
    points: [
      'Built a Formula 1 analytics dashboard tracking live standings, lap times and race session data from the OpenF1 API.',
      'Designed a compact icon-rail navigation and live-timing hero, with a no-silent-failure rule for every interactive element.',
      'Moved data fetching into custom React hooks and one central formatting layer, removing render lag and timestamp errors during live updates.',
    ],
  },
  {
    name: 'Personal portfolio platform',
    kind: 'Web + API',
    stack: ['React 18', 'Vite', 'Tailwind CSS', 'Serverless API'],
    points: [
      'Designed and built this site: a 3D, prerendered React portfolio with a project-scoping wizard that delivers briefs straight to a private channel.',
      'Ran a full UX, accessibility and SEO pass: prerendered pages, structured data, a generated sitemap and per-page metadata.',
    ],
  },
]

export const ADDITIONAL_WORK = [
  'Delivered a full institutional website for Baraka School Kapsabet: a 9-route React/Vite rebuild with a reusable component library.',
  'Produced a technical proposal (WRD) document for Techlane IT Solutions.',
  'Repaired and adapted trading-bot automation logic (Deriv/Binary Bot XML, Martingale strategy) for a client engagement.',
]

export const SKILLS = [
  { group: 'Frontend', items: ['React', 'TypeScript', 'JavaScript (ES6+)', 'Vite', 'Tailwind CSS', 'HTML and CSS'] },
  { group: 'Backend', items: ['Python', 'Flask', 'REST APIs', 'JWT auth', 'Marshmallow', 'Node.js'] },
  { group: 'Data and infrastructure', items: ['PostgreSQL', 'SQLAlchemy', 'Redis', 'Prisma', 'Docker', 'Ubuntu Server'] },
  { group: 'Tools and workflow', items: ['Git and GitHub', 'Figma', 'Model Context Protocol (MCP)', 'AI-assisted development', 'Web scraping'] },
]

export const STRENGTHS = [
  'Remote collaboration',
  'Rapid problem-solving',
  'Technical communication',
  'Owning projects end to end',
  'Clean, high-contrast UI design',
]

export const EDUCATION = [
  {
    title: 'Software Engineering Program',
    org: 'Moringa School, Nairobi',
    detail: 'Full-stack web development, data structures and algorithms, Agile methods.',
  },
]
