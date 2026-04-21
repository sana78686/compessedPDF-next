import { getTranslation } from '@/i18n/translations'
import { absolutizeCmsHtmlServer } from '@/lib/cms/html'
import { LandingMediaIcon, CARD_ICON_EMOJI } from '@/components/compress/landingFoldRender'
import '@/components/compress/HomePage.css'
import '@/styles/cms-page.css'

type Lang = 'id' | 'en'

type Card = { id: number; title: string; description?: string; icon?: string }

type SectionItem = { id?: number; title?: string; description?: string; media_type?: string; media_value?: string }

type Section = { id: number; title?: string; description?: string; items?: SectionItem[] }

type HowSection = { title?: string; description?: string } | null

function t(lang: Lang, key: string): string {
  const v = getTranslation(lang, key)
  return typeof v === 'string' ? v : key
}

function stripHtml(s: string) {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function faqItemHasContent(q: unknown, a: unknown) {
  const qs = stripHtml(String(q ?? ''))
  const as = stripHtml(String(a ?? ''))
  return qs.length > 0 || as.length > 0
}

type Props = {
  lang: Lang
  siteOrigin: string
  cards: Card[]
  sections: Section[]
  howSection: HowSection
  faqRaw: { question?: string; answer?: string }[]
}

/** Home landing blocks rendered on the server so CMS copy is in View Source (not only after JS). */
export default function HomeLandingServerBlocks({
  lang,
  siteOrigin,
  cards,
  sections,
  howSection,
  faqRaw,
}: Props) {
  const cardEmoji = (iconKey: string) => CARD_ICON_EMOJI[iconKey] ?? '✨'

  const faqItems = (Array.isArray(faqRaw) ? faqRaw : []).filter((item) =>
    faqItemHasContent(item?.question, item?.answer),
  )

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

      {sections.length === 0 && (
        <section className="landing-section landing-how" aria-labelledby="landing-how-heading">
          <h2 id="landing-how-heading" className="landing-section-title">
            {howSection?.title?.trim?.() || t(lang, 'landing.howTitle')}
          </h2>
          {howSection?.description?.trim?.() ? (
            <p className="landing-section-subtitle">{howSection.description.trim()}</p>
          ) : null}
          <div className="landing-steps">
            <div className="landing-step">
              <span className="landing-step-num" aria-hidden="true">
                1
              </span>
              <h3 className="landing-step-title">{t(lang, 'landing.howStep1')}</h3>
              <p className="landing-step-desc">{t(lang, 'landing.howStep1Desc')}</p>
            </div>
            <div className="landing-step">
              <span className="landing-step-num" aria-hidden="true">
                2
              </span>
              <h3 className="landing-step-title">{t(lang, 'landing.howStep2')}</h3>
              <p className="landing-step-desc">{t(lang, 'landing.howStep2Desc')}</p>
            </div>
            <div className="landing-step">
              <span className="landing-step-num" aria-hidden="true">
                3
              </span>
              <h3 className="landing-step-title">{t(lang, 'landing.howStep3')}</h3>
              <p className="landing-step-desc">{t(lang, 'landing.howStep3Desc')}</p>
            </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section id="landing-faq" className="landing-section landing-faq" aria-labelledby="landing-faq-heading">
          <h2 id="landing-faq-heading" className="landing-section-title">
            {t(lang, 'landing.faqTitle')}
          </h2>
          <div className="landing-faq-list" role="list">
            {faqItems.map((item, i) => {
              const answerHtml = absolutizeCmsHtmlServer(String(item.answer || ''), siteOrigin)
              return (
                <details key={i} className="landing-faq-item landing-faq-item--details" role="listitem">
                  <summary className="landing-faq-question">
                    <span>{item.question}</span>
                    <span className="landing-faq-chevron" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="landing-faq-answer landing-faq-answer--details">
                    <div
                      className="landing-faq-answer__inner cms-page-content"
                      dangerouslySetInnerHTML={{ __html: answerHtml }}
                    />
                  </div>
                </details>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
