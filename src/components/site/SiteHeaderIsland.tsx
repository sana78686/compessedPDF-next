'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/i18n/useTranslation'
import { supportedLangs, langOptions, defaultLang, langPrefix, writeUserLocalePreference } from '@/i18n/translations'
import { langShortLabel } from '@/i18n/langMeta'
import { usePathLang } from '@/hooks/usePathLang'
import BrandLogo from './BrandLogo'
import { COMPRESS_PDF_EN } from '@/constants/brand'
import LangFlag from './LangFlag'
import { ucWords } from '@/utils/ucWords'

export type CmsNavPage = { id: number; title: string; slug: string; placement?: string }

function buildLangSwitchHref(pathname: string, currentLang: string, targetLang: string) {
  let suffix = pathname || '/'
  if (currentLang !== defaultLang) {
    suffix = suffix.replace(new RegExp(`^/${currentLang}(/|$)`), '$1') || '/'
  }
  if (!suffix.startsWith('/')) suffix = '/' + suffix
  if (targetLang === defaultLang) return suffix
  return `/${targetLang}${suffix === '/' ? '' : suffix}`
}

export default function SiteHeaderIsland({ footerPages }: { footerPages: CmsNavPage[] }) {
  const lang = usePathLang()
  const pathname = usePathname() || '/'
  const t = useTranslation(lang)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  const headerCmsPages = useMemo(
    () => footerPages.filter((p) => p.placement === 'header' || p.placement === 'both'),
    [footerPages],
  )

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
  /** No trailing slash on `/en` — avoids 308 redirect that can corrupt client-side nav. */
  const homeHref = lp || '/'

  return (
    <header className="header">
      <div className="header-inner header-inner--minimal">
        <BrandLogo href={homeHref} ariaLabel={t('nav.home')} text={COMPRESS_PDF_EN} />
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
          <Link href={`${lp}/compress`} className="header-compress-link">
            {t('footerCompress')}
          </Link>
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
                    <Link
                      href={buildLangSwitchHref(pathname, lang, l)}
                      className={`lang-dropdown-item ${lang === l ? 'lang-dropdown-item--active' : ''}`}
                      scroll={false}
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
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
