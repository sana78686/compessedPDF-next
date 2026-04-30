import Link from 'next/link'
import { getTranslation, langPrefix } from '@/i18n/translations'
import type { BlogPostPreview } from '@/lib/cms/normalizeBlogs'
import { LandingMediaIcon, CARD_ICON_EMOJI } from '@/components/compress/landingFoldRender'
import BlogCardCover from '@/components/blog/BlogCardCover'
import '@/components/compress/HomePage.css'
import '@/styles/cms-page.css'
import '@/styles/BlogListPage.css'

type Lang = 'id' | 'en'

type Card = { id: number; title: string; description?: string; icon?: string }

type SectionItem = { id?: number; title?: string; description?: string; media_type?: string; media_value?: string }

type Section = { id: number; title?: string; description?: string; items?: SectionItem[] }

type HowSection = { title?: string; description?: string } | null

const LANDING_BLOG_PREVIEW_MAX = 4

function t(lang: Lang, key: string): string {
  const v = getTranslation(lang, key)
  return typeof v === 'string' ? v : key
}

function formatBlogDate(iso: string, lang: Lang) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      dateStyle: 'medium',
    })
  } catch {
    return iso
  }
}

type Props = {
  lang: Lang
  siteOrigin: string
  cards: Card[]
  sections: Section[]
  howSection: HowSection
  blogs: BlogPostPreview[]
}

/** Home landing blocks rendered on the server so CMS copy is in View Source (not only after JS). */
export default function HomeLandingServerBlocks({
  lang,
  siteOrigin,
  cards,
  sections,
  howSection,
  blogs,
}: Props) {
  const cardEmoji = (iconKey: string) => CARD_ICON_EMOJI[iconKey] ?? '✨'
  const lp = langPrefix(lang)
  const blogListHref = `${lp}/blog`
  const previewPosts = blogs.slice(0, LANDING_BLOG_PREVIEW_MAX)
  const readMore = t(lang, 'blog.readMore')

  return (
    <>
      {cards.length > 0 && (
        <section className="landing-section landing-features" aria-labelledby="landing-features-heading">
          <h2 id="landing-features-heading" className="landing-section-title">
            {t(lang, 'landing.featuresTitle')}
          </h2>
          <div className="landing-cards">
            {cards.map((card) => (
              <div key={card.id} className="landing-card">
                <span className="landing-card-icon" aria-hidden="true">
                  {cardEmoji(String(card.icon || ''))}
                </span>
                <h3 className="landing-card-title">{card.title}</h3>
                <p className="landing-card-desc">{card.description || ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.map((sec) => {
        const items = Array.isArray(sec.items) ? sec.items : []
        if (!items.length) return null
        const sectionId = `cms-section-${sec.id}`
        return (
          <section key={sec.id} className="landing-section landing-how" aria-labelledby={sectionId}>
            <h2 id={sectionId} className="landing-section-title">
              {sec.title || ''}
            </h2>
            {sec.description ? <p className="landing-section-subtitle">{sec.description}</p> : null}
            <div className="landing-steps">
              {items.map((item, idx) => (
                <div key={item.id ?? idx} className="landing-step">
                  <LandingMediaIcon item={item} idx={idx} />
                  <h3 className="landing-step-title">{item.title || ''}</h3>
                  <p className="landing-step-desc">{item.description || ''}</p>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {previewPosts.length > 0 && (
        <section id="landing-blog" className="landing-section landing-blog" aria-labelledby="landing-blog-heading">
          <div className="landing-blog-header">
            <h2 id="landing-blog-heading" className="landing-section-title landing-blog-title">
              {t(lang, 'fromTheBlog')}
            </h2>
            <Link href={blogListHref} className="landing-blog-view-all">
              {t(lang, 'viewAllPosts')}
            </Link>
          </div>
          <div className="landing-blog-grid">
            {previewPosts.map((post) => (
              <Link
                key={post.id}
                href={`${lp}/blog/${encodeURIComponent(post.slug)}`}
                className="blog-card landing-blog-card"
              >
                <div className="blog-card-image-wrap">
                  <BlogCardCover
                    src={post.og_image || post.image}
                    title={post.title}
                    siteOrigin={siteOrigin}
                  />
                </div>
                <div className="blog-card-body">
                  {post.published_at && (
                    <time className="blog-card-date" dateTime={post.published_at}>
                      {formatBlogDate(post.published_at, lang)}
                    </time>
                  )}
                  <h3 className="blog-card-title">{post.title}</h3>
                  {post.excerpt ? <p className="blog-card-excerpt">{post.excerpt}</p> : null}
                  <span className="blog-card-link">
                    {readMore} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
