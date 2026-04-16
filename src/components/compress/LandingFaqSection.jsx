/**
 * FAQ accordion for the home landing page (rendered last in main, before site footer).
 */
export default function LandingFaqSection({ t, faqItems, faqOpenIndex, setFaqOpenIndex }) {
  if (!faqItems.length) return null

  return (
    <section id="landing-faq" className="landing-section landing-faq" aria-labelledby="landing-faq-heading">
      <h2 id="landing-faq-heading" className="landing-section-title">{t('landing.faqTitle')}</h2>
      <div className="landing-faq-list" role="list">
        {faqItems.map((item, i) => (
          <div key={i} className={`landing-faq-item ${faqOpenIndex === i ? 'landing-faq-item--open' : ''}`} role="listitem">
            <button
              type="button"
              className="landing-faq-question"
              onClick={() => setFaqOpenIndex((prev) => (prev === i ? null : i))}
              aria-expanded={faqOpenIndex === i}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
            >
              <span>{item.q}</span>
              <span className="landing-faq-chevron" aria-hidden="true">{faqOpenIndex === i ? '−' : '+'}</span>
            </button>
            <div
              id={`faq-answer-${i}`}
              className="landing-faq-answer"
              role="region"
              aria-labelledby={`faq-question-${i}`}
              hidden={faqOpenIndex !== i}
            >
              <div
                className="landing-faq-answer__inner cms-page-content"
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
