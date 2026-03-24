import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { useAudioStore } from '@/store/audioStore'

// Singleton Howl instance — survives React re-renders and route changes
let howl: Howl | null = null
let seekInterval: ReturnType<typeof setInterval> | null = null

function clearSeekInterval() {
  if (seekInterval) {
    clearInterval(seekInterval)
    seekInterval = null
  }
}

export function useAudioPlayer() {
  const store        = useAudioStore()
  const currentSrc   = useRef<string>('')

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setIsPlaying,
    setIsLoading,
    setDuration,
    setCurrentTime,
  } = store

  // ── Load & play new track ───────────────────────
  useEffect(() => {
    if (!currentTrack) return
    if (currentTrack.audioUrl === currentSrc.current) return

    currentSrc.current = currentTrack.audioUrl

    // Destroy previous instance
    if (howl) {
      howl.stop()
      howl.unload()
      howl = null
    }
    clearSeekInterval()

    setIsLoading(true)
    setCurrentTime(0)
    setDuration(0)

    howl = new Howl({
      src:    [currentTrack.audioUrl],
      html5:  true,           // streaming mode — essential for large MP3 files
      format: ['mp3'],
      volume: isMuted ? 0 : volume,
      onload: () => {
        setDuration(howl?.duration() ?? 0)
        setIsLoading(false)
        howl?.play()
        setIsPlaying(true)
      },
      onloaderror: (_id, err) => {
        console.error('Howl load error:', err)
        setIsLoading(false)
        setIsPlaying(false)
      },
      onplay: () => {
        setIsPlaying(true)
        clearSeekInterval()
        seekInterval = setInterval(() => {
          if (howl?.playing()) {
            setCurrentTime(howl.seek() as number)
          }
        }, 500)
      },
      onpause:  () => { setIsPlaying(false); clearSeekInterval() },
      onstop:   () => { setIsPlaying(false); clearSeekInterval() },
      onend:    () => {
        clearSeekInterval()
        // Read fresh state via getState() — avoids stale closure over destructured values
        const { repeatMode: rm, playNext: pn, setIsPlaying: sip } = useAudioStore.getState()
        if (rm === 'one') {
          howl?.seek(0)
          howl?.play()
        } else {
          const next = pn()
          if (!next) sip(false)
        }
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.audioUrl])

  // ── Sync play/pause state ───────────────────────
  useEffect(() => {
    if (!howl) return
    if (isPlaying && !howl.playing()) howl.play()
    else if (!isPlaying && howl.playing()) howl.pause()
  }, [isPlaying])

  // ── Sync volume ─────────────────────────────────
  useEffect(() => {
    howl?.volume(isMuted ? 0 : volume)
  }, [volume, isMuted])

  // ── Cleanup on unmount ──────────────────────────
  useEffect(() => {
    return () => {
      clearSeekInterval()
      howl?.stop()
      howl?.unload()
      howl = null
    }
  }, [])

  const seek = useCallback((seconds: number) => {
    if (howl) {
      howl.seek(seconds)
      setCurrentTime(seconds)
    }
  }, [setCurrentTime])

  return { seek }
}
