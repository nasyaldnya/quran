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

// Waveform bars — classes written statically so Tailwind scanner never purges them
const WAVEFORM_CLASSES = [
  'animate-waveform-1',
  'animate-waveform-2',
  'animate-waveform-3',
  'animate-waveform-4',
  'animate-waveform-5',
] as const

function Waveform() {
  return (
    <div className="flex items-center gap-[2px] h-5" aria-label="Playing">
      {WAVEFORM_CLASSES.map((cls) => (
        <span
          key={cls}
          className={`w-[3px] h-full rounded-full bg-primary origin-bottom ${cls}`}
        />
      ))}
    </div>
  )
}

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    duration,
    currentTime,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    setIsPlaying,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    playNext,
    playPrev,
    clearPlayer,
  } = useAudioStore()

  const { seek } = useAudioPlayer()
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value))
  }, [setVolume])

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 glass-strong shadow-player border-t border-white/5"
        >
          {/* Progress bar */}
          <div className="relative w-full h-1 bg-border group cursor-pointer"
            onClick={(e) => {
              if (!duration) return
              const rect = e.currentTarget.getBoundingClientRect()
              const pct  = (e.clientX - rect.left) / rect.width
              seek(pct * duration)
            }}
          >
            <div
              className="h-full bg-gold-gradient transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-gold-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ left: `calc(${progressPct}% - 6px)` }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
            {/* ── Row 1: Track info + main controls + extras (desktop) ── */}
            <div className="flex items-center gap-3">

              {/* Track Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-gold-500/30 to-gold-700/20 border border-gold-500/20 flex items-center justify-center overflow-hidden">
                  {isPlaying ? (
                    <Waveform />
                  ) : (
                    <span className="text-lg sm:text-xl font-arabic text-primary">
                      {currentTrack.surahNumber}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">
                    {currentTrack.surahNameAr}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentTrack.surahNameEn} · {currentTrack.reciterName}
                  </p>
                </div>
              </div>

              {/* Center controls */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button
                  variant="ghost" size="icon-sm"
                  onClick={toggleShuffle}
                  className={isShuffled ? 'text-primary' : 'text-foreground/60 hover:text-foreground'}
                  aria-label="Shuffle"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={playPrev} aria-label="Previous"
                  className="text-foreground/80 hover:text-foreground">
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="gold"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isLoading}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-gold animate-pulse-gold"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-amber-900/50 border-t-amber-950 rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </Button>

                <Button variant="ghost" size="icon" onClick={playNext} aria-label="Next"
                  className="text-foreground/80 hover:text-foreground">
                  <SkipForward className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost" size="icon-sm"
                  onClick={toggleRepeat}
                  className={repeatMode !== 'none' ? 'text-primary' : 'text-foreground/60 hover:text-foreground'}
                  aria-label="Repeat"
                >
                  {repeatMode === 'one'
                    ? <Repeat1 className="h-3.5 w-3.5" />
                    : <Repeat  className="h-3.5 w-3.5" />}
                </Button>
              </div>

              {/* Desktop right section */}
              <div className="hidden md:flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                <span className="text-xs text-foreground/50 tabular-nums flex-shrink-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Divider */}
                <div className="w-px h-5 bg-foreground/10 flex-shrink-0" />

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button
                    variant="ghost" size="icon-sm"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="text-foreground/70 hover:text-foreground"
                  >
                    {isMuted || volume === 0
                      ? <VolumeX className="h-4 w-4" />
                      : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <input
                    type="range"
                    min={0} max={1} step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-primary"
                    aria-label="Volume"
                  />
                </div>

                {/* Divider */}
                <div className="w-px h-5 bg-foreground/10 flex-shrink-0" />

                <QuranTextToggle />
                <SleepTimerButton />

                <Button
                  variant="ghost" size="icon-sm"
                  onClick={clearPlayer}
                  className="text-foreground/60 hover:text-foreground"
                  aria-label="Close player"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Mobile expand toggle */}
              <Button
                variant="ghost" size="icon-sm"
                onClick={() => setMobileExpanded((v) => !v)}
                className="md:hidden text-foreground/60 hover:text-foreground flex-shrink-0"
                aria-label="More controls"
              >
                {mobileExpanded
                  ? <ChevronDown className="h-4 w-4" />
                  : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>

            {/* ── Row 2: Mobile expanded controls ── */}
            <AnimatePresence>
              {mobileExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="flex items-center justify-between pt-2.5 pb-1 border-t border-foreground/10 mt-2.5">
                    {/* Time */}
                    <span className="text-[11px] text-foreground/50 tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Feature buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="icon-sm"
                        onClick={toggleMute}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="text-foreground/70 hover:text-foreground"
                      >
                        {isMuted || volume === 0
                          ? <VolumeX className="h-4 w-4" />
                          : <Volume2 className="h-4 w-4" />}
                      </Button>

                      <QuranTextToggle />
                      <SleepTimerButton />

                      <Button
                        variant="ghost" size="icon-sm"
                        onClick={clearPlayer}
                        className="text-foreground/60 hover:text-foreground"
                        aria-label="Close player"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
