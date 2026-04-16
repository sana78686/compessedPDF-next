'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/i18n/useTranslation'
import { supportedLangs, langOptions, defaultLang, langPrefix, writeUserLocalePreference } from '@/i18n/translations'
import { langShortLabel } from '@/i18n/langMeta'
import { usePathLang } from '@/hooks/usePathLang'
import { getPages, getLegalNav, getFaq } from '@/lib/cms-client'
import BrandLogo from './BrandLogo'
import Breadcrumbs from './Breadcrumbs'
import { COMPRESS_PDF_EN } from '@/constants/brand'
import LangFlag from './LangFlag'
import { ucWords } from '@/utils/ucWords'
import '@/components/compress/HomePage.css'
import Footer from './Footer'

function faqListHasContent(res: { faq?: { question?: string; answer?: string }[] }) {
  const list = res?.faq
  if (!Array.isArray(list) || list.length === 0) return false
  return list.some((item) => {
    const strip = (s: string | undefined) =>
      String(s ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    return strip(item.question).length > 0 || strip(item.answer).length > 0
  })
}

function buildLangSwitchHref(pathname: string, currentLang: string, targetLang: string) {
  let suffix = pathname
  if (currentLang !== defaultLang) {
    suffix = pathname.replace(new RegExp(`^/${currentLang}(/|$)`), '$1') || '/'
  }
  if (!suffix.startsWith('/')) suffix = '/' + suffix
  if (targetLang === defaultLang) return suffix
  return `/${targetLang}${suffix === '/' ? '' : suffix}`
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const lang = usePathLang()
  const pathname = usePathname() || '/'
  const t = useTranslation(lang)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const [footerPages, setFooterPages] = useState<{ id: number; title: string; slug: string; placement?: string }[]>([])
  const [legalVisibility, setLegalVisibility] = useState<Record<string, boolean>>({})
  const [showFaqLink, setShowFaqLink] = useState(false)

  const locale = lang

  const headerCmsPages = useMemo(
    () =>
      footerPages.filter((p) => p.placement === 'header' || p.placement === 'both'),
    [footerPages],
  )

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getPages(locale).catch(() => ({ pages: [] })),
      getLegalNav(locale).catch(() => ({ legal: {} })),
      getFaq(locale).catch(() => ({ faq: [] })),
    ]).then(([pagesRes, legalNavRes, faqRes]) => {
      if (cancelled) return
      setFooterPages(Array.isArray(pagesRes?.pages) ? pagesRes.pages : [])
      const legal = legalNavRes?.legal
      setLegalVisibility(
        legal && typeof legal === 'object' && !Array.isArray(legal)
          ? (legal as Record<string, boolean>)
          : {},
      )
      setShowFaqLink(faqListHasContent(faqRes))
    })
    return () => {
      cancelled = true
    }
  }, [locale])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
      document.documentElement.dir = 'ltr'
    }
  }, [lang])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    if (langDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [langDropdownOpen])

  const lp = langPrefix(lang)

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-inner header-inner--minimal">
          <BrandLogo href={`${lp}/`} ariaLabel={t('nav.home')} text={COMPRESS_PDF_EN} />
          {headerCmsPages.length > 0 && (
            <nav className="header-cms-nav" aria-label="Site pages">
              <ul className="header-cms-nav-list">
                {headerCmsPages.map((p) => (
                  <li key={p.id}>
                    <Link href={`${lp}/page/${p.slug}`} className="header-cms-nav-link">
                      {ucWords(p.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="header-actions">
            <div className="lang-dropdown" ref={langDropdownRef}>
              <button
                type="button"
                className="lang-dropdown-trigger"
                onClick={() => setLangDropdownOpen((open) => !open)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
              >
                <span className="lang-dropdown-flag" aria-hidden>
                  <LangFlag lang={lang} width={22} />
                </span>
                <span className="lang-dropdown-label">
                  {langShortLabel[lang as keyof typeof langShortLabel] ?? lang?.toUpperCase() ?? 'ID'}
                </span>
                <span className="lang-dropdown-chevron" aria-hidden>
                  ▼
                </span>
              </button>
              {langDropdownOpen && (
                <ul className="lang-dropdown-menu" role="listbox">
                  {supportedLangs.map((l) => (
                    <li key={l} role="option" aria-selected={lang === l ? true : false}>
                      <a
                        href={buildLangSwitchHref(pathname, lang, l)}
                        className={`lang-dropdown-item ${lang === l ? 'lang-dropdown-item--active' : ''}`}
                        onClick={() => {
                          writeUserLocalePreference(l)
                          setLangDropdownOpen(false)
                        }}
                      >
                        <span className="lang-dropdown-item-flag" aria-hidden>
                          <LangFlag lang={l} width={22} />
                        </span>
                        <span className="lang-dropdown-item-label">
                          {langOptions[l as keyof typeof langOptions]?.label ?? l.toUpperCase()}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="main cms-main" tabIndex={-1}>
        <Breadcrumbs />
        {children}
      </main>

      <Footer
        lang={lang}
        pathname={pathname}
        t={t}
        footerPages={footerPages}
        legalVisibility={legalVisibility}
        showFaqLink={showFaqLink}
      />
    </div>
  )
}
