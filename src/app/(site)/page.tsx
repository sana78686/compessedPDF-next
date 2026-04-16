import type { Metadata } from 'next'
import HomePageClient from '@/components/compress/HomePageClient'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

const h = translations.id

export const metadata: Metadata = {
  title: h.seoHeroH1,
  description: h.subtitle,
  alternates: { canonical: '/' },
  ...socialMetadata({
    title: h.seoHeroH1,
    description: h.subtitle,
    path: '/',
    ogLocale: 'id_ID',
  }),
}

export default function HomePage() {
  return <HomePageClient />
}
