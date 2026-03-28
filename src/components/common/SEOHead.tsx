import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  path?: string
  type?: 'website' | 'article'
  image?: string
  locale?: string
}

const BASE_TITLE = 'القرآن الكريم | mp3quran.cam'
const BASE_URL = 'https://mp3quran.cam'
const DEFAULT_DESC = 'Listen to the Holy Quran from 500+ reciters with Tajweed, translations in 30+ languages, word-by-word meanings, memorization tools, and Mushaf editions from King Fahd Complex.'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

export default function SEOHead({ title, description, path, type = 'website', image, locale = 'ar' }: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE
    const desc = description ?? DEFAULT_DESC
    const url = path ? `${BASE_URL}/#${path}` : BASE_URL
    const img = image ?? DEFAULT_IMAGE

    document.title = fullTitle

    // Standard meta
    setMeta('description', desc)
    setMeta('robots', 'index, follow')
    setMeta('author', 'mp3quran.cam')

    // Open Graph
    setMeta('og:title', fullTitle, true)
    setMeta('og:description', desc, true)
    setMeta('og:url', url, true)
    setMeta('og:type', type, true)
    setMeta('og:image', img, true)
    setMeta('og:site_name', 'mp3quran.cam', true)
    setMeta('og:locale', locale === 'ar' ? 'ar_SA' : 'en_US', true)

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', desc)
    setMeta('twitter:image', img)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) }
    canonical.setAttribute('href', url)

    // JSON-LD structured data for AI and search engines
    updateJsonLd(fullTitle, desc, url, img)

  }, [title, description, path, type, image, locale])

  return null
}

function setMeta(name: string, content: string, isOg = false) {
  const selector = isOg ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    if (isOg) el.setAttribute('property', name)
    else el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function updateJsonLd(title: string, description: string, url: string, image: string) {
  const id = 'quran-jsonld'
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'mp3quran.cam — القرآن الكريم',
    'url': 'https://mp3quran.cam',
    'description': description,
    'applicationCategory': 'ReligiousApplication',
    'operatingSystem': 'Web',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'inLanguage': ['ar', 'en', 'fr', 'tr', 'es', 'id'],
    'image': image,
    'author': {
      '@type': 'Organization',
      'name': 'mp3quran.cam',
      'url': 'https://mp3quran.cam',
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://mp3quran.cam/#/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    'featureList': [
      'Quran audio from 500+ reciters',
      'Tajweed color-coded text',
      'Word-by-word translation',
      'Memorization mode',
      'Mushaf page viewer (604 pages)',
      '49 Quran editions from King Fahd Complex',
      'Translations in 30+ languages',
      'Reciter comparison with dual players',
      'Playlists and bookmarks',
      'Juz and Hizb navigation',
      'Night reading mode',
      'Listening analytics and progress tracking',
      'Keyboard shortcuts',
      'Sleep timer',
    ],
  }

  script.textContent = JSON.stringify(data)
}
