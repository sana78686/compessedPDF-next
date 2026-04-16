import type { Metadata } from 'next'
import AllToolsClient from '@/components/tools/AllToolsClient'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

const tools = translations.id.tools

export const metadata: Metadata = {
  title: tools.pageTitle,
  description: tools.frequentlyUsed,
  alternates: { canonical: '/tools' },
  ...socialMetadata({
    title: tools.pageTitle,
    description: tools.frequentlyUsed,
    path: '/tools',
    ogLocale: 'id_ID',
  }),
}

export default function AllToolsPage() {
  return <AllToolsClient />
}
