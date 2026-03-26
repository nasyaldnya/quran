import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, Play, Pause, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useReciters } from '@/hooks/useReciters'
import { useAudioStore } from '@/store/audioStore'
import { buildAudioUrl } from '@/lib/api'
import { SURAH_NAMES, SURAH_NAMES_AR } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import type { Track } from '@/types/api'

export default function ComparePage() {
  const t = useT()
  const { data: reciters = [] } = useReciters()
  const { currentTrack, isPlaying, isLoading, setCurrentTrack, setIsPlaying } = useAudioStore()

  const [reciterA, setReciterA] = useState<number | ''>('')
  const [reciterB, setReciterB] = useState<number | ''>('')
  const [surahNum, setSurahNum] = useState<number>(1)

  const recA = reciters.find((r) => r.id === reciterA)
  const recB = reciters.find((r) => r.id === reciterB)

  const buildTrack = (reciter: typeof recA, num: number): Track | null => {
    if (!reciter || !reciter.moshaf[0]) return null
    const moshaf = reciter.moshaf[0]
    return {
      surahNumber: num, surahNameAr: SURAH_NAMES_AR[num] ?? '', surahNameEn: SURAH_NAMES[num] ?? '',
      reciterName: reciter.name, reciterId: reciter.id, moshafId: moshaf.id,
      audioUrl: buildAudioUrl(moshaf.server, num), verseCount: 0, revelationType: 'Makki',
    }
  }

  const playTrack = (track: Track | null) => {
    if (!track) return
    if (currentTrack?.audioUrl === track.audioUrl) { setIsPlaying(!isPlaying); return }
    setCurrentTrack(track)
  }

  const trackA = buildTrack(recA, surahNum)
  const trackB = buildTrack(recB, surahNum)

  return (
    <PageTransition>
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block" opacity={0.05} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <GitCompare className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">{t.compare_label}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">{t.compare_title}</h1>
            <p className="text-muted-foreground max-w-lg">{t.compare_subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Surah selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{t.compare_select_surah}</label>
          <select value={surahNum} onChange={(e) => setSurahNum(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
            {Array.from({ length: 114 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}. {SURAH_NAMES[n]}</option>
            ))}
          </select>
        </div>

        {/* Reciter selectors side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Reciter A */}
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-2">{t.compare_reciter} A</label>
            <select value={reciterA} onChange={(e) => setReciterA(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 text-foreground text-sm mb-3">
              <option value="">{t.compare_choose}</option>
              {reciters.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            {trackA && (
              <Button onClick={() => playTrack(trackA)} variant="outline" className="w-full">
                {currentTrack?.audioUrl === trackA.audioUrl && isPlaying
                  ? <><Pause className="w-4 h-4 mr-2 fill-current" />{t.pause_all}</>
                  : <><Play className="w-4 h-4 mr-2 fill-current" />{t.play_all}</>}
              </Button>
            )}
          </div>

          {/* Reciter B */}
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-2">{t.compare_reciter} B</label>
            <select value={reciterB} onChange={(e) => setReciterB(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 text-foreground text-sm mb-3">
              <option value="">{t.compare_choose}</option>
              {reciters.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            {trackB && (
              <Button onClick={() => playTrack(trackB)} variant="outline" className="w-full">
                {currentTrack?.audioUrl === trackB.audioUrl && isPlaying
                  ? <><Pause className="w-4 h-4 mr-2 fill-current" />{t.pause_all}</>
                  : <><Play className="w-4 h-4 mr-2 fill-current" />{t.play_all}</>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
