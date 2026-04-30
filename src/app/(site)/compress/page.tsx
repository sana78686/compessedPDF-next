import type { Metadata } from 'next'
import HomePageClient from '@/components/compress/HomePageClient'
import { translations } from '@/i18n/translations'
import { buildCmsMetadata } from '@/lib/cmsMeta'

const h = translations.id

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsMetadata({
    locale: 'id',
    path: '/compress',
    ogLocale: 'id_ID',
    fallbackTitle: h.title,
    fallbackDescription: h.subtitle,
  })
}

export default function CompressPage() {
  return <HomePageClient />
}
