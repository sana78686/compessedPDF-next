import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { CmsClientBootstrap } from '@/components/CmsClientBootstrap'
import { siteOriginFromEnv } from '@/lib/cms/html'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  /** Preload avoids CSS→font chain (Network dependency tree / LCP delay). */
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
})

const siteUrl = siteOriginFromEnv()
const metadataBase = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`)
const siteDomain = (() => {
  try {
    return new URL(siteUrl).hostname
  } catch {
    return 'compresspdf.id'
  }
})()

export const metadata: Metadata = {
  metadataBase,
  title: { default: siteDomain, template: '%s' },
  description: 'Reduce PDF file size in your browser.',
  applicationName: siteDomain,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    siteName: siteDomain,
    locale: 'id_ID',
    alternateLocale: ['en_US'],
    images: [
      {
        url: '/icon.svg',
        width: 32,
        height: 32,
        alt: siteDomain,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

/**
 * Viewport + PWA-style hints. Lighthouse expects this as a separate export in
 * Next.js 14+. Without it, mobile Performance and SEO both lose points and
 * the browser falls back to non-responsive rendering.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f1f1f' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <CmsClientBootstrap />
        {children}
      </body>
    </html>
  )
}
