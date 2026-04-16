import type { Metadata } from 'next'
import AllToolsClient from '@/components/tools/AllToolsClient'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

const tools = translations.en.tools

export const metadata: Metadata = {
  title: tools.pageTitle,
  description: tools.frequentlyUsed,
  alternates: { canonical: '/en/tools' },
  ...socialMetadata({
    title: tools.pageTitle,
    description: tools.frequentlyUsed,
    path: '/en/tools',
    ogLocale: 'en_US',
  }),
}

export default function EnAllToolsPage() {
  return <AllToolsClient />
}
