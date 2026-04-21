import type { Metadata } from 'next'
import HomePageClient from '@/components/compress/HomePageClient'
import { JsonLdScript } from '@/components/cms/JsonLdScript'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'
import { getHomePageContent } from '@/lib/cms/server'
import { absolutizeCmsHtmlServer, siteOriginFromEnv } from '@/lib/cms/html'

const h = translations.en

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
  try {
    res = (await getHomePageContent('en', '/en')) as typeof res
  } catch {
    /* CMS unreachable — tool still works */
  }
  const raw = typeof res?.content === 'string' ? res.content : ''
  const html = absolutizeCmsHtmlServer(raw, origin)
  const graph = res?.json_ld?.['@graph']
  const jsonLd =
    Array.isArray(graph) && graph.length > 0 ? (res.json_ld as Record<string, unknown>) : null

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <HomePageClient homeCmsFromServer={{ html, jsonLd }} />
    </>
  )
}
