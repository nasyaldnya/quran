import { create } from 'zustand'
import { useAudioStore } from './audioStore'

export type SleepTimerMode = 'off' | 'minutes' | 'end-of-surah'

interface SleepTimerState {
  mode: SleepTimerMode
  /** Total seconds selected */
  totalSeconds: number
  /** Remaining seconds (counts down) */
  remainingSeconds: number
  /** Whether the timer is actively counting */
  isActive: boolean

  // Actions
  startTimer: (minutes: number) => void
  startEndOfSurah: () => void
  cancelTimer: () => void
  tick: () => void
}

let tickInterval: ReturnType<typeof setInterval> | null = null

function clearTickInterval() {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
}

export const useSleepTimerStore = create<SleepTimerState>((set, get) => ({
  mode: 'off',
  totalSeconds: 0,
  remainingSeconds: 0,
  isActive: false,

  startTimer: (minutes) => {
    clearTickInterval()

    const totalSec = minutes * 60
    set({
      mode: 'minutes',
      totalSeconds: totalSec,
      remainingSeconds: totalSec,
      isActive: true,
    })

    tickInterval = setInterval(() => {
      get().tick()
    }, 1000)
  },

  startEndOfSurah: () => {
    clearTickInterval()
    set({
      mode: 'end-of-surah',
      totalSeconds: 0,
      remainingSeconds: 0,
      isActive: true,
    })
  },

  cancelTimer: () => {
    clearTickInterval()
    set({
      mode: 'off',
      totalSeconds: 0,
      remainingSeconds: 0,
      isActive: false,
    })
  },

  tick: () => {
    const { remainingSeconds, isActive } = get()
    if (!isActive) return

    if (remainingSeconds <= 1) {
      // Timer expired — pause playback
      clearTickInterval()
      useAudioStore.getState().setIsPlaying(false)
      set({
        mode: 'off',
        totalSeconds: 0,
        remainingSeconds: 0,
        isActive: false,
      })
    } else {
      set({ remainingSeconds: remainingSeconds - 1 })
    }
  },
}))

// ── End-of-surah watcher ─────────────────────────
// When "end of surah" mode is active and a track change happens
// (meaning the current surah ended), we cancel the timer and pause.
useAudioStore.subscribe((state, prevState) => {
  const timer = useSleepTimerStore.getState()
  if (timer.mode !== 'end-of-surah' || !timer.isActive) return

  // If the track changed (surah ended and next started), pause + cancel
  if (
    prevState.currentTrack &&
    state.currentTrack &&
    state.currentTrack.audioUrl !== prevState.currentTrack.audioUrl
  ) {
    useAudioStore.getState().setIsPlaying(false)
    useSleepTimerStore.getState().cancelTimer()
  }
})
