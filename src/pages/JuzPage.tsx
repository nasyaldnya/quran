import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, BookOpen } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import SurahCard from '@/components/surahs/SurahCard'
import { getSurahsInJuz } from '@/lib/juzData'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function JuzPage() {
  const t = useT()
  const [selectedJuz, setSelectedJuz] = useState(1)
  const surahs = getSurahsInJuz(selectedJuz)

  return (
    <PageTransition>
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block" opacity={0.05} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">{t.juz_navigation}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">
              {t.juz_title}
              <span className="ml-3 text-2xl font-normal text-muted-foreground arabic">الأجزاء</span>
            </h1>
            <p className="text-muted-foreground max-w-lg">{t.juz_subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Juz selector grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 mb-8">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
            <button
              key={juz}
              onClick={() => setSelectedJuz(juz)}
              className={cn(
                'h-10 rounded-lg text-sm font-semibold tabular-nums transition-all duration-200 border',
                selectedJuz === juz
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground'
              )}
            >
              {juz}
            </button>
          ))}
        </div>

        {/* Selected juz info */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t.juz_label} {selectedJuz}</p>
            <p className="text-xs text-muted-foreground">{surahs.length} {t.surahs_word}</p>
          </div>
        </div>

        {/* Surahs in this juz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {surahs.map((num, i) => (
            <SurahCard key={num} surahNumber={num} index={i} />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
