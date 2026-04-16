'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { langPrefix } from '@/i18n/translations'
import { usePathLang } from '@/hooks/usePathLang'
import '../compress/HomePage.css'
import '@/styles/ComingSoonPage.css'

export default function ComingSoonClient() {
  const lang = usePathLang()

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const lp = langPrefix(lang)

  return (
    <div className="coming-soon-page home-page">
      <main className="coming-soon-main">
        <h1 className="coming-soon-title">Coming soon</h1>
        <p className="coming-soon-text">
          This tool is under development. Try our Compress PDF tool in the meantime.
        </p>
        <Link href={`${lp}/tools`} className="coming-soon-btn">
          All PDF Tools
        </Link>
      </main>
    </div>
  )
}
