import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DailyStats {
  date: string // YYYY-MM-DD
  listeningSeconds: number
  surahsPlayed: number
}

interface AnalyticsState {
  totalListeningSeconds: number
  totalSurahsPlayed: number
  streakDays: number
  lastActiveDate: string
  dailyStats: DailyStats[]
  mostPlayedSurahs: Record<number, number> // surahNumber -> count

  logPlay: (surahNumber: number, durationSeconds: number) => void
  getTodayStats: () => DailyStats
  getWeekStats: () => DailyStats[]
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      totalListeningSeconds: 0,
      totalSurahsPlayed: 0,
      streakDays: 0,
      lastActiveDate: '',
      dailyStats: [],
      mostPlayedSurahs: {},

      logPlay: (surahNumber, durationSeconds) => {
        const today = getToday()
        set((s) => {
          // Update streak
          let streak = s.streakDays
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]

          if (s.lastActiveDate === today) {
            // Same day, keep streak
          } else if (s.lastActiveDate === yesterdayStr) {
            streak += 1
          } else if (s.lastActiveDate !== today) {
            streak = 1
          }

          // Update daily stats
          const stats = [...s.dailyStats]
          const todayIdx = stats.findIndex((d) => d.date === today)
          if (todayIdx >= 0) {
            stats[todayIdx] = {
              ...stats[todayIdx],
              listeningSeconds: stats[todayIdx].listeningSeconds + durationSeconds,
              surahsPlayed: stats[todayIdx].surahsPlayed + 1,
            }
          } else {
            stats.push({ date: today, listeningSeconds: durationSeconds, surahsPlayed: 1 })
          }

          // Keep only last 90 days
          const cutoff = new Date()
          cutoff.setDate(cutoff.getDate() - 90)
          const cutoffStr = cutoff.toISOString().split('T')[0]
          const trimmed = stats.filter((d) => d.date >= cutoffStr)

          // Most played
          const mps = { ...s.mostPlayedSurahs }
          mps[surahNumber] = (mps[surahNumber] ?? 0) + 1

          return {
            totalListeningSeconds: s.totalListeningSeconds + durationSeconds,
            totalSurahsPlayed: s.totalSurahsPlayed + 1,
            streakDays: streak,
            lastActiveDate: today,
            dailyStats: trimmed,
            mostPlayedSurahs: mps,
          }
        })
      },

      getTodayStats: () => {
        const today = getToday()
        return get().dailyStats.find((d) => d.date === today) ?? { date: today, listeningSeconds: 0, surahsPlayed: 0 }
      },

      getWeekStats: () => {
        const stats = get().dailyStats
        const week: DailyStats[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const ds = d.toISOString().split('T')[0]
          week.push(stats.find((s) => s.date === ds) ?? { date: ds, listeningSeconds: 0, surahsPlayed: 0 })
        }
        return week
      },
    }),
    { name: 'quran-analytics' }
  )
)
