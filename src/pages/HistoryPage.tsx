import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock, Play, Pause, Trash2, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useHistoryStore, type HistoryEntry } from '@/store/historyStore'
import { useAudioStore } from '@/store/audioStore'
import { useT } from '@/lib/i18n'
import { cn, REVELATION_TYPE, VERSE_COUNTS } from '@/lib/utils'

// Group entries by date label
function groupByDate(entries: HistoryEntry[]): { label: string; items: HistoryEntry[] }[] {
  const groups: Map<string, HistoryEntry[]> = new Map()

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  for (const entry of entries) {
    const d = new Date(entry.playedAt)
    let label: string

    if (d.toDateString() === today.toDateString()) {
      label = 'Today'
    } else if (d.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday'
    } else {
      label = d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    }

    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(entry)
  }

  return Array.from(groups, ([label, items]) => ({ label, items }))
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoryPage() {
  const t = useT()
  const { entries, removeEntry, clearHistory } = useHistoryStore()
  const { currentTrack, isPlaying, isLoading, setCurrentTrack, setIsPlaying } = useAudioStore()

  const grouped = useMemo(() => groupByDate(entries), [entries])

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
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              {t.history_title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {entries.length === 0
                ? t.history_empty
                : `${entries.length} ${t.recently_played}`}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Clear button */}
        {entries.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="text-muted-foreground hover:text-destructive text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              {t.clear_history}
            </Button>
          </div>
        )}

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">{t.history_empty}</p>
            <p className="text-sm text-muted-foreground mb-6">
              {t.history_empty_desc}
            </p>
            <Button variant="outline" asChild>
              <Link to="/reciters">{t.browse_reciters}</Link>
            </Button>
          </div>
        )}

        {/* Grouped list */}
        {grouped.map((group) => (
          <div key={group.label} className="mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-1">
              {group.label}
            </h2>
            <div className="space-y-1">
              {group.items.map((entry, i) => {
                const isActive = currentTrack?.audioUrl === entry.track.audioUrl
                const isThisPlaying = isActive && isPlaying
                const isThisLoading = isActive && isLoading

                const handleClick = () => {
                  if (isActive) {
                    setIsPlaying(!isPlaying)
                  } else {
                    setCurrentTrack(entry.track)
                  }
                }

                return (
                  <motion.div
                    key={`${entry.track.audioUrl}-${entry.playedAt}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.025, 0.5), duration: 0.3 }}
                  >
                    <button
                      onClick={handleClick}
                      className={cn(
                        'w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-left',
                        isActive
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-accent border border-transparent hover:border-border/60'
                      )}
                    >
                      {/* Play icon */}
                      <div
                        className={cn(
                          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
                          isActive ? 'bg-primary/20' : 'bg-muted group-hover:bg-primary/10'
                        )}
                      >
                        {isThisLoading ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : isThisPlaying ? (
                          <Pause className="w-4 h-4 text-primary fill-current" />
                        ) : (
                          <Play className="w-4 h-4 text-primary fill-current ml-0.5" />
                        )}
                      </div>

                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-sm font-semibold truncate',
                              isActive ? 'text-primary' : 'text-foreground'
                            )}
                          >
                            {entry.track.surahNameEn}
                          </span>
                          <span className="font-arabic text-sm text-muted-foreground">
                            {entry.track.surahNameAr}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Link
                            to={`/reciters/${entry.track.reciterId}`}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {entry.track.reciterName}
                          </Link>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="text-xs text-muted-foreground/60">
                            {formatTimeAgo(entry.playedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Surah number badge */}
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 flex-shrink-0 hidden sm:flex"
                      >
                        #{entry.track.surahNumber}
                      </Badge>
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  )
}
