import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Repeat, Repeat1, Shuffle, X,
  ChevronUp, ChevronDown,
} from 'lucide-react'
import { useAudioStore } from '@/store/audioStore'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import SleepTimerButton from './SleepTimerButton'
import QuranTextToggle from './QuranTextToggle'
import SpeedControl from './SpeedControl'

function Waveform() {
  return (
    <div className="flex items-end gap-[3px] h-4" aria-label="Playing">
      {[1,2,3,4].map((i) => (
        <span key={i}
          className="w-[3px] rounded-full bg-primary origin-bottom"
          style={{
            animation: `waveform ${0.8 + i * 0.15}s ease-in-out infinite ${i * 0.1}s`,
            height: '100%',
          }}
        />
      ))}
    </div>
  )
}

export default function AudioPlayer() {
  const {
    currentTrack, isPlaying, isLoading, duration, currentTime,
    volume, isMuted, repeatMode, isShuffled,
    setIsPlaying, setVolume, toggleMute, toggleRepeat, toggleShuffle,
    playNext, playPrev, clearPlayer,
  } = useAudioStore()

  const { seek } = useAudioPlayer()
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value))
  }, [setVolume])

  const handleSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seek(Math.max(0, Math.min(1, ratio)) * duration)
  }, [duration, seek])

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!currentTrack) return null

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      // Force LTR for entire player — audio controls must always be LTR
      dir="ltr"
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60"
    >
      {/* ── Progress bar with time ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 pt-2.5" style={{ direction: 'ltr' }}>
          <span className="text-[11px] text-muted-foreground tabular-nums w-10 text-right select-none">
            {formatTime(currentTime)}
          </span>

          {/* Seek bar — always LTR */}
          <div
            className="relative flex-1 h-1.5 bg-border/80 rounded-full group cursor-pointer"
            style={{ direction: 'ltr' }}
            onClick={handleSeekClick}
          >
            {/* Filled portion */}
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-background opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${pct}% - 7px)` }}
            />
          </div>

          <span className="text-[11px] text-muted-foreground tabular-nums w-10 select-none">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* ── Main controls row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-3" style={{ direction: 'ltr' }}>

          {/* Track Info — text can be RTL inside LTR shell */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
              {isPlaying ? <Waveform /> : (
                <span className="text-base font-arabic text-primary font-semibold">
                  {currentTrack.surahNumber}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-foreground" dir="rtl">
                {currentTrack.surahNameAr}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {currentTrack.surahNameEn} · {currentTrack.reciterName}
              </p>
            </div>
          </div>

          {/* Center playback controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon-sm" onClick={toggleShuffle} aria-label="Shuffle"
              className={isShuffled ? 'text-primary' : 'text-foreground/50 hover:text-foreground'}>
              <Shuffle className="h-3.5 w-3.5" />
            </Button>

            <Button variant="ghost" size="icon-sm" onClick={playPrev} aria-label="Previous"
              className="text-foreground/70 hover:text-foreground">
              <SkipBack className="h-[18px] w-[18px]" />
            </Button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isLoading}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-[18px] w-[18px] fill-current" />
              ) : (
                <Play className="h-[18px] w-[18px] fill-current ml-0.5" />
              )}
            </button>

            <Button variant="ghost" size="icon-sm" onClick={playNext} aria-label="Next"
              className="text-foreground/70 hover:text-foreground">
              <SkipForward className="h-[18px] w-[18px]" />
            </Button>

            <Button variant="ghost" size="icon-sm" onClick={toggleRepeat} aria-label="Repeat"
              className={repeatMode !== 'none' ? 'text-primary' : 'text-foreground/50 hover:text-foreground'}>
              {repeatMode === 'one'
                ? <Repeat1 className="h-3.5 w-3.5" />
                : <Repeat className="h-3.5 w-3.5" />}
            </Button>
          </div>

          {/* Desktop: Volume + features */}
          <div className="hidden md:flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <Button variant="ghost" size="icon-sm" onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="text-foreground/60 hover:text-foreground">
              {isMuted || volume === 0
                ? <VolumeX className="h-4 w-4" />
                : <Volume2 className="h-4 w-4" />}
            </Button>

            {/* Volume slider — forced LTR */}
            <input
              type="range" min={0} max={1} step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 volume-slider"
              style={{ direction: 'ltr' }}
              aria-label="Volume"
            />

            <div className="w-px h-4 bg-border mx-1" />

            <QuranTextToggle />
            <SleepTimerButton />
            <SpeedControl />

            <div className="w-px h-4 bg-border mx-1" />

            <Button variant="ghost" size="icon-sm" onClick={clearPlayer} aria-label="Close"
              className="text-foreground/40 hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Mobile expand */}
          <Button variant="ghost" size="icon-sm"
            onClick={() => setMobileExpanded(v => !v)}
            className="md:hidden text-foreground/50 hover:text-foreground flex-shrink-0"
            aria-label="More">
            {mobileExpanded
              ? <ChevronDown className="h-4 w-4" />
              : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>

        {/* ── Mobile expanded row ── */}
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex items-center justify-between pt-2 pb-1 border-t border-border/40 mt-2"
                style={{ direction: 'ltr' }}>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="text-foreground/60 hover:text-foreground">
                    {isMuted || volume === 0
                      ? <VolumeX className="h-4 w-4" />
                      : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <input
                    type="range" min={0} max={1} step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 volume-slider"
                    style={{ direction: 'ltr' }}
                    aria-label="Volume"
                  />
                </div>
                <div className="flex items-center gap-0.5">
                  <SpeedControl />
                  <QuranTextToggle />
                  <SleepTimerButton />
                  <Button variant="ghost" size="icon-sm" onClick={clearPlayer} aria-label="Close"
                    className="text-foreground/40 hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
