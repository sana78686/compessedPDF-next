import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@quicktoolsone/pdf-compress'],
  serverExternalPackages: ['pdfjs-dist'],
}

export default nextConfig
