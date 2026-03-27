import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import {
  GitCompare, Play, Pause, Volume2, VolumeX,
  SkipForward, SkipBack, Headphones, Loader2,
  PlayCircle, PauseCircle, Gauge,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useReciters } from '@/hooks/useReciters'
import { buildAudioUrl } from '@/lib/api'
import { SURAH_NAMES, SURAH_NAMES_AR, formatTime } from '@/lib/utils'
import { getReciterStyle, getStyleLabelKey } from '@/lib/recitationStyles'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// ── Independent Audio Player Hook (with rate) ──
function useIndependentPlayer() {
  const howlRef = useRef<Howl | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [rate, setRate] = useState(1)
  const [url, setUrl] = useState<string | null>(null)

  const clearInt = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null } }

  const load = useCallback((audioUrl: string) => {
    clearInt()
    if (howlRef.current) { howlRef.current.stop(); howlRef.current.unload() }
    setIsPlaying(false); setCurrentTime(0); setDuration(0); setIsLoading(true); setUrl(audioUrl)
    const howl = new Howl({
      src: [audioUrl], html5: true, volume: volume, rate: rate,
      onload: () => { setDuration(howl.duration()); setIsLoading(false) },
      onloaderror: () => setIsLoading(false),
      onplay: () => {
        setIsPlaying(true); clearInt()
        intervalRef.current = setInterval(() => { if (howl.playing()) setCurrentTime(howl.seek() as number) }, 250)
      },
      onpause: () => setIsPlaying(false),
      onstop: () => { setIsPlaying(false); clearInt() },
      onend: () => { setIsPlaying(false); setCurrentTime(0); clearInt() },
    })
    howlRef.current = howl
  }, [volume, rate])

  const play = useCallback(() => { if (howlRef.current && !howlRef.current.playing()) howlRef.current.play() }, [])
  const pause = useCallback(() => { howlRef.current?.pause() }, [])
  const togglePlay = useCallback(() => { if (!howlRef.current) return; if (howlRef.current.playing()) howlRef.current.pause(); else howlRef.current.play() }, [])
  const seek = useCallback((s: number) => { if (!howlRef.current) return; howlRef.current.seek(s); setCurrentTime(s) }, [])
  const changeVolume = useCallback((v: number) => { setVolume(v); setIsMuted(v === 0); howlRef.current?.volume(v) }, [])
  const toggleMute = useCallback(() => { setIsMuted(p => { const n = !p; howlRef.current?.volume(n ? 0 : volume); return n }) }, [volume])

  const changeRate = useCallback((r: number) => {
    const clamped = Math.max(0.25, Math.min(3, r))
    setRate(clamped)
    howlRef.current?.rate(clamped)
  }, [])

  useEffect(() => { return () => { clearInt(); howlRef.current?.stop(); howlRef.current?.unload() } }, [])
  useEffect(() => { if (!isMuted && howlRef.current) howlRef.current.volume(volume) }, [volume, isMuted])

  return { load, play, pause, togglePlay, seek, changeVolume, toggleMute, changeRate, isPlaying, isLoading, duration, currentTime, volume, isMuted, rate, url }
}

const SPEED_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

// ── Mini Player Card ──
interface MiniPlayerProps {
  label: string
  reciterId: number | ''
  reciters: any[]
  surahNum: number
  onReciterChange: (id: number | '') => void
  player: ReturnType<typeof useIndependentPlayer>
  t: any
}

function MiniPlayer({ label, reciterId, reciters, surahNum, onReciterChange, player, t }: MiniPlayerProps) {
  const reciter = reciters.find((r: any) => r.id === reciterId)
  const pct = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0
  const [speedInput, setSpeedInput] = useState(String(player.rate))
  const [showSpeedPanel, setShowSpeedPanel] = useState(false)

  // Sync speedInput when rate changes externally
  useEffect(() => { setSpeedInput(String(player.rate)) }, [player.rate])

  useEffect(() => {
    if (!reciter || !reciter.moshaf[0]) return
    player.load(buildAudioUrl(reciter.moshaf[0].server, surahNum))
  }, [reciterId, surahNum])

  const style = reciter ? getReciterStyle(reciter.moshaf) : null
  const styleLabelKey = style ? getStyleLabelKey(style) : null

  const handleSpeedInput = (val: string) => {
    setSpeedInput(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num >= 0.25 && num <= 3) {
      player.changeRate(num)
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{label}</p>
        <select value={reciterId} onChange={e => onReciterChange(e.target.value ? Number(e.target.value) : '')}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">{t.compare_choose}</option>
          {reciters.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        {/* Reciter info + style badge */}
        {reciter && (
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-2">
              <Headphones className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs text-muted-foreground">{reciter.moshaf[0]?.surah_total ?? 0} {t.surahs_word}</p>
            </div>
            {styleLabelKey && (
              <span className={cn(
                'px-2 py-0.5 rounded-md text-[10px] font-semibold border',
                style === 'mujawwad' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                style === 'muallim' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-primary/10 text-primary border-primary/20'
              )}>
                {(t as any)[styleLabelKey] ?? style}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Player */}
      {reciter ? (
        <div className="px-4 py-4">
          {/* Progress */}
          <div className="flex items-center gap-2.5 mb-3" dir="ltr">
            <span className="text-[10px] text-muted-foreground tabular-nums w-9 text-right">{formatTime(player.currentTime)}</span>
            <div className="relative flex-1 h-1.5 bg-border/60 rounded-full cursor-pointer group"
              onClick={e => { if (!player.duration) return; const r = e.currentTarget.getBoundingClientRect(); player.seek(((e.clientX - r.left) / r.width) * player.duration) }}>
              <div className="h-full bg-primary rounded-full transition-[width] duration-200" style={{ width: `${pct}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary ring-2 ring-background opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${pct}% - 6px)` }} />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums w-9">{formatTime(player.duration)}</span>
          </div>

          {/* Play + Volume row */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={player.togglePlay} disabled={player.isLoading}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-40">
              {player.isLoading ? <Loader2 className="w-5 h-5 animate-spin" />
                : player.isPlaying ? <Pause className="w-5 h-5 fill-current" />
                : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div className="flex items-center gap-1.5" dir="ltr">
              <button onClick={player.toggleMute} className="text-foreground/60 hover:text-foreground p-1">
                {player.isMuted || player.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input type="range" min={0} max={1} step={0.01} value={player.isMuted ? 0 : player.volume}
                onChange={e => player.changeVolume(Number(e.target.value))} className="w-20" style={{ direction: 'ltr' }} />
            </div>
          </div>

          {/* Speed control */}
          <div className="border-t border-border/30 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-foreground">{t.playback_speed}</span>
              </div>
              <button onClick={() => setShowSpeedPanel(v => !v)}
                className={cn('text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-md border transition-colors',
                  player.rate !== 1 ? 'text-primary border-primary/30 bg-primary/10' : 'text-muted-foreground border-border/60')}>
                {player.rate}×
              </button>
            </div>

            {/* Speed presets + manual input */}
            {showSpeedPanel && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                className="overflow-hidden">
                <div className="flex flex-wrap gap-1 mb-2">
                  {SPEED_PRESETS.map(s => (
                    <button key={s} onClick={() => player.changeRate(s)}
                      className={cn('px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors',
                        player.rate === s ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground border-border/60 hover:text-foreground')}>
                      {s === 1 ? t.speed_normal : `${s}×`}
                    </button>
                  ))}
                </div>
                {/* Manual input */}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-muted-foreground">{t.compare_custom_speed}</label>
                  <input type="number" min={0.25} max={3} step={0.05}
                    value={speedInput}
                    onChange={e => handleSpeedInput(e.target.value)}
                    onBlur={() => {
                      const num = parseFloat(speedInput)
                      if (isNaN(num) || num < 0.25 || num > 3) setSpeedInput(String(player.rate))
                    }}
                    className="w-16 text-center px-1.5 py-1 rounded-md bg-background border border-border/80 text-foreground text-xs tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"
                    dir="ltr" />
                  <span className="text-[10px] text-muted-foreground">×</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Playing indicator */}
          {player.isPlaying && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
              <div className="flex items-end gap-[3px] h-3">
                {[1,2,3,4].map(i => (
                  <span key={i} className="w-[2px] rounded-full bg-primary origin-bottom"
                    style={{ animation: `waveform ${0.7 + i * 0.15}s ease-in-out infinite ${i * 0.1}s`, height: '100%' }} />
                ))}
              </div>
              <span className="text-[10px] text-primary font-medium">{t.compare_playing}</span>
              {player.rate !== 1 && (
                <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">{player.rate}×</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <Headphones className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">{t.compare_choose}</p>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════
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
  const handleSurahChange = (num: number) => setSurahNum(num)

  return (
    <PageTransition>
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
        {/* Surah selector */}
        <div className="rounded-2xl border border-border/60 bg-card p-4 mb-6">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t.compare_select_surah}</label>
          <div className="flex items-center gap-2" dir="ltr">
            <Button variant="ghost" size="icon-sm" onClick={() => handleSurahChange(Math.max(1, surahNum - 1))} disabled={surahNum <= 1}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <select value={surahNum} onChange={e => handleSurahChange(Number(e.target.value))}
              className="flex-1 px-3 py-2.5 rounded-xl bg-background border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
              {Array.from({ length: 114 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n}. {SURAH_NAMES[n]} — {SURAH_NAMES_AR[n]}</option>
              ))}
            </select>
            <Button variant="ghost" size="icon-sm" onClick={() => handleSurahChange(Math.min(114, surahNum + 1))} disabled={surahNum >= 114}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/30">
            <p className="font-arabic text-xl text-primary">{SURAH_NAMES_AR[surahNum]}</p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-sm text-foreground">{SURAH_NAMES[surahNum]}</p>
          </div>
        </div>

        {/* Play Both */}
        {bothReady && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-6">
            <button onClick={toggleBoth}
              className={cn('flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all border shadow-sm',
                bothPlaying ? 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20'
                  : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20')}>
              {bothPlaying ? <><PauseCircle className="w-5 h-5" />{t.compare_pause_both}</> : <><PlayCircle className="w-5 h-5" />{t.compare_play_both}</>}
            </button>
          </motion.div>
        )}

        {/* Dual players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MiniPlayer label={`${t.compare_reciter} A`} reciterId={reciterA} reciters={reciters} surahNum={surahNum} onReciterChange={setReciterA} player={playerA} t={t} />
          <MiniPlayer label={`${t.compare_reciter} B`} reciterId={reciterB} reciters={reciters} surahNum={surahNum} onReciterChange={setReciterB} player={playerB} t={t} />
        </div>

        {/* Tips */}
        <div className="mt-8 rounded-xl bg-accent/50 border border-border/40 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">{t.compare_tips_title}</p>
          <ul className="space-y-1.5">
            <li className="text-[11px] text-muted-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t.compare_tip_1}</li>
            <li className="text-[11px] text-muted-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t.compare_tip_2}</li>
            <li className="text-[11px] text-muted-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t.compare_tip_3}</li>
          </ul>
        </div>
      </div>
    </PageTransition>
  )
}
