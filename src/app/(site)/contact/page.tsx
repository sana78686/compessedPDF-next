import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'
import { translations } from '@/i18n/translations'

const c = translations.id.contact

export const metadata: Metadata = {
  title: c.title,
  description: c.intro,
}

export default function ContactPage() {
  return <ContactPageClient />
}
