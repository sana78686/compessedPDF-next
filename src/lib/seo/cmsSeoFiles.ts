import { readFile } from 'fs/promises'
import { join } from 'path'
import { CMS_API_BASE, CMS_SITE_DOMAIN } from '@/config/cms'
import { siteOriginFromEnv } from '@/lib/cms/html'

const CMS_FETCH_REVALIDATE_SEC = 3600

/** Reject SPA/HTML error pages mistaken for XML (same idea as Vite fetch-seo-static). */
export function looksLikeHtmlDocument(body: string): boolean {
  const head = body.slice(0, 500).trimStart()
  return /<!doctype html|<html[\s>]/i.test(head)
}

function cmsTenantSeoUrl(file: 'robots.txt' | 'sitemap.xml'): string {
  const base = CMS_API_BASE.replace(/\/+$/, '')
  const domain = encodeURIComponent(CMS_SITE_DOMAIN)
  return `${base}/${domain}/${file}`
}

async function readPublicRootFile(name: string): Promise<string | null> {
  try {
    const p = join(process.cwd(), 'public', name)
    const text = await readFile(p, 'utf8')
    const t = text.trim()
    return t.length > 0 ? text : null
  } catch {
    return null
  }
}

/** 1) `public/robots.txt` after CMS POST sync. 2) Laravel `{CMS}/{domain}/robots.txt`. 3) null. */
export async function resolveRobotsTxtBody(): Promise<string | null> {
  const synced = await readPublicRootFile('robots.txt')
  if (synced) return synced

  const url = cmsTenantSeoUrl('robots.txt')
  try {
    const res = await fetch(url, {
      headers: { Accept: 'text/plain,*/*' },
      next: { revalidate: CMS_FETCH_REVALIDATE_SEC },
    })
    if (!res.ok) return null
    const text = await res.text()
    if (!text.trim()) return null
    if (looksLikeHtmlDocument(text)) return null
    return text
  } catch {
    return null
  }
}

/** 1) `public/sitemap.xml` after sync. 2) Laravel `{CMS}/{domain}/sitemap.xml`. 3) null. */
export async function resolveSitemapXmlBody(): Promise<string | null> {
  const synced = await readPublicRootFile('sitemap.xml')
  if (synced) return synced

  const url = cmsTenantSeoUrl('sitemap.xml')
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/xml,text/xml,*/*' },
      next: { revalidate: CMS_FETCH_REVALIDATE_SEC },
    })
    if (!res.ok) return null
    const text = await res.text()
    if (!text.trim()) return null
    if (looksLikeHtmlDocument(text)) return null
    return text
  } catch {
    return null
  }
}

export function buildFallbackRobotsTxt(): string {
  const base = siteOriginFromEnv().replace(/\/+$/, '')
  return `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`
}
