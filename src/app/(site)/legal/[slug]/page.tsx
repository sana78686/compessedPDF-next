import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getLegalPage } from '@/lib/cms/server'
import { absolutizeCmsHtmlServer, siteOriginFromEnv } from '@/lib/cms/html'
import { JsonLdScript } from '@/components/cms/JsonLdScript'
import { buildCmsMetadata } from '@/lib/cmsMeta'
import '@/styles/cms-page.css'

const VALID = ['terms', 'privacy-policy', 'disclaimer', 'about-us', 'cookie-policy']

export const revalidate = 60

function plainText(html: string) {
  if (!html || typeof html !== 'string') return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!VALID.includes(slug)) return { title: 'Legal' }
  try {
    const data = (await getLegalPage(slug, 'id')) as Record<string, string | undefined>
    return buildCmsMetadata({
      locale: 'id',
      path: `/legal/${encodeURIComponent(slug)}`,
      ogLocale: 'id_ID',
      pageMeta: {
        title: data?.meta_title || data?.title,
        description:
          data?.meta_description || plainText(String(data?.content || '')).slice(0, 160),
        keywords: data?.meta_keywords,
        og_image: data?.og_image,
        image: data?.image,
      },
      fallbackTitle: slug,
      fallbackDescription: '',
    })
  } catch {
    return { title: 'Legal' }
  }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!VALID.includes(slug)) notFound()

  let data: { title?: string; content?: string; json_ld?: unknown }
  try {
    data = (await getLegalPage(slug, 'id')) as typeof data
  } catch {
    notFound()
  }

  const origin = siteOriginFromEnv()
  const html = absolutizeCmsHtmlServer(String(data?.content || ''), origin)

  return (
    <article className="cms-page wrap">
      <JsonLdScript data={data.json_ld} />
      <header className="cms-page-header">
        <h1 className="cms-page-title">{data.title || slug}</h1>
      </header>
      <div
        className="cms-page-content legal-content-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <footer className="cms-page-footer">
        <Link href="/" className="cms-page-back">
          ← Back to home
        </Link>
      </footer>
    </article>
  )
}
