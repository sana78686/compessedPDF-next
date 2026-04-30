import { CARD_ICON_EMOJI, LandingMediaIcon } from '@/components/compress/landingFoldRender'

/**
 * Below-the-fold landing content: CMS feature cards (Use Cards) + dynamic Sections.
 * Lazy-loaded and mounted after first paint to reduce TBT on mobile.
 */
export default function LandingBelowFold({ t, cards = [], howSection = null, sections = [] }) {
  const cardEmoji = (iconKey) => CARD_ICON_EMOJI[iconKey] ?? '✨'

  return (
    <>
      {cards.length > 0 && (
        <section className="landing-section landing-features" aria-labelledby="landing-features-heading">
          <h2 id="landing-features-heading" className="landing-section-title">{t('landing.featuresTitle')}</h2>
          <div className="landing-cards">
            {cards.map((card) => (
              <div key={card.id} className="landing-card">
                <span className="landing-card-icon" aria-hidden="true">{cardEmoji(card.icon)}</span>
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
            <h2 id={sectionId} className="landing-section-title">{sec.title || ''}</h2>
            {sec.description && <p className="landing-section-subtitle">{sec.description}</p>}
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

    </>
  )
}
