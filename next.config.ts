import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@quicktoolsone/pdf-compress'],
  serverExternalPackages: ['pdfjs-dist'],
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
}

export default nextConfig
