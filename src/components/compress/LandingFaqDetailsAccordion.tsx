'use client'

import { useCallback } from 'react'

export type FaqAccordionItem = { question: string; answerHtml: string }

type Props = {
  items: FaqAccordionItem[]
}

/** Native <details> list with exclusive open state (one panel at a time). */
export default function LandingFaqDetailsAccordion({ items }: Props) {
  const onToggle = useCallback((e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const target = e.currentTarget
    if (!target.open) return
    const parent = target.parentElement
    if (!parent) return
    parent.querySelectorAll<HTMLDetailsElement>(':scope > details').forEach((node) => {
      if (node !== target) node.removeAttribute('open')
    })
  }, [])

  return (
    <div className="landing-faq-list" role="list">
      {items.map((item, i) => (
        <details
          key={i}
          className="landing-faq-item landing-faq-item--details"
          role="listitem"
          onToggle={onToggle}
        >
          <summary className="landing-faq-question">
            <span>{item.question}</span>
            <span className="landing-faq-chevron" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="landing-faq-answer landing-faq-answer--details">
            <div
              className="landing-faq-answer__inner cms-page-content"
              dangerouslySetInnerHTML={{ __html: item.answerHtml }}
            />
          </div>
        </details>
      ))}
    </div>
  )
}
