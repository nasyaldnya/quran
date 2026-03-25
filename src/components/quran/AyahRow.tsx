import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import type { QuranAyah } from '@/types/quranText'

interface AyahRowProps {
  ayah: QuranAyah
  translationAyah?: QuranAyah | null
  tafsirAyah?: QuranAyah | null
  translationDirection?: 'ltr' | 'rtl'
  tafsirDirection?: 'ltr' | 'rtl'
  hasTafsir: boolean
}

export default function AyahRow({
  ayah,
  translationAyah,
  tafsirAyah,
  translationDirection = 'ltr',
  tafsirDirection = 'rtl',
  hasTafsir,
}: AyahRowProps) {
  const { expandedAyah, toggleExpandedAyah } = useUiStore()
  const isExpanded = expandedAyah === ayah.numberInSurah

  return (
    <div
      className={cn(
        'group rounded-xl border transition-all duration-200 px-4 py-4',
        isExpanded
          ? 'bg-primary/5 border-primary/20'
          : 'border-transparent hover:bg-accent/50'
      )}
    >
      {/* ── Ayah number badge ── */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
          <span className="text-xs font-bold tabular-nums text-primary">
            {ayah.numberInSurah}
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {/* ── Arabic text ── */}
          <p
            className="font-arabic text-2xl leading-[2.2] text-foreground text-right"
            dir="rtl"
            lang="ar"
          >
            {ayah.text}
            <span className="inline-block mx-1.5 text-primary/60 text-lg">
              ﴿{toArabicNumeral(ayah.numberInSurah)}﴾
            </span>
          </p>

          {/* ── Translation ── */}
          {translationAyah && (
            <p
              className={cn(
                'text-sm leading-relaxed text-muted-foreground',
                translationDirection === 'rtl' ? 'text-right font-arabic' : 'text-left'
              )}
              dir={translationDirection}
            >
              {translationAyah.text}
            </p>
          )}

          {/* ── Tafsir toggle ── */}
          {hasTafsir && tafsirAyah && (
            <div>
              <button
                onClick={() => toggleExpandedAyah(ayah.numberInSurah)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                Tafsir
                <ChevronDown
                  className={cn(
                    'w-3 h-3 transition-transform duration-200',
                    isExpanded && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        'mt-3 p-3 rounded-lg bg-muted/50 border border-border/40 text-sm leading-relaxed text-muted-foreground',
                        tafsirDirection === 'rtl' ? 'text-right font-arabic' : 'text-left'
                      )}
                      dir={tafsirDirection}
                    >
                      {tafsirAyah.text}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Helper: Convert number to Arabic-Indic numerals ──
function toArabicNumeral(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return String(num)
    .split('')
    .map((d) => arabicDigits[parseInt(d)] ?? d)
    .join('')
}
