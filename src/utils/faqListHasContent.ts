export function faqListHasContent(res: { faq?: { question?: string; answer?: string }[] }) {
  const list = res?.faq
  if (!Array.isArray(list) || list.length === 0) return false
  return list.some((item) => {
    const strip = (s: string | undefined) =>
      String(s ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    return strip(item.question).length > 0 || strip(item.answer).length > 0
  })
}
