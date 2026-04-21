import { mkdir, writeFile } from 'fs/promises'
import { timingSafeEqual } from 'crypto'
import { join } from 'path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const MAX_BYTES = 6 * 1024 * 1024

function safeEqualString(a: string, b: string): boolean {
  try {
    const ab = Buffer.from(a, 'utf8')
    const bb = Buffer.from(b, 'utf8')
    if (ab.length !== bb.length) return false
    return timingSafeEqual(ab, bb)
  } catch {
    return false
  }
}

type SyncAction = 'robots' | 'sitemap' | 'home_seo'

/**
 * Same contract as `compressedPDF-react/public/cms-seo-sync.php`: CMS pushes SEO files to the frontend.
 * Body: JSON `{ secret, action, content }` or `multipart/form-data` / `x-www-form-urlencoded`
 * fields `secret`, `action`, `content`.
 *
 * Set `CMS_SEO_SYNC_SECRET` on the Next server (not NEXT_PUBLIC_*). Must match `FRONTEND_SEO_SYNC_SECRET` in CMS .env.
 */
export async function POST(req: Request) {
  const expected = String(process.env.CMS_SEO_SYNC_SECRET ?? '').trim()
  if (!expected) {
    return NextResponse.json(
      { ok: false, message: 'CMS_SEO_SYNC_SECRET is not set on this host' },
      { status: 503 },
    )
  }

  let secret = ''
  let action = ''
  let content = ''

  const ct = req.headers.get('content-type') ?? ''
  try {
    if (ct.includes('application/json')) {
      const j = (await req.json()) as Record<string, unknown>
      secret = String(j.secret ?? '')
      action = String(j.action ?? '')
      content = String(j.content ?? '')
    } else {
      const form = await req.formData()
      secret = String(form.get('secret') ?? '')
      action = String(form.get('action') ?? '')
      content = String(form.get('content') ?? '')
    }
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid body' }, { status: 400 })
  }

  if (!safeEqualString(secret, expected)) {
    return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 })
  }

  if (action !== 'robots' && action !== 'sitemap' && action !== 'home_seo') {
    return NextResponse.json({ ok: false, message: 'Invalid action' }, { status: 400 })
  }

  if (Buffer.byteLength(content, 'utf8') > MAX_BYTES) {
    return NextResponse.json({ ok: false, message: 'Content too large' }, { status: 400 })
  }

  let file: string
  if (action === 'home_seo') {
    if (!content.trim()) {
      return NextResponse.json({ ok: false, message: 'Empty JSON for home_seo' }, { status: 400 })
    }
    try {
      JSON.parse(content)
    } catch {
      return NextResponse.json({ ok: false, message: 'Invalid JSON for home_seo' }, { status: 400 })
    }
    file = 'cms-home-seo.json'
  } else {
    file = action === 'robots' ? 'robots.txt' : 'sitemap.xml'
  }

  const publicDir = join(process.cwd(), 'public')
  await mkdir(publicDir, { recursive: true })
  const outPath = join(publicDir, file)

  try {
    await writeFile(outPath, content, 'utf8')
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Could not write file (check permissions on public/)' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true, file })
}
