import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import SearchBar from '@/components/common/SearchBar'
import ReciterGrid from '@/components/reciters/ReciterGrid'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useReciters } from '@/hooks/useReciters'
import { useDebounce } from '@/hooks/useDebounce'
import { RECITATION_STYLES, reciterHasStyle, type RecitationStyle } from '@/lib/recitationStyles'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function RecitersPage() {
  const t = useT()
  const [search,       setSearch]       = useState('')
  const [activeLetter, setActiveLetter] = useState<string>('all')
  const [activeStyle,  setActiveStyle]  = useState<RecitationStyle | 'all'>('all')
  const debouncedSearch = useDebounce(search, 280)

  const { data: reciters = [], isLoading, error } = useReciters()

  // Derive unique letters from actual data (works for Arabic + Latin)
  const availableLetters = useMemo(() => {
    const letters = new Set<string>()
    for (const r of reciters) {
      if (r.letter) letters.add(r.letter)
    }
    return Array.from(letters).sort()
  }, [reciters])

  const filtered = useMemo(() => {
    let list = reciters

    // Letter filter — use the API's letter field
    if (activeLetter !== 'all') {
      list = list.filter((r) => r.letter === activeLetter)
    }

    // Style filter
    if (activeStyle !== 'all') {
      list = list.filter((r) => r.moshaf.length > 0 && reciterHasStyle(r.moshaf, activeStyle))
    }

    // Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter((r) => r.name.toLowerCase().includes(q))
    }

    return list
  }, [reciters, activeLetter, activeStyle, debouncedSearch])

  return (
    <PageTransition>
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern
          className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block"
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
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                {t.nav_reciters}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">
              {t.reciters_title}
              <span className="ml-3 text-2xl font-normal text-muted-foreground arabic">القراء</span>
            </h1>
            <p className="text-muted-foreground max-w-lg">
              {t.reciters_subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t.search_reciters}
            className="w-full sm:w-80"
          />

          {/* Letter filters — derived from actual reciter data */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setActiveLetter('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                activeLetter === 'all'
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-card text-muted-foreground border border-border hover:border-border/80 hover:text-foreground'
              )}
            >
              {t.all}
            </button>
            {availableLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 min-w-[2rem] text-center',
                  activeLetter === letter
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-card text-muted-foreground border border-border hover:border-border/80 hover:text-foreground'
                )}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Style filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveStyle('all')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                activeStyle === 'all'
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-card text-muted-foreground border border-border hover:border-border/80 hover:text-foreground'
              )}
            >
              {t.all}
            </button>
            {RECITATION_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStyle(s.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  activeStyle === s.id
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-card text-muted-foreground border border-border hover:border-border/80 hover:text-foreground'
                )}
              >
                {(t as any)[s.labelKey] ?? s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        {!isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground mt-3"
          >
            {filtered.length} {t.reciters_found}
          </motion.p>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <ReciterGrid
          reciters={filtered}
          isLoading={isLoading}
          error={error as Error | null}
        />
      </div>
    </PageTransition>
  )
}
