import type { Metadata } from 'next'
import { BlogListView } from '@/components/blog/BlogListView'
import { translations } from '@/i18n/translations'

export const revalidate = 60

const b = translations.en.blog

export const metadata: Metadata = {
  title: b.listTitle,
  description: b.listIntro,
}

export default function EnBlogListPage() {
  return <BlogListView locale="en" />
}
