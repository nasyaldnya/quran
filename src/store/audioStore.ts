import { create } from 'zustand'
import type { Track } from '@/types/api'

export type RepeatMode = 'none' | 'one' | 'all'

interface AudioState {
  // Current track
  currentTrack:  Track | null
  queue:         Track[]
  queueIndex:    number

  // Playback state
  isPlaying:     boolean
  isLoading:     boolean
  duration:      number
  currentTime:   number
  volume:        number
  isMuted:       boolean
  repeatMode:    RepeatMode
  isShuffled:    boolean
  playbackRate:  number

  // Actions
  setCurrentTrack: (track: Track, queue?: Track[], index?: number) => void
  setQueue:        (tracks: Track[], startIndex?: number) => void
  setIsPlaying:    (v: boolean) => void
  setIsLoading:    (v: boolean) => void
  setDuration:     (v: number) => void
  setCurrentTime:  (v: number) => void
  setVolume:       (v: number) => void
  setPlaybackRate: (rate: number) => void
  toggleMute:      () => void
  toggleRepeat:    () => void
  toggleShuffle:   () => void
  playNext:        () => Track | null
  playPrev:        () => Track | null
  clearPlayer:     () => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentTrack: null,
  queue:        [],
  queueIndex:   0,
  isPlaying:    false,
  isLoading:    false,
  duration:     0,
  currentTime:  0,
  volume:       0.85,
  isMuted:      false,
  repeatMode:   'none',
  isShuffled:   false,
  playbackRate: 1,

  setCurrentTrack: (track, queue, index = 0) =>
    set({ currentTrack: track, queue: queue ?? get().queue, queueIndex: index, currentTime: 0, duration: 0 }),

  setQueue: (tracks, startIndex = 0) =>
    set({ queue: tracks, queueIndex: startIndex }),

  setIsPlaying:   (v) => set({ isPlaying: v }),
  setIsLoading:   (v) => set({ isLoading: v }),
  setDuration:    (v) => set({ duration: v }),
  setCurrentTime: (v) => set({ currentTime: v }),

  setVolume: (v) => set({ volume: v, isMuted: v === 0 }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),

  toggleMute: () =>
    set((s) => ({ isMuted: !s.isMuted })),

  toggleRepeat: () =>
    set((s) => ({
      repeatMode:
        s.repeatMode === 'none' ? 'all'
        : s.repeatMode === 'all' ? 'one'
        : 'none',
    })),

  toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),

  playNext: () => {
    const { queue, queueIndex, repeatMode, isShuffled } = get()
    if (!queue.length) return null

    let nextIndex: number
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length)
    } else if (queueIndex < queue.length - 1) {
      nextIndex = queueIndex + 1
    } else if (repeatMode === 'all') {
      nextIndex = 0
    } else {
      return null
    }

    const next = queue[nextIndex]
    set({ currentTrack: next, queueIndex: nextIndex, currentTime: 0, duration: 0 })
    return next
  },

  playPrev: () => {
    const { queue, queueIndex } = get()
    if (!queue.length) return null
    const prevIndex = queueIndex > 0 ? queueIndex - 1 : 0
    const prev = queue[prevIndex]
    set({ currentTrack: prev, queueIndex: prevIndex, currentTime: 0, duration: 0 })
    return prev
  },

  clearPlayer: () =>
    set({ currentTrack: null, isPlaying: false, currentTime: 0, duration: 0, queue: [], queueIndex: 0 }),
}))
