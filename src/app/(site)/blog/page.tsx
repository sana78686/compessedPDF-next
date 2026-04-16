import type { Metadata } from 'next'
import { BlogListView } from '@/components/blog/BlogListView'
import { translations } from '@/i18n/translations'
import { socialMetadata } from '@/lib/seoMetadata'

export const revalidate = 60

const b = translations.id.blog

export const metadata: Metadata = {
  title: b.listTitle,
  description: b.listIntro,
  alternates: { canonical: '/blog' },
  ...socialMetadata({
    title: b.listTitle,
    description: b.listIntro,
    path: '/blog',
    ogLocale: 'id_ID',
  }),
}

export default function BlogListPage() {
  return <BlogListView locale="id" />
}
