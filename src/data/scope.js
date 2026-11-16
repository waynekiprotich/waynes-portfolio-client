/** Options for the project scoping wizard (/estimator). */
export const PROJECT_TYPES = [
  'Business website',
  'Landing page',
  'Portfolio website',
  'E-commerce store',
  'Web application',
  'Dashboard',
  'SaaS platform',
  'Mobile app',
  'Something else',
]

export const TIMELINES = ['As soon as possible', 'Within 1 month', 'Within 2 months', '3 months or more', 'Flexible']

export const BUDGETS = [
  'Under KES 10,000',
  'KES 10,000 to 30,000',
  'KES 30,000 to 100,000',
  'KES 100,000 to 250,000',
  'KES 250,000 or more',
  'Not sure yet',
]

export const STEPS = [
  { id: 'type', title: 'Project type' },
  { id: 'brief', title: 'Brief' },
  { id: 'plan', title: 'Timeline and budget' },
  { id: 'contact', title: 'Your details' },
]

export const EMPTY_BRIEF = {
  projectType: '',
  description: '',
  timeline: '',
  budget: '',
  name: '',
  email: '',
  phone: '',
}
