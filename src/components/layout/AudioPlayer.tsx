import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Repeat, Repeat1, Shuffle, X,
} from 'lucide-react'
import { useAudioStore } from '@/store/audioStore'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value))
  }, [seek])

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
          {/* Progress bar — full width, sits above the controls */}
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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-4">

              {/* ── Track Info ── */}
              <div className="flex items-center gap-3 w-0 flex-1 min-w-0">
                {/* Album art / waveform */}
                <div className="relative flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-gold-500/30 to-gold-700/20 border border-gold-500/20 flex items-center justify-center overflow-hidden">
                  {isPlaying ? (
                    <Waveform />
                  ) : (
                    <span className="text-xl font-arabic text-primary">
                      {currentTrack.surahNumber}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {currentTrack.surahNameAr}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentTrack.surahNameEn} · {currentTrack.reciterName}
                  </p>
                </div>
              </div>

              {/* ── Controls ── */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* Shuffle */}
                <Button
                  variant="ghost" size="icon-sm"
                  onClick={toggleShuffle}
                  className={isShuffled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                  aria-label="Shuffle"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </Button>

                {/* Prev */}
                <Button variant="ghost" size="icon" onClick={playPrev} aria-label="Previous">
                  <SkipBack className="h-5 w-5" />
                </Button>

                {/* Play / Pause */}
                <Button
                  variant="gold"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isLoading}
                  className="w-12 h-12 rounded-full shadow-gold animate-pulse-gold"
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

                {/* Next */}
                <Button variant="ghost" size="icon" onClick={playNext} aria-label="Next">
                  <SkipForward className="h-5 w-5" />
                </Button>

                {/* Repeat */}
                <Button
                  variant="ghost" size="icon-sm"
                  onClick={toggleRepeat}
                  className={repeatMode !== 'none' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                  aria-label="Repeat"
                >
                  {repeatMode === 'one'
                    ? <Repeat1 className="h-3.5 w-3.5" />
                    : <Repeat  className="h-3.5 w-3.5" />}
                </Button>
              </div>

              {/* ── Time & Volume (desktop) ── */}
              <div className="hidden md:flex items-center gap-3 w-0 flex-1 min-w-0 justify-end">
                {/* Time */}
                <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Volume */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost" size="icon-sm"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isMuted || volume === 0
                      ? <VolumeX className="h-3.5 w-3.5" />
                      : <Volume2 className="h-3.5 w-3.5" />}
                  </Button>
                  <input
                    type="range"
                    min={0} max={1} step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                    aria-label="Volume"
                  />
                </div>

                {/* Close */}
                <Button
                  variant="ghost" size="icon-sm"
                  onClick={clearPlayer}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close player"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
