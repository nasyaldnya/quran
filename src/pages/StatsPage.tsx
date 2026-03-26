import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Clock, BookOpen, Flame, Music2 } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { useProgressStore } from '@/store/progressStore'
import { SURAH_NAMES } from '@/lib/utils'
import { useT } from '@/lib/i18n'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function StatsPage() {
  const t = useT()
  const { totalListeningSeconds, totalSurahsPlayed, streakDays, mostPlayedSurahs } = useAnalyticsStore()
  const weekStats = useAnalyticsStore((s) => s.getWeekStats())
  const { getListenedCount, getReadCount } = useProgressStore()

  const topSurahs = useMemo(() => {
    return Object.entries(mostPlayedSurahs)
      .map(([num, count]) => ({ num: Number(num), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [mostPlayedSurahs])

  const maxWeekVal = Math.max(...weekStats.map((d) => d.listeningSeconds), 1)

  const stats = [
    { icon: Clock, value: formatDuration(totalListeningSeconds), label: t.stats_total_time },
    { icon: Music2, value: String(totalSurahsPlayed), label: t.stats_surahs_played },
    { icon: Flame, value: `${streakDays}`, label: t.stats_streak },
    { icon: BookOpen, value: `${getListenedCount()}/114`, label: t.progress_listened },
  ]

  return (
    <PageTransition>
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block" opacity={0.05} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">{t.stats_label}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">{t.stats_title}</h1>
            <p className="text-muted-foreground max-w-lg">{t.stats_subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border/60 bg-card p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Weekly activity chart */}
        <div className="rounded-xl border border-border/60 bg-card p-5 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t.stats_weekly}</h3>
          <div className="flex items-end gap-2 h-32" dir="ltr">
            {weekStats.map((day) => {
              const pct = Math.max(4, (day.listeningSeconds / maxWeekVal) * 100)
              const dayLabel = new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-t-md bg-primary/20 relative" style={{ height: `${pct}%` }}>
                    <div className="absolute inset-x-0 bottom-0 rounded-t-md bg-primary transition-all"
                      style={{ height: day.listeningSeconds > 0 ? '100%' : '0%' }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{dayLabel}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Most played surahs */}
        {topSurahs.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t.stats_most_played}</h3>
            <div className="space-y-2">
              {topSurahs.map(({ num, count }, i) => (
                <div key={num} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary w-5">{i + 1}</span>
                  <span className="text-sm text-foreground flex-1">{SURAH_NAMES[num] ?? `Surah ${num}`}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
