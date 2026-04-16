import type { Metadata } from 'next'
import ComingSoonClient from '@/components/tools/ComingSoonClient'

export const metadata: Metadata = {
  title: 'Coming Soon',
  description: 'This tool is under development. Try our Compress PDF tool in the meantime.',
  robots: { index: false, follow: true },
}

/**
 * Matches Vite `/:lang/:tool` (e.g. /en/merge). Static routes under `en/` take precedence.
 */
export default function EnToolComingSoonPage() {
  return <ComingSoonClient />
}
