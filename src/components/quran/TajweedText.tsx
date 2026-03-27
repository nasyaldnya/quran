import { useState, useEffect } from 'react'
import { useUiStore } from '@/store/uiStore'

interface TajweedTextProps {
  surahNumber: number
  ayahNumber: number
  visible: boolean
}

// Tajweed edition returns HTML with color-coded spans
export default function TajweedText({ surahNumber, ayahNumber, visible }: TajweedTextProps) {
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const { arabicFontSize } = useUiStore()

  useEffect(() => {
    if (!visible) return
    setLoading(true)
    setHtml('')

    fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/quran-tajweed`)
      .then(r => r.json())
      .then(data => {
        const text = data.data?.text ?? ''
        // The API returns text with CSS classes for tajweed rules
        // We wrap it with our own styling
        setHtml(text)
      })
      .catch(() => setHtml(''))
      .finally(() => setLoading(false))
  }, [surahNumber, ayahNumber, visible])

  if (!visible || (!html && !loading)) return null

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="font-arabic leading-[2.2] text-foreground text-right tajweed-text py-1"
      dir="rtl"
      lang="ar"
      style={{ fontSize: `${arabicFontSize}rem` }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
