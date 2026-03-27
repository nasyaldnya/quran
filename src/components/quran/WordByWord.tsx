import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'

interface WordData {
  arabic: string
  translation: string
}

interface WordByWordProps {
  surahNumber: number
  ayahNumber: number
  visible: boolean
}

export default function WordByWord({ surahNumber, ayahNumber, visible }: WordByWordProps) {
  const t = useT()
  const [words, setWords] = useState<WordData[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    if (!visible) return
    setLoading(true)
    setWords([])
    setSelected(null)

    // Fetch word-by-word data from alquran.cloud
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/quran-uthmani`).then(r => r.json()),
      fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.transliteration`).then(r => r.json()),
    ]).then(([arRes, enRes]) => {
      const arText = arRes.data?.text ?? ''
      const enText = enRes.data?.text ?? ''
      const arWords = arText.split(' ').filter(Boolean)
      const enWords = enText.split(' ').filter(Boolean)

      const result: WordData[] = arWords.map((w: string, i: number) => ({
        arabic: w,
        translation: enWords[i] ?? '',
      }))
      setWords(result)
    }).catch(() => setWords([]))
      .finally(() => setLoading(false))
  }, [surahNumber, ayahNumber, visible])

  if (!visible) return null

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-[10px] text-muted-foreground">{t.loading_word_by_word}</span>
      </div>
    )
  }

  if (words.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 py-2" dir="rtl">
      {words.map((w, i) => (
        <button
          key={i}
          onClick={() => setSelected(selected === i ? null : i)}
          className={`group relative px-2 py-1.5 rounded-lg text-sm font-arabic transition-all border ${
            selected === i
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'border-transparent hover:bg-accent hover:border-border/40 text-foreground'
          }`}
        >
          <span className="block text-center">{w.arabic}</span>
          {selected === i && w.translation && (
            <span className="block text-center text-[10px] text-muted-foreground mt-0.5 font-sans" dir="ltr">
              {w.translation}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
