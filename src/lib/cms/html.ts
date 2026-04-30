function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/\r?\n/g, ' ')
}

/** Visible / SR-relevant text inside anchor HTML (tags stripped; <img alt> counts). */
function innerApproxAccessibleText(inner: string): string {
  let fromImgAlts = ''
  const imgRe = /<img\b([^>]*)>/gi
  let im: RegExpExecArray | null
  while ((im = imgRe.exec(inner)) !== null) {
    const altM = im[1].match(/\balt\s*=\s*(["'])([\s\S]*?)\1/i)
    fromImgAlts += altM ? altM[2].trim() : ''
  }
  const noTags = inner.replace(/<[^>]+>/g, ' ')
  const textOnly = noTags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/\s+/g, '')
    .trim()
  return (fromImgAlts + textOnly).trim()
}

function humanizeHrefForAria(href: string): string {
  const h = (href || '').trim()
  if (!h || h === '#' || /^javascript:/i.test(h)) return 'Link'
  try {
    if (/^https?:\/\//i.test(h)) {
      const u = new URL(h)
      const host = u.hostname.replace(/^www\./i, '')
      return host ? `Visit ${host}` : 'External link'
    }
    if (h.startsWith('mailto:')) {
      try {
        const rest = decodeURIComponent(h.slice('mailto:'.length).split('?')[0] || '')
        return rest ? `Email ${rest}` : 'Email link'
      } catch {
        return 'Email link'
      }
    }
    if (h.startsWith('tel:')) return 'Phone link'
    if (h.startsWith('/')) return 'Page link'
  } catch {
    /* ignore */
  }
  return 'Link'
}

/**
 * Quill/CMS often outputs empty `<a href="…"></a>` or icon links with `alt=""`.
 * Lighthouse requires a discernible name (`aria-label` or visible text).
 */
export function patchCmsHtmlA11y(html: string): string {
  if (!html || typeof html !== 'string') return html
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs, inner) => {
    const a = String(attrs)
    if (/aria-label\s*=/i.test(a) || /aria-labelledby\s*=/i.test(a)) return full
    if (innerApproxAccessibleText(inner).length > 0) return full
    const hrefMatch = a.match(/\bhref\s*=\s*(["'])([^"']*)\1/i)
    const label = humanizeHrefForAria(hrefMatch ? hrefMatch[2] : '')
    const trimmedAttrs = a.trim()
    const spacer = trimmedAttrs.length ? ' ' : ''
    return `<a ${trimmedAttrs}${spacer}aria-label="${escapeHtmlAttr(label)}">${inner}</a>`
  })
}

/**
 * Fix rich-text HTML for SSR: resolve relative CMS paths using public site origin.
 */
export function absolutizeCmsHtmlServer(html: string, siteOrigin: string): string {
  if (!html || typeof html !== 'string') return html
  const origin = siteOrigin.replace(/\/+$/, '')
  const rewritten = html.replace(
    /\b(src|href)=(["'])((?:https?:\/\/[^"']+)?\/(?:storage|uploads|media|cms-uploads)\/[^"']+)\2/gi,
    (_attr, attr: string, q: string, urlPart: string) => {
      if (/^https?:\/\//i.test(urlPart)) {
        try {
          const u = new URL(urlPart)
          if (u.pathname.startsWith('/uploads/') || u.pathname.startsWith('/cms-uploads/')) {
            return `${attr}=${q}${origin}${u.pathname}${u.search || ''}${q}`
          }
        } catch {
          /* keep */
        }
        return `${attr}=${q}${urlPart}${q}`
      }
      return `${attr}=${q}${origin}${urlPart.startsWith('/') ? '' : '/'}${urlPart}${q}`
    },
  )
  return patchCmsHtmlA11y(rewritten)
}

export function siteOriginFromEnv(): string {
  const explicit = String(process.env.NEXT_PUBLIC_SITE_ORIGIN || '').trim().replace(/\/+$/, '')
  if (explicit) return explicit
  const d = String(process.env.NEXT_PUBLIC_SITE_DOMAIN || 'compresspdf.id').trim()
  if (d === 'localhost' || d === '127.0.0.1') return `http://${d}`
  return `https://${d}`
}
