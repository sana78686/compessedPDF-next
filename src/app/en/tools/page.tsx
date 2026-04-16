import type { Metadata } from 'next'
import AllToolsClient from '@/components/tools/AllToolsClient'
import { translations } from '@/i18n/translations'

const tools = translations.en.tools

export const metadata: Metadata = {
  title: tools.pageTitle,
  description: tools.frequentlyUsed,
}

export default function EnAllToolsPage() {
  return <AllToolsClient />
}
