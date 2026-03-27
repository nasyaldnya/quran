import { useState, useMemo, useCallback } from 'react'
import { Eye, EyeOff, RotateCcw, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { QuranAyah } from '@/types/quranText'

interface MemorizationModeProps {
  ayahs: QuranAyah[]
  visible: boolean
}

type HideLevel = 0 | 1 | 2 | 3 // 0=show all, 1=hide last word, 2=hide half, 3=hide all

export default function MemorizationMode({ ayahs, visible }: MemorizationModeProps) {
  const t = useT()
  const { arabicFontSize } = useUiStore()
  const [hideLevel, setHideLevel] = useState<HideLevel>(1)
  const [revealedAyahs, setRevealedAyahs] = useState<Set<number>>(new Set())

  const toggleReveal = useCallback((num: number) => {
    setRevealedAyahs(prev => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }, [])

  const resetAll = useCallback(() => setRevealedAyahs(new Set()), [])

  const nextLevel = () => setHideLevel(l => Math.min(3, l + 1) as HideLevel)
  const prevLevel = () => setHideLevel(l => Math.max(0, l - 1) as HideLevel)

  if (!visible) return null

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-accent border border-border/40">
        <div className="flex items-center gap-2">
          <EyeOff className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">{t.memorization_title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" onClick={prevLevel} disabled={hideLevel <= 0}
            className="w-6 h-6 text-foreground/60">
            <ChevronRight className="w-3 h-3 rotate-180" />
          </Button>
          <span className="text-[10px] text-muted-foreground tabular-nums w-12 text-center">
            {t.memorization_level} {hideLevel}/3
          </span>
          <Button variant="ghost" size="icon-sm" onClick={nextLevel} disabled={hideLevel >= 3}
            className="w-6 h-6 text-foreground/60">
            <ChevronRight className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={resetAll}
            className="w-6 h-6 text-muted-foreground hover:text-foreground ml-1">
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Ayahs with hidden words */}
      <div className="space-y-2">
        {ayahs.map(ayah => {
          const isRevealed = revealedAyahs.has(ayah.numberInSurah)
          const words = ayah.text.split(' ')
          const totalWords = words.length

          // Calculate how many words to hide
          let hiddenCount = 0
          if (!isRevealed) {
            if (hideLevel === 1) hiddenCount = Math.max(1, Math.floor(totalWords * 0.25))
            else if (hideLevel === 2) hiddenCount = Math.max(1, Math.floor(totalWords * 0.5))
            else if (hideLevel === 3) hiddenCount = totalWords
          }

          const visibleWords = words.slice(0, totalWords - hiddenCount)
          const hiddenWords = words.slice(totalWords - hiddenCount)

          return (
            <div key={ayah.numberInSurah}
              className="group rounded-xl border border-transparent hover:border-border/40 hover:bg-accent/30 px-4 py-3 transition-all cursor-pointer"
              onClick={() => toggleReveal(ayah.numberInSurah)}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mt-1">
                  <span className="text-[10px] font-bold tabular-nums text-primary">{ayah.numberInSurah}</span>
                </div>
                <p className="font-arabic leading-[2.2] text-right flex-1" dir="rtl"
                  style={{ fontSize: `${arabicFontSize}rem` }}>
                  {visibleWords.map((w, i) => (
                    <span key={i} className="text-foreground">{w} </span>
                  ))}
                  {hiddenWords.length > 0 && !isRevealed && (
                    <span className="inline-flex items-center gap-1">
                      {hiddenWords.map((_, i) => (
                        <span key={i} className="inline-block w-12 h-5 rounded bg-primary/15 border border-primary/20" />
                      ))}
                      <Eye className="w-3 h-3 text-primary/40 inline ml-1" />
                    </span>
                  )}
                  {isRevealed && hiddenWords.length > 0 && (
                    <span className="text-primary">{hiddenWords.join(' ')} </span>
                  )}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
