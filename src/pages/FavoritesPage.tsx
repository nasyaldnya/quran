import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Headphones, BookOpen, Trash2, PlayCircle, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useT } from '@/lib/i18n'
import { SURAH_NAMES, SURAH_NAMES_AR, VERSE_COUNTS, REVELATION_TYPE, cn } from '@/lib/utils'

type Tab = 'reciters' | 'surahs'

export default function FavoritesPage() {
  const t = useT()
  const [activeTab, setActiveTab] = useState<Tab>('reciters')
  const { reciters, surahs, removeReciter, removeSurah, clearAll } = useFavoritesStore()

  const sortedReciters = useMemo(
    () => [...reciters].sort((a, b) => b.addedAt - a.addedAt),
    [reciters]
  )
  const sortedSurahs = useMemo(
    () => [...surahs].sort((a, b) => b.addedAt - a.addedAt),
    [surahs]
  )

  const totalFavs = reciters.length + surahs.length

  return (
    <PageTransition>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-hero-gradient opacity-50" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] text-primary"
          opacity={0.03}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              {t.favorites_title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {totalFavs === 0
                ? t.favorites_empty
                : `${totalFavs} ${t.saved_items}`}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab bar + Clear */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border/60">
            {(['reciters', 'surahs'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                  activeTab === tab
                    ? 'bg-card text-foreground shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab === 'reciters' ? (
                  <Headphones className="w-3.5 h-3.5" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5" />
                )}
                {tab === 'reciters' ? t.nav_reciters : t.nav_surahs}
                <span className="text-xs opacity-60">
                  ({tab === 'reciters' ? reciters.length : surahs.length})
                </span>
              </button>
            ))}
          </div>

          {totalFavs > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              {t.clear_all}
            </Button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'reciters' ? (
            <motion.div
              key="reciters"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {sortedReciters.length === 0 ? (
                <EmptyState
                  icon={Headphones}
                  title={t.no_fav_reciters}
                  description={t.no_fav_reciters_desc}
                  linkTo="/reciters"
                  linkLabel={t.browse_reciters}
                />
              ) : (
                <div className="space-y-2">
                  {sortedReciters.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                    >
                      <div className="group flex items-center gap-4 px-4 py-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-accent transition-all duration-200">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sage-500/20 to-sage-700/10 border border-sage-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-arabic text-xl font-bold text-primary">
                            {r.letter || r.name.charAt(0)}
                          </span>
                        </div>

                        {/* Name */}
                        <Link
                          to={`/reciters/${r.id}`}
                          className="flex-1 min-w-0"
                        >
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {r.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(r.addedAt).toLocaleDateString()}
                          </p>
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link to={`/reciters/${r.id}`} aria-label="Go to reciter">
                              <PlayCircle className="w-4 h-4 text-primary" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeReciter(r.id)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Remove from favorites"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="surahs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {sortedSurahs.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title={t.no_fav_surahs}
                  description={t.no_fav_surahs_desc}
                  linkTo="/surahs"
                  linkLabel={t.browse_surahs}
                />
              ) : (
                <div className="space-y-2">
                  {sortedSurahs.map((su, i) => (
                    <motion.div
                      key={su.surahNumber}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                    >
                      <div className="group flex items-center gap-4 px-4 py-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-accent transition-all duration-200">
                        {/* Number */}
                        <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                            {su.surahNumber}
                          </span>
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {su.surahNameEn}
                            </p>
                            <span className="font-arabic text-sm text-muted-foreground">
                              {su.surahNameAr}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {REVELATION_TYPE[su.surahNumber] ?? 'Makki'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {VERSE_COUNTS[su.surahNumber] ?? '—'} verses
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeSurah(su.surahNumber)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Remove from favorites"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

// ── Empty state helper ─────────────────────────────
function EmptyState({
  icon: Icon,
  title,
  description,
  linkTo,
  linkLabel,
}: {
  icon: React.ElementType
  title: string
  description: string
  linkTo: string
  linkLabel: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-lg font-semibold text-foreground mb-1">{title}</p>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <Button variant="outline" asChild>
        <Link to={linkTo}>{linkLabel}</Link>
      </Button>
    </div>
  )
}
