import type { Metadata } from 'next'
import HomePageClient from '@/components/compress/HomePageClient'
import { translations } from '@/i18n/translations'
import { buildCmsMetadata } from '@/lib/cmsMeta'

const h = translations.en

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsMetadata({
    locale: 'en',
    path: '/en/compress/result',
    ogLocale: 'en_US',
    fallbackTitle: h.title,
    fallbackDescription: h.subtitle,
  })
}

export default function EnCompressResultPage() {
  return <HomePageClient />
}
