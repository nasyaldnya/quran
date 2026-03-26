import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  path?: string
}

const BASE_TITLE = 'القرآن الكريم | The Holy Quran'
const BASE_URL = 'https://mp3quran.cam'

export default function SEOHead({ title, description, path }: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE
    document.title = fullTitle

    // Open Graph
    setMeta('og:title', fullTitle)
    setMeta('og:url', path ? `${BASE_URL}${path}` : BASE_URL)
    if (description) {
      setMeta('description', description)
      setMeta('og:description', description)
    }
  }, [title, description, path])

  return null
}

function setMeta(name: string, content: string) {
  const selector = name.startsWith('og:')
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    if (name.startsWith('og:')) el.setAttribute('property', name)
    else el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
