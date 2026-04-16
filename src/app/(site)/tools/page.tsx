import type { Metadata } from 'next'
import AllToolsClient from '@/components/tools/AllToolsClient'
import { translations } from '@/i18n/translations'

const tools = translations.id.tools

export const metadata: Metadata = {
  title: tools.pageTitle,
  description: tools.frequentlyUsed,
}

export default function AllToolsPage() {
  return <AllToolsClient />
}
