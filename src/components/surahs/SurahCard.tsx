import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn, SURAH_NAMES, SURAH_NAMES_AR, REVELATION_TYPE, VERSE_COUNTS } from '@/lib/utils'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'

interface SurahCardProps {
  surahNumber: number
  index:       number
}

export default function SurahCard({ surahNumber, index }: SurahCardProps) {
  const t = useT()
  const { openSurah, viewingSurahNumber, isTextPanelOpen } = useUiStore()
  const nameEn      = SURAH_NAMES[surahNumber]  ?? `Surah ${surahNumber}`
  const nameAr      = SURAH_NAMES_AR[surahNumber] ?? ''
  const revealType  = REVELATION_TYPE[surahNumber]
  const verseCount  = VERSE_COUNTS[surahNumber]  ?? 0

  const isActive = isTextPanelOpen && viewingSurahNumber === surahNumber

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1   }}
      transition={{ delay: Math.min(index * 0.012, 1.2), duration: 0.3 }}
    >
      <button
        onClick={() => openSurah(surahNumber)}
        className={cn(
          'group relative w-full text-left rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer',
          isActive
            ? 'border-primary/40 shadow-sage-sm bg-primary/5'
            : 'border-border/60 hover:border-primary/40 hover:shadow-sage-sm'
        )}
      >
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-sage-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-xl" />

        <div className="flex items-center gap-3">
          {/* Number badge */}
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
            isActive
              ? 'bg-primary/20 border-primary/30'
              : 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20'
          )}>
            {isActive ? (
              <BookOpen className="w-4 h-4 text-primary" />
            ) : (
              <span className="text-xs font-bold tabular-nums text-primary">{surahNumber}</span>
            )}
          </div>

          {/* Names */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-semibold truncate transition-colors duration-200',
              isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'
            )}>
              {nameEn}
            </p>
            <p className="text-xs text-muted-foreground">{verseCount} {t.verses}</p>
          </div>

          {/* Arabic + badge */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={cn('arabic text-base', revealType === 'Makki' ? 'text-emerald-400' : 'text-blue-400')}>
              {nameAr}
            </span>
            <Badge variant={revealType === 'Makki' ? 'makkia' : 'madania'} className="text-[9px] px-1.5 py-0">
              {revealType}
            </Badge>
          </div>
        </div>
      </button>
    </motion.div>
  )
}
