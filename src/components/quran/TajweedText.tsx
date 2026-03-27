import { useState, useEffect, useMemo } from 'react'
import { useUiStore } from '@/store/uiStore'
import { parseTajweed } from '@/lib/tajweedParser'

interface TajweedTextProps {
  surahNumber: number
  ayahNumber: number
  visible: boolean
}

export default function TajweedText({ surahNumber, ayahNumber, visible }: TajweedTextProps) {
  const [rawText, setRawText] = useState('')
  const [loading, setLoading] = useState(false)
  const { arabicFontSize } = useUiStore()

  useEffect(() => {
    if (!visible) return
    setLoading(true)
    setRawText('')
    fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/quran-tajweed`)
      .then(r => r.json())
      .then(data => setRawText(data.data?.text ?? ''))
      .catch(() => setRawText(''))
      .finally(() => setLoading(false))
  }, [surahNumber, ayahNumber, visible])

  const parts = useMemo(() => parseTajweed(rawText), [rawText])

  if (!visible || (!rawText && !loading)) return null
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <p className="font-arabic leading-[2.2] text-right py-1" dir="rtl" lang="ar"
      style={{ fontSize: `${arabicFontSize}rem` }}>
      {parts.map((part, i) =>
        part.color
          ? <span key={i} style={{ color: part.color }}>{part.text}</span>
          : <span key={i} className="text-foreground">{part.text}</span>
      )}
    </p>
  )
}
