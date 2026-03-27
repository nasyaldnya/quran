import { useState, useEffect, useMemo } from 'react'
import { useUiStore } from '@/store/uiStore'

interface TajweedTextProps {
  surahNumber: number
  ayahNumber: number
  visible: boolean
}

// The alquran.cloud tajweed API returns bracket notation:
//   [rule_code[text]  or  [rule_code:param[text]
// We parse these into colored <span> elements.

const TAJWEED_COLORS: Record<string, string> = {
  h: '#AAAAAA',   // hamzat wasl
  s: '#AAAAAA',   // laam shamsiyah
  l: '#AAAAAA',   // silent
  n: '#537FFF',   // madda normal (2 counts)
  p: '#4050FF',   // madda permissible (4-5 counts)
  o: '#000FB0',   // madda obligatory (6 counts)
  q: '#DD0008',   // qalqalah
  f: '#D500B7',   // ikhfaa
  w: '#D500B7',   // ikhfaa shafawi
  i: '#26BFFD',   // iqlab
  g: '#FF7E1E',   // ghunnah (2 counts)
  d: '#169200',   // idghaam ghunnah
  b: '#169200',   // idghaam without ghunnah
  m: '#A1A100',   // idghaam mutajanisayn
  t: '#A1A100',   // idghaam mutaqaribayn
  u: '#D500B7',   // ikhfaa shafawi (variant)
}

function parseTajweed(raw: string): { text: string; color: string | null }[] {
  const parts: { text: string; color: string | null }[] = []
  let i = 0

  while (i < raw.length) {
    if (raw[i] === '[') {
      // Find the rule code: [x[ or [x:nn[
      const ruleEnd = raw.indexOf('[', i + 1)
      if (ruleEnd === -1) {
        // Malformed — treat rest as plain text
        parts.push({ text: raw.slice(i), color: null })
        break
      }

      const rulePart = raw.slice(i + 1, ruleEnd) // e.g. "n" or "h:11" or "u:12"
      const ruleCode = rulePart.split(':')[0]     // just the letter

      // Find closing ]
      const closeIdx = raw.indexOf(']', ruleEnd + 1)
      if (closeIdx === -1) {
        parts.push({ text: raw.slice(i), color: null })
        break
      }

      const innerText = raw.slice(ruleEnd + 1, closeIdx)
      const color = TAJWEED_COLORS[ruleCode] ?? null
      parts.push({ text: innerText, color })
      i = closeIdx + 1
    } else {
      // Plain text until next [
      const nextBracket = raw.indexOf('[', i)
      const end = nextBracket === -1 ? raw.length : nextBracket
      const chunk = raw.slice(i, end)
      if (chunk) parts.push({ text: chunk, color: null })
      i = end
    }
  }

  return parts
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
    <p
      className="font-arabic leading-[2.2] text-right py-1"
      dir="rtl"
      lang="ar"
      style={{ fontSize: `${arabicFontSize}rem` }}
    >
      {parts.map((part, i) =>
        part.color ? (
          <span key={i} style={{ color: part.color }}>{part.text}</span>
        ) : (
          <span key={i} className="text-foreground">{part.text}</span>
        )
      )}
    </p>
  )
}
