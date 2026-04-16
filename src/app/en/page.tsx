import type { Metadata } from 'next'
import HomePageClient from '@/components/compress/HomePageClient'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

const h = translations.en

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

export default function EnHomePage() {
  return <HomePageClient />
}
