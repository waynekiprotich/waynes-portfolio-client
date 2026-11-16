import SEO from '@/components/SEO'
import { breadcrumbs } from '@/lib/schema'
import PageIntro from '@/components/PageIntro'
import posts from '@/data/blog.json'
import { SITE } from '@/data/site'

/** Notes are short, so each one is printed in full rather than behind a click. */
export default function Journal() {
  return (
    <>
      <SEO
        title="Journal"
        description="Notes on interface design, engineering and the decisions behind the projects, by Wayne Kiprotich."
        path="/journal"
        schema={[
          breadcrumbs([['Journal', '/journal']]),
          {
            '@type': 'Blog',
            name: `${SITE.name} journal`,
            url: `${SITE.url}/journal`,
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              datePublished: p.dateTime,
              url: `${SITE.url}/journal#${p.slug}`,
              author: { '@id': `${SITE.url}/#person` },
            })),
          },
        ]}
      />

      <PageIntro
        label="Journal"
        title="Notes from the build"
        lede="Short write-ups on interface work, engineering and the decisions behind the projects."
      />

      <div className="shell pb-28">
        {posts.length === 0 ? (
          <p className="text-haze">No notes published yet.</p>
        ) : (
          posts.map(({ slug, title, excerpt, category, date, dateTime, readTime, tags = [], content = [] }) => (
            <article
              key={slug}
              id={slug}
              className="grid gap-8 border-t border-line py-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12"
            >
              <header>
                <p className="text-sm text-faint">
                  <time dateTime={dateTime}>{date}</time>, {readTime}
                </p>
                <h2 className="display mt-3 text-h3 sm:text-[2rem] sm:leading-tight">{title}</h2>
                <p className="mt-3 text-sm text-haze">{category}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
                  {tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </header>
              <div className="prose-body text-lede">
                <p className="text-chalk">{excerpt}</p>
                {content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </>
  )
}
