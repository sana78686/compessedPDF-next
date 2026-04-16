import type { Metadata } from 'next'
import { BlogListView } from '@/components/blog/BlogListView'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

export const revalidate = 60

const b = translations.en.blog

export const metadata: Metadata = {
  title: b.listTitle,
  description: b.listIntro,
  alternates: { canonical: '/en/blog' },
  ...socialMetadata({
    title: b.listTitle,
    description: b.listIntro,
    path: '/en/blog',
    ogLocale: 'en_US',
  }),
}

export default function EnBlogListPage() {
  return <BlogListView locale="en" />
}
