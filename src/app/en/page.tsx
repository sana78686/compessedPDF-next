import type { Metadata } from 'next'
import HomePageClient from '@/components/compress/HomePageClient'
import HomeLandingServerBlocks from '@/components/compress/HomeLandingServerBlocks'
import { JsonLdScript } from '@/components/cms/JsonLdScript'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'
import { getHomePageContent, getFaq, getHomeCards, getSections } from '@/lib/cms/server'
import { absolutizeCmsHtmlServer, siteOriginFromEnv } from '@/lib/cms/html'
import { cmsHtmlHasVisibleText } from '@/utils/cmsHtmlVisible'
import '@/styles/cms-page.css'

const h = translations.en
const homeCmsAria = translations.en.landing.cmsSectionAria

export const revalidate = 60

export const metadata: Metadata = {
  title: h.seoHeroH1,
  description: h.subtitle,
  alternates: { canonical: '/en' },
  ...socialMetadata({
    title: h.seoHeroH1,
    description: h.subtitle,
    path: '/en',
    ogLocale: 'en_US',
  }),
}

export default async function EnHomePage() {
  const origin = siteOriginFromEnv()

  let res: { content?: string; json_ld?: { '@graph'?: unknown[] } } = {}
  let faqRes: { faq?: { question?: string; answer?: string }[] } = { faq: [] }
  let cardsRes: {
    cards?: { id: number; title: string; description?: string; icon?: string }[]
    section?: { title?: string; description?: string }
  } = {}
  let sectionsRes: {
    sections?: { id: number; title?: string; description?: string; items?: unknown[] }[]
  } = {}

  try {
    ;[res, faqRes, cardsRes, sectionsRes] = await Promise.all([
      getHomePageContent('en', '/en') as Promise<typeof res>,
      getFaq('en') as Promise<typeof faqRes>,
      getHomeCards('en') as Promise<typeof cardsRes>,
      getSections('en') as Promise<typeof sectionsRes>,
    ])
  } catch {
    /* partial failure */
  }

  const raw = typeof res?.content === 'string' ? res.content : ''
  const html = absolutizeCmsHtmlServer(raw, origin)
  const graph = res?.json_ld?.['@graph']
  const jsonLd =
    Array.isArray(graph) && graph.length > 0 ? (res.json_ld as Record<string, unknown>) : null

  const cards = Array.isArray(cardsRes?.cards) ? cardsRes.cards : []
  const sections = Array.isArray(sectionsRes?.sections) ? sectionsRes.sections : []
  const howSection =
    cardsRes?.section && typeof cardsRes.section === 'object' ? cardsRes.section : null
  const faqRaw = Array.isArray(faqRes?.faq) ? faqRes.faq : []

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <h1 className="sr-only">{h.seoHeroH1}</h1>
      <HomePageClient landingExtrasOnServer homeCmsFromServer={{ html, jsonLd }} />
      {cmsHtmlHasVisibleText(html) ? (
        <section className="landing-cms-body-section" aria-label={homeCmsAria}>
          <div
            className="cms-home-cms-body cms-page-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
      ) : null}
      <HomeLandingServerBlocks
        lang="en"
        siteOrigin={origin}
        cards={cards}
        sections={sections as never}
        howSection={howSection}
        faqRaw={faqRaw}
      />
    </>
  )
}
