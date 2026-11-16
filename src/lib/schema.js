import { SITE } from '@/data/site'

/** BreadcrumbList for a page `trail` of [name, path] pairs below Home. */
export const breadcrumbs = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'], ...trail].map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${SITE.url}${path}`,
  })),
})
