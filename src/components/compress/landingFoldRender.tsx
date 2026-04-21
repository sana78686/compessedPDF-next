/** Icon key → emoji for CMS-driven cards (shared server + client). */
export const CARD_ICON_EMOJI: Record<string, string> = {
  lightning: '⚡',
  quality: '🎚️',
  lock: '🔒',
  star: '✨',
  document: '📄',
  shield: '🛡️',
  heart: '❤️',
  cloud: '☁️',
  download: '⬇️',
  upload: '⬆️',
  check: '✅',
  image: '🖼️',
  'file-plus': '📎',
  layers: '📑',
  sparkle: '✨',
  zap: '⚡',
  settings: '⚙️',
  globe: '🌐',
  mobile: '📱',
  clock: '⏱️',
}

type MediaItem = {
  media_type?: string
  media_value?: string
  id?: number
  title?: string
  description?: string
}

export function LandingMediaIcon({ item, idx }: { item: MediaItem; idx: number }) {
  const type = String(item.media_type || '').toLowerCase()
  const val = String(item.media_value || '').trim()
  if (type === 'number' || type === 'numbered') {
    return <span className="landing-step-num" aria-hidden="true">{val || idx + 1}</span>
  }
  if (type === 'fa-icon' && val) {
    return <i className={val} aria-hidden="true" />
  }
  if (type === 'icon' && val && CARD_ICON_EMOJI[val]) {
    return <span className="landing-card-icon" aria-hidden="true">{CARD_ICON_EMOJI[val]}</span>
  }
  if (type === 'image' && val) {
    return <img src={val} alt="" className="landing-step-img" loading="lazy" aria-hidden="true" />
  }
  return <span className="landing-step-num" aria-hidden="true">{idx + 1}</span>
}
