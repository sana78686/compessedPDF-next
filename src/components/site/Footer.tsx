'use client'

import { useState, useRef, useEffect } from 'react'
import { supportedLangs, langOptions, defaultLang, langPrefix as lp, writeUserLocalePreference } from '@/i18n/translations'
import LangFlag from './LangFlag'
import { ucWords } from '@/utils/ucWords'
import './Footer.css'

const LEGAL_SLUG_ORDER = ['terms', 'privacy-policy', 'disclaimer', 'about-us', 'cookie-policy']

const LEGAL_LABEL_KEY = {
  terms: 'footerTerms',
  'privacy-policy': 'footerPrivacy',
  disclaimer: 'footerDisclaimer',
  'about-us': 'footerAbout',
  'cookie-policy': 'footerCookies',
}

function buildLangSwitchHref(pathname: string, currentLang: string, targetLang: string) {
  let suffix = pathname || '/'
  if (currentLang !== defaultLang) {
    suffix = suffix.replace(new RegExp(`^/${currentLang}(/|$)`), '$1') || '/'
  }
  if (!suffix.startsWith('/')) suffix = '/' + suffix
  if (targetLang === defaultLang) return suffix
  return `/${targetLang}${suffix === '/' ? '' : suffix}`
}

type FooterPage = { id: number; title: string; slug: string; placement?: string }

type FooterProps = {
  lang: string
  pathname: string
  t: (key: string, params?: Record<string, string | number>) => string
  footerPages?: FooterPage[]
  legalVisibility?: Record<string, boolean>
  showFaqLink?: boolean
}

export default function Footer({
  lang,
  pathname,
  t,
  footerPages = [],
  legalVisibility = {},
  showFaqLink = false,
}: FooterProps) {
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement | null>(null)

  const cmsFooterLinks = footerPages.filter(
    (p) => p.placement === 'footer' || p.placement === 'both',
  )

  const legalLinksToShow = LEGAL_SLUG_ORDER.filter((slug) => legalVisibility[slug])
  const showLegalColumn = legalLinksToShow.length > 0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    if (langOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [langOpen])

  const effectiveLang = supportedLangs.includes(lang) ? lang : defaultLang
  const prefix = lp(effectiveLang)

  return (
    <footer className="footer footer--dark">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-columns">
            <div className="footer-col">
              <h3 className="footer-col-title">{t('footerCompany')}</h3>
              <a href={`${prefix}/blog`}>{t('footerBlog')}</a>
              <a href={`${prefix}/contact`}>{t('footerContact')}</a>
              {showFaqLink && (
                <a href={`${prefix}/#landing-faq`}>{t('footerFaq')}</a>
              )}
            </div>
            {cmsFooterLinks.length > 0 && (
              <div className="footer-col">
                <h3 className="footer-col-title">{t('footerOther')}</h3>
                {cmsFooterLinks.map((p) => (
                  <a key={p.id} href={`${prefix}/page/${p.slug}`}>
                    {ucWords(p.title)}
                  </a>
                ))}
              </div>
            )}
            {showLegalColumn && (
              <div className="footer-col">
                <h3 className="footer-col-title">{t('footerLegal')}</h3>
                {legalLinksToShow.map((slug) => (
                  <a key={slug} href={`${prefix}/legal/${slug}`}>
                    {t(LEGAL_LABEL_KEY[slug as keyof typeof LEGAL_LABEL_KEY])}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-lang-wrap" ref={langRef}>
            <button
              type="button"
              className="footer-lang-btn"
              onClick={() => setLangOpen((o) => !o)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label="Select language"
            >
              <span className="footer-lang-icon" aria-hidden>
                <LangFlag lang={effectiveLang} width={20} />
              </span>
              <span>{langOptions[effectiveLang as keyof typeof langOptions]?.label || t('footerLanguage')}</span>
              <span className="footer-lang-chevron" aria-hidden>▼</span>
            </button>
            {langOpen && (
              <ul className="footer-lang-menu" role="listbox">
                {supportedLangs.map((l) => (
                  <li key={l} role="option" aria-selected={effectiveLang === l ? true : false}>
                    <a
                      href={buildLangSwitchHref(pathname, effectiveLang, l)}
                      className="footer-lang-item"
                      onClick={() => writeUserLocalePreference(l)}
                    >
                      <span className="footer-lang-item-flag" aria-hidden>
                        <LangFlag lang={l} width={18} />
                      </span>
                      <span>{langOptions[l as keyof typeof langOptions]?.label || l.toUpperCase()}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="footer-social-copy">
            <nav className="footer-social" aria-label="Social links">
              <a href="#twitter" aria-label="X (Twitter)"><span className="footer-social-icon">𝕏</span></a>
              <a href="#facebook" aria-label="Facebook"><span className="footer-social-icon">f</span></a>
              <a href="#linkedin" aria-label="LinkedIn"><span className="footer-social-icon">in</span></a>
              <a href="#instagram" aria-label="Instagram"><span className="footer-social-icon">📷</span></a>
              <a href="#tiktok" aria-label="TikTok"><span className="footer-social-icon">♪</span></a>
            </nav>
            <p className="footer-copy">
              <span>{t('footerCopyrightPrefix')}</span>
              <a
                href="https://apimstec.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('footerPoweredBy')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
