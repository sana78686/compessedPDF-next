import SiteLayout from '@/components/site/SiteLayout'
import { EnLangHtml } from '@/components/site/EnLangHtml'

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EnLangHtml />
      <SiteLayout>{children}</SiteLayout>
    </>
  )
}
