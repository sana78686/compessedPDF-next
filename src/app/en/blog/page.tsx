import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogs } from '@/lib/cms/server'
import { JsonLdScript } from '@/components/cms/JsonLdScript'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest articles and updates.',
}

function normalizeBlogs(res: unknown): { id: number; title: string; slug: string }[] {
  if (Array.isArray(res)) return res as { id: number; title: string; slug: string }[]
  if (res && typeof res === 'object') {
    const o = res as Record<string, unknown>
    const raw = Array.isArray(o.blogs) ? o.blogs : Array.isArray(o.data) ? o.data : []
    return raw as { id: number; title: string; slug: string }[]
  }
  return []
}

export default async function EnBlogListPage() {
  const res = await getBlogs('en')
  const blogs = normalizeBlogs(res)
  const jsonLd = res && typeof res === 'object' && 'json_ld' in res ? (res as { json_ld?: unknown }).json_ld : null

  return (
    <div className="blog-list-page wrap">
      <JsonLdScript data={jsonLd} />
      <h1 className="blog-list-title">Blog</h1>
      <p className="blog-list-intro">Latest articles and updates.</p>
      <ul className="blog-list">
        {blogs.map((b) => (
          <li key={b.id}>
            <Link href={`/en/blog/${encodeURIComponent(b.slug)}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
