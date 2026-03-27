import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import {
  GitCompare, Play, Pause, Volume2, VolumeX,
  SkipForward, SkipBack, Headphones, Loader2,
  PlayCircle, PauseCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useReciters } from '@/hooks/useReciters'
import { buildAudioUrl } from '@/lib/api'
import { SURAH_NAMES, SURAH_NAMES_AR, formatTime } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// ── Independent Audio Player Hook ──
function useIndependentPlayer() {
  const howlRef = useRef<Howl | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [url, setUrl] = useState<string | null>(null)

  const clearInterval_ = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  const load = useCallback((audioUrl: string) => {
    // Cleanup old
    clearInterval_()
    if (howlRef.current) { howlRef.current.stop(); howlRef.current.unload() }
    setIsPlaying(false); setCurrentTime(0); setDuration(0); setIsLoading(true)
    setUrl(audioUrl)

    const howl = new Howl({
      src: [audioUrl],
      html5: true,
      volume: volume,
      onload: () => { setDuration(howl.duration()); setIsLoading(false) },
      onloaderror: () => setIsLoading(false),
      onplay: () => {
        setIsPlaying(true)
        clearInterval_()
        intervalRef.current = setInterval(() => {
          if (howl.playing()) setCurrentTime(howl.seek() as number)
        }, 250)
      },
      onpause: () => setIsPlaying(false),
      onstop: () => { setIsPlaying(false); clearInterval_() },
      onend: () => { setIsPlaying(false); setCurrentTime(0); clearInterval_() },
    })
    howlRef.current = howl
  }, [volume])

  const play = useCallback(() => {
    if (!howlRef.current) return
    if (howlRef.current.playing()) return
    howlRef.current.play()
  }, [])

  const pause = useCallback(() => {
    howlRef.current?.pause()
  }, [])

  const togglePlay = useCallback(() => {
    if (!howlRef.current) return
    if (howlRef.current.playing()) howlRef.current.pause()
    else howlRef.current.play()
  }, [])

  const seek = useCallback((seconds: number) => {
    if (!howlRef.current) return
    howlRef.current.seek(seconds)
    setCurrentTime(seconds)
  }, [])

  const changeVolume = useCallback((v: number) => {
    setVolume(v)
    setIsMuted(v === 0)
    howlRef.current?.volume(v)
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev
      howlRef.current?.volume(next ? 0 : volume)
      return next
    })
  }, [volume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval_()
      howlRef.current?.stop()
      howlRef.current?.unload()
    }
  }, [])

  // Sync volume when not muted
  useEffect(() => {
    if (!isMuted && howlRef.current) howlRef.current.volume(volume)
  }, [volume, isMuted])

  return {
    load, play, pause, togglePlay, seek, changeVolume, toggleMute,
    isPlaying, isLoading, duration, currentTime, volume, isMuted, url,
  }
}

// ── Mini Player Card Component ──
interface MiniPlayerProps {
  label: string
  color: string
  reciterId: number | ''
  reciters: any[]
  surahNum: number
  onReciterChange: (id: number | '') => void
  player: ReturnType<typeof useIndependentPlayer>
  t: any
}

function MiniPlayer({ label, color, reciterId, reciters, surahNum, onReciterChange, player, t }: MiniPlayerProps) {
  const reciter = reciters.find(r => r.id === reciterId)
  const pct = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0

  // Load audio when reciter or surah changes
  useEffect(() => {
    if (!reciter || !reciter.moshaf[0]) return
    const url = buildAudioUrl(reciter.moshaf[0].server, surahNum)
    player.load(url)
  }, [reciterId, surahNum])

  return (
    <div className={cn('rounded-2xl border bg-card overflow-hidden transition-all', color)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{label}</p>
        <select
          value={reciterId}
          onChange={e => onReciterChange(e.target.value ? Number(e.target.value) : '')}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t.compare_choose}</option>
          {reciters.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        {reciter && (
          <div className="flex items-center gap-2 mt-2">
            <Headphones className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs text-muted-foreground truncate">
              {reciter.moshaf[0]?.surah_total ?? 0} {t.surahs_word}
            </p>
          </div>
        )}
      </div>

      {/* Player controls */}
      {reciter && (
        <div className="px-4 py-4">
          {/* Progress bar */}
          <div className="flex items-center gap-2.5 mb-3" dir="ltr">
            <span className="text-[10px] text-muted-foreground tabular-nums w-9 text-right">
              {formatTime(player.currentTime)}
            </span>
            <div
              className="relative flex-1 h-1.5 bg-border/60 rounded-full cursor-pointer group"
              onClick={e => {
                if (!player.duration) return
                const rect = e.currentTarget.getBoundingClientRect()
                player.seek(((e.clientX - rect.left) / rect.width) * player.duration)
              }}
            >
              <div className="h-full bg-primary rounded-full transition-[width] duration-200"
                style={{ width: `${pct}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary ring-2 ring-background opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${pct}% - 6px)` }} />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums w-9">
              {formatTime(player.duration)}
            </span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Play/Pause */}
            <button
              onClick={player.togglePlay}
              disabled={player.isLoading || !reciterId}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-40"
            >
              {player.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : player.isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5" dir="ltr">
              <button onClick={player.toggleMute}
                className="text-foreground/60 hover:text-foreground transition-colors p-1">
                {player.isMuted || player.volume === 0
                  ? <VolumeX className="w-4 h-4" />
                  : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range" min={0} max={1} step={0.01}
                value={player.isMuted ? 0 : player.volume}
                onChange={e => player.changeVolume(Number(e.target.value))}
                className="w-20" style={{ direction: 'ltr' }}
              />
            </div>
          </div>

          {/* Status */}
          {player.isPlaying && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
              <div className="flex items-end gap-[3px] h-3">
                {[1,2,3,4].map(i => (
                  <span key={i} className="w-[2px] rounded-full bg-primary origin-bottom"
                    style={{ animation: `waveform ${0.7 + i * 0.15}s ease-in-out infinite ${i * 0.1}s`, height: '100%' }} />
                ))}
              </div>
              <span className="text-[10px] text-primary font-medium">{t.compare_playing}</span>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!reciter && (
        <div className="px-4 py-8 text-center">
          <Headphones className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">{t.compare_choose}</p>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════
//  COMPARE PAGE
// ══════════════════════════════════════════════════════

export default function ComparePage() {
  const t = useT()
  const { data: reciters = [] } = useReciters()

  const [reciterA, setReciterA] = useState<number | ''>('')
  const [reciterB, setReciterB] = useState<number | ''>('')
  const [surahNum, setSurahNum] = useState<number>(1)

  const playerA = useIndependentPlayer()
  const playerB = useIndependentPlayer()

  const bothReady = !!reciterA && !!reciterB
  const bothPlaying = playerA.isPlaying && playerB.isPlaying

  const playBoth = () => { playerA.play(); playerB.play() }
  const pauseBoth = () => { playerA.pause(); playerB.pause() }
  const toggleBoth = () => { if (bothPlaying) pauseBoth(); else playBoth() }

  // Sync surah change — reload both players
  const handleSurahChange = (num: number) => {
    setSurahNum(num)
    // Players will reload via useEffect in MiniPlayer
  }

  const handlePrevSurah = () => handleSurahChange(Math.max(1, surahNum - 1))
  const handleNextSurah = () => handleSurahChange(Math.min(114, surahNum + 1))

  return (
    <PageTransition>
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block" opacity={0.05} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <GitCompare className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">{t.compare_label}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">{t.compare_title}</h1>
            <p className="text-muted-foreground max-w-lg">{t.compare_subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Surah Selector + Navigation ── */}
        <div className="rounded-2xl border border-border/60 bg-card p-4 mb-6">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
            {t.compare_select_surah}
          </label>
          <div className="flex items-center gap-2" dir="ltr">
            <Button variant="ghost" size="icon-sm" onClick={handlePrevSurah} disabled={surahNum <= 1}>
              <SkipBack className="w-4 h-4" />
            </Button>

            <select
              value={surahNum}
              onChange={e => handleSurahChange(Number(e.target.value))}
              className="flex-1 px-3 py-2.5 rounded-xl bg-background border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              {Array.from({ length: 114 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n}. {SURAH_NAMES[n]} — {SURAH_NAMES_AR[n]}</option>
              ))}
            </select>

            <Button variant="ghost" size="icon-sm" onClick={handleNextSurah} disabled={surahNum >= 114}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Surah info */}
          <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/30">
            <p className="font-arabic text-xl text-primary">{SURAH_NAMES_AR[surahNum]}</p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-sm text-foreground">{SURAH_NAMES[surahNum]}</p>
          </div>
        </div>

        {/* ── Play Both Button ── */}
        {bothReady && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-6">
            <button
              onClick={toggleBoth}
              className={cn(
                'flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all border shadow-sm',
                bothPlaying
                  ? 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20'
                  : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
              )}
            >
              {bothPlaying ? (
                <><PauseCircle className="w-5 h-5" />{t.compare_pause_both}</>
              ) : (
                <><PlayCircle className="w-5 h-5" />{t.compare_play_both}</>
              )}
            </button>
          </motion.div>
        )}

        {/* ── Dual Players Side by Side ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MiniPlayer
            label={`${t.compare_reciter} A`}
            color="border-border/60"
            reciterId={reciterA}
            reciters={reciters}
            surahNum={surahNum}
            onReciterChange={setReciterA}
            player={playerA}
            t={t}
          />
          <MiniPlayer
            label={`${t.compare_reciter} B`}
            color="border-border/60"
            reciterId={reciterB}
            reciters={reciters}
            surahNum={surahNum}
            onReciterChange={setReciterB}
            player={playerB}
            t={t}
          />
        </div>

        {/* ── Quick Tips ── */}
        <div className="mt-8 rounded-xl bg-accent/50 border border-border/40 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">{t.compare_tips_title}</p>
          <ul className="space-y-1.5">
            <li className="text-[11px] text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              {t.compare_tip_1}
            </li>
            <li className="text-[11px] text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              {t.compare_tip_2}
            </li>
            <li className="text-[11px] text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              {t.compare_tip_3}
            </li>
          </ul>
        </div>
      </div>
    </PageTransition>
  )
}
