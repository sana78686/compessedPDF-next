import type { MetadataRoute } from 'next'
import { siteOriginFromEnv } from '@/lib/cms/html'
import { getBlogs } from '@/lib/cms/server'

export const revalidate = 3600

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteOriginFromEnv().replace(/\/+$/, '')
  const lastModified = new Date()

  const staticPaths = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/tools', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/compress', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/en', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/en/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/en/contact', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/en/tools', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/en/compress', priority: 0.9, changeFrequency: 'weekly' as const },
  ]

  const entries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: path === '' ? `${base}/` : `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))

  try {
    const [idRes, enRes] = await Promise.all([getBlogs('id'), getBlogs('en')])
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
  } catch {
    /* CMS unavailable during build — static URLs still listed */
  }

  return entries
}
