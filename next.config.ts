import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@quicktoolsone/pdf-compress'],
  serverExternalPackages: ['pdfjs-dist'],
  poweredByHeader: false,
  compress: true,
  /** Global CMS pushes to `{site}/cms-seo-sync.php` (same as React); forward to App Router API. */
  async rewrites() {
    return [{ source: '/cms-seo-sync.php', destination: '/api/cms-seo-sync' }]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
}

export default nextConfig
