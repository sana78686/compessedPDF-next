import type { Metadata } from 'next'
import HomePageClient from '@/components/compress/HomePageClient'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

const h = translations.id

export const metadata: Metadata = {
  title: h.title,
  description: h.subtitle,
  alternates: { canonical: '/compress' },
  ...socialMetadata({
    title: h.title,
    description: h.subtitle,
    path: '/compress',
    ogLocale: 'id_ID',
  }),
}

export default function CompressPage() {
  return <HomePageClient />
}
