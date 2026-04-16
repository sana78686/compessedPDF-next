/**
 * FUTURE: “Coming soon” tool route for English (`/en/{tool}`).
 *
 * To enable: copy this file to `src/app/en/[tool]/page.tsx` (create `[tool]` folder if needed).
 * While disabled, `app/en/[tool]/page.tsx` should not exist so crawlers do not index placeholder URLs.
 */
import type { Metadata } from 'next'
import ComingSoonClient from '@/components/tools/ComingSoonClient'

export const metadata: Metadata = {
  title: 'Coming Soon',
  description: 'This tool is under development. Try our Compress PDF tool in the meantime.',
  robots: { index: false, follow: true },
}

export default function EnToolComingSoonPage() {
  return <ComingSoonClient />
}
