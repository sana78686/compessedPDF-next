import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

const c = translations.en.contact

export const metadata: Metadata = {
  title: c.title,
  description: c.intro,
  alternates: { canonical: '/en/contact' },
  ...socialMetadata({
    title: c.title,
    description: c.intro,
    path: '/en/contact',
    ogLocale: 'en_US',
  }),
}

export default function EnContactPage() {
  return <ContactPageClient />
}
