import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn, SURAH_NAMES, SURAH_NAMES_AR, REVELATION_TYPE, VERSE_COUNTS } from '@/lib/utils'

interface SurahCardProps {
  surahNumber: number
  index:       number
}

export default function SurahCard({ surahNumber, index }: SurahCardProps) {
  const nameEn      = SURAH_NAMES[surahNumber]  ?? `Surah ${surahNumber}`
  const nameAr      = SURAH_NAMES_AR[surahNumber] ?? ''
  const revealType  = REVELATION_TYPE[surahNumber]
  const verseCount  = VERSE_COUNTS[surahNumber]  ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1   }}
      transition={{ delay: Math.min(index * 0.012, 1.2), duration: 0.3 }}
      className="group relative rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-gold-sm transition-all duration-300 hover:-translate-y-0.5 cursor-default"
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gold-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-xl" />

      <div className="flex items-center gap-3">
        {/* Number badge */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
          <span className="text-xs font-bold tabular-nums text-primary">{surahNumber}</span>
        </div>

        {/* Names */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
            {nameEn}
          </p>
          <p className="text-xs text-muted-foreground">{verseCount} verses</p>
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
    </motion.div>
  )
}
