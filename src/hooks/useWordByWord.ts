import { useQuery } from '@tanstack/react-query'

export interface WordData {
  id: number
  position: number
  text: string        // Arabic word
  translation: string // English meaning
  transliteration?: string
}

interface WbwAyah {
  number: number
  text: string
  numberInSurah: number
  words?: WordData[]
}

// Fetch word-by-word data for a surah
async function fetchWordByWord(surahNumber: number): Promise<WbwAyah[]> {
  // Use quran.com API v4 for word-by-word data
  const res = await fetch(
    `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahNumber}`
  )
  const data = await res.json()

  // Also fetch word translations
  const wbwRes = await fetch(
    `https://api.quran.com/api/v4/quran/translations/131?chapter_number=${surahNumber}`
  )
  const wbwData = await wbwRes.json()

  // The quran.com v4 API provides words per verse through a different endpoint
  // Simplified: return verse-level data for now
  const verses = data.verses ?? []
  return verses.map((v: any) => ({
    number: v.id,
    text: v.text_uthmani ?? '',
    numberInSurah: v.verse_key?.split(':')[1] ?? 0,
  }))
}

export function useWordByWord(surahNumber: number | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['word-by-word', surahNumber],
    queryFn: () => fetchWordByWord(surahNumber!),
    enabled: !!surahNumber && enabled,
    staleTime: Infinity,
  })
}
