import type { MetadataRoute } from 'next'
import { siteOriginFromEnv } from '@/lib/cms/html'
import { getBlogs, getPages } from '@/lib/cms/server'

export const revalidate = 3600

/** Keep in sync with `src/app/(site)/legal/[slug]/page.tsx` */
const LEGAL_SLUGS = ['terms', 'privacy-policy', 'disclaimer', 'about-us', 'cookie-policy']

function normalizeBlogSlugs(res: unknown): { slug: string }[] {
  if (Array.isArray(res)) {
    return (res as { slug?: string }[])
      .filter((b) => b && typeof b.slug === 'string')
      .map((b) => ({ slug: b.slug as string }))
  }
  if (res && typeof res === 'object') {
    const o = res as Record<string, unknown>
    const raw = Array.isArray(o.blogs) ? o.blogs : Array.isArray(o.data) ? o.data : []
    return (raw as { slug?: string }[])
      .filter((b) => b && typeof b.slug === 'string')
      .map((b) => ({ slug: b.slug as string }))
  }
  return []
}

function normalizePageSlugs(res: unknown): string[] {
  if (!res || typeof res !== 'object') return []
  const pages = (res as { pages?: { slug?: string }[] }).pages
  if (!Array.isArray(pages)) return []
  return pages
    .map((p) => (p && typeof p.slug === 'string' ? p.slug : ''))
    .filter(Boolean)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteOriginFromEnv().replace(/\/+$/, '')
  const lastModified = new Date()

  const staticPaths = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/compress', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/en', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/en/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/en/contact', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/en/compress', priority: 0.9, changeFrequency: 'weekly' as const },
  ]

  const entries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: path === '' ? `${base}/` : `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))

  for (const slug of LEGAL_SLUGS) {
    entries.push({
      url: `${base}/legal/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
    entries.push({
      url: `${base}/en/legal/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  try {
    const [idRes, enRes, idPages, enPages] = await Promise.all([
      getBlogs('id'),
      getBlogs('en'),
      getPages('id'),
      getPages('en'),
    ])
    for (const b of normalizeBlogSlugs(idRes)) {
      entries.push({
        url: `${base}/blog/${encodeURIComponent(b.slug)}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
    for (const b of normalizeBlogSlugs(enRes)) {
      entries.push({
        url: `${base}/en/blog/${encodeURIComponent(b.slug)}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
    for (const slug of normalizePageSlugs(idPages)) {
      entries.push({
        url: `${base}/page/${encodeURIComponent(slug)}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.65,
      })
    }
    for (const slug of normalizePageSlugs(enPages)) {
      entries.push({
        url: `${base}/en/page/${encodeURIComponent(slug)}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.65,
      })
    }
  } catch {
    /* CMS unavailable during build — static URLs still listed */
  }

  return entries
}
