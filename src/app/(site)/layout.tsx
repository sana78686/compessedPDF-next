import HtmlLangSetter from '@/components/site/HtmlLangSetter'
import SiteHeaderIsland from '@/components/site/SiteHeaderIsland'
import SiteFooterIsland from '@/components/site/SiteFooterIsland'
import Breadcrumbs from '@/components/site/Breadcrumbs'
import { getPages, getLegalNav, getFaq } from '@/lib/cms/server'
import { faqListHasContent } from '@/utils/faqListHasContent'
import '@/components/compress/HomePage.css'

export const revalidate = 60

export default async function SiteRouteLayout({ children }: { children: React.ReactNode }) {
  let footerPages: { id: number; title: string; slug: string; placement?: string }[] = []
  let legalVisibility: Record<string, boolean> = {}
  let showFaqLink = false

  try {
    const [pagesRes, legalNavRes, faqRes] = await Promise.all([
      getPages('id'),
      getLegalNav('id'),
      getFaq('id'),
    ])
    footerPages = Array.isArray(pagesRes?.pages) ? pagesRes.pages : []
    const legal = legalNavRes?.legal
    legalVisibility =
      legal && typeof legal === 'object' && !Array.isArray(legal)
        ? (legal as Record<string, boolean>)
        : {}
    showFaqLink = faqListHasContent(faqRes as { faq?: { question?: string; answer?: string }[] })
  } catch {
    /* CMS down — shell still renders */
  }

  return (
    <div className="home-page">
      <HtmlLangSetter />
      <SiteHeaderIsland footerPages={footerPages} />
      <main id="main-content" className="main cms-main" tabIndex={-1}>
        <Breadcrumbs />
        {children}
      </main>
      <SiteFooterIsland
        footerPages={footerPages}
        legalVisibility={legalVisibility}
        showFaqLink={showFaqLink}
      />
    </div>
  )
}
