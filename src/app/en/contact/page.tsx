import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'
import { translations } from '@/i18n/translations'

const c = translations.en.contact

export const metadata: Metadata = {
  title: c.title,
  description: c.intro,
}

export default function EnContactPage() {
  return <ContactPageClient />
}
