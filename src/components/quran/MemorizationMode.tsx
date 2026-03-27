import { useState, useCallback } from 'react'
import { Eye, EyeOff, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { QuranAyah } from '@/types/quranText'

interface MemorizationModeProps {
  ayahs: QuranAyah[]
  visible: boolean
}

type HideLevel = 0 | 1 | 2 | 3

export default function MemorizationMode({ ayahs, visible }: MemorizationModeProps) {
  const t = useT()
  const { arabicFontSize } = useUiStore()
  const [hideLevel, setHideLevel] = useState<HideLevel>(1)
  // Use a plain object for reliable re-renders (Set doesn't trigger React updates)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const toggleReveal = useCallback((num: number) => {
    setRevealed(prev => ({ ...prev, [num]: !prev[num] }))
  }, [])

  const resetAll = useCallback(() => {
    setRevealed({})
  }, [])

  const nextLevel = () => setHideLevel(l => Math.min(3, l + 1) as HideLevel)
  const prevLevel = () => setHideLevel(l => Math.max(0, l - 1) as HideLevel)

  if (!visible) return null

  return (
    <div className="space-y-3">
      {/* Controls bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-accent border border-border/40">
        <div className="flex items-center gap-2">
          <EyeOff className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">{t.memorization_title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" onClick={prevLevel} disabled={hideLevel <= 0}
            className="w-6 h-6 text-foreground/60">
            <ChevronLeft className="w-3 h-3" />
          </Button>
          <span className="text-[10px] text-muted-foreground tabular-nums w-14 text-center">
            {t.memorization_level} {hideLevel}/3
          </span>
          <Button variant="ghost" size="icon-sm" onClick={nextLevel} disabled={hideLevel >= 3}
            className="w-6 h-6 text-foreground/60">
            <ChevronRight className="w-3 h-3" />
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button variant="ghost" size="icon-sm" onClick={resetAll}
            className="w-6 h-6 text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Ayahs */}
      <div className="space-y-2">
        {ayahs.map(ayah => {
          const isRevealed = !!revealed[ayah.numberInSurah]
          const words = ayah.text.split(/\s+/).filter(Boolean)
          const totalWords = words.length

          // How many words to hide from the end
          let hiddenCount = 0
          if (hideLevel === 1) hiddenCount = Math.max(1, Math.floor(totalWords * 0.25))
          else if (hideLevel === 2) hiddenCount = Math.max(1, Math.floor(totalWords * 0.5))
          else if (hideLevel === 3) hiddenCount = totalWords

          // When revealed or level 0, show everything
          const showAll = isRevealed || hideLevel === 0
          const splitAt = showAll ? totalWords : totalWords - hiddenCount

          return (
            <button
              key={ayah.numberInSurah}
              type="button"
              onClick={() => toggleReveal(ayah.numberInSurah)}
              className={cn(
                'w-full text-right rounded-xl border px-4 py-3 transition-all duration-200 cursor-pointer',
                isRevealed
                  ? 'bg-primary/5 border-primary/20'
                  : 'border-transparent hover:border-border/40 hover:bg-accent/30'
              )}
            >
              <div className="flex items-start gap-3" dir="rtl">
                {/* Ayah number */}
                <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mt-1">
                  <span className="text-[10px] font-bold tabular-nums text-primary">
                    {ayah.numberInSurah}
                  </span>
                </div>

                {/* Text with hidden portions */}
                <p className="font-arabic leading-[2.2] flex-1 text-right"
                  style={{ fontSize: `${arabicFontSize}rem` }}>
                  {/* Visible words */}
                  {words.slice(0, splitAt).map((w, i) => (
                    <span key={i} className="text-foreground">{w}{' '}</span>
                  ))}

                  {/* Hidden words — show blanks or revealed text */}
                  {!showAll && words.slice(splitAt).map((w, i) => (
                    <span
                      key={`h-${i}`}
                      className="inline-block mx-0.5 rounded bg-primary/12 border border-primary/20 align-middle"
                      style={{
                        width: `${Math.max(2, w.length * 0.6)}em`,
                        height: '1.2em',
                      }}
                    />
                  ))}

                  {/* Revealed words (green tint) */}
                  {showAll && hideLevel > 0 && words.slice(splitAt).map((w, i) => (
                    <span key={`r-${i}`} className="text-primary">{w}{' '}</span>
                  ))}

                  {/* Tap hint */}
                  {!showAll && hiddenCount > 0 && (
                    <span className="inline-block align-middle mx-1">
                      <Eye className="w-3 h-3 text-primary/30 inline" />
                    </span>
                  )}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
