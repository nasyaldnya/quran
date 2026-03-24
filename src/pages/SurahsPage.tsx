import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import SurahCard from '@/components/surahs/SurahCard'
import PageTransition from '@/components/common/PageTransition'
import SearchBar from '@/components/common/SearchBar'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useDebounce } from '@/hooks/useDebounce'
import { SURAH_NAMES, SURAH_NAMES_AR, REVELATION_TYPE, cn } from '@/lib/utils'

type RevealFilter = 'All' | 'Makki' | 'Madani'
const REVEAL_OPTIONS: RevealFilter[] = ['All', 'Makki', 'Madani']

// Full list of 114 surah numbers
const ALL_SURAH_NUMBERS = Array.from({ length: 114 }, (_, i) => i + 1)

export default function SurahsPage() {
  const [search,      setSearch]      = useState('')
  const [revealFilter, setRevealFilter] = useState<RevealFilter>('All')
  const debouncedSearch = useDebounce(search, 280)

  const filtered = useMemo(() => {
    return ALL_SURAH_NUMBERS.filter((num) => {
      // Revelation type filter
      if (revealFilter !== 'All' && REVELATION_TYPE[num] !== revealFilter) return false
      // Search filter
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase()
        const nameEn = (SURAH_NAMES[num]    ?? '').toLowerCase()
        const nameAr =  SURAH_NAMES_AR[num] ?? ''
        if (!nameEn.includes(q) && !nameAr.includes(q) && !String(num).includes(q)) {
          return false
        }
      }
      return true
    })
  }, [debouncedSearch, revealFilter])

  const makkiCount  = ALL_SURAH_NUMBERS.filter((n) => REVELATION_TYPE[n] === 'Makki').length
  const madaniCount = ALL_SURAH_NUMBERS.filter((n) => REVELATION_TYPE[n] === 'Madani').length

  return (
    <PageTransition>
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern
          className="absolute right-8 top-1/2 -translate-y-1/2 w-72 h-72 text-primary hidden lg:block"
          opacity={0.05}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Surahs</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">
              All 114 Surahs
              <span className="ml-3 text-2xl font-normal text-muted-foreground arabic">السور</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mb-6">
              Browse every chapter of the Holy Quran, from Al-Fatihah to An-Nas.
            </p>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {makkiCount} Makki
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {madaniCount} Madani
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or number…"
            className="w-full sm:w-80"
          />

          <div className="flex items-center gap-1.5">
            {REVEAL_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setRevealFilter(f)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
                  revealFilter === f
                    ? f === 'Makki'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : f === 'Madani'
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      : 'bg-primary/15 text-primary border-primary/30'
                    : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {!filtered.length ? null : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground mt-3"
          >
            Showing {filtered.length} of 114 surahs
          </motion.p>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold mb-1">No surahs found</p>
            <p className="text-sm text-muted-foreground">Try a different name or number.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((num, i) => (
              <SurahCard key={num} surahNumber={num} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
