import type { Metadata } from 'next'
import HomePageClient from '@/components/compress/HomePageClient'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

const h = translations.en

export const metadata: Metadata = {
  title: h.title,
  description: h.subtitle,
  alternates: { canonical: '/en/compress' },
  ...socialMetadata({
    title: h.title,
    description: h.subtitle,
    path: '/en/compress',
    ogLocale: 'en_US',
  }),
}

export default function EnCompressPage() {
  return <HomePageClient />
}
