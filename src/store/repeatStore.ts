import { create } from 'zustand'

export type RepeatRangeMode = 'off' | 'range' | 'count'

interface RepeatRangeState {
  mode: RepeatRangeMode
  // Range loop: loop between startTime and endTime (seconds)
  startTime: number
  endTime: number
  // Count repeat: repeat the current track N times
  repeatCount: number   // target
  currentCount: number  // how many times played so far

  setMode: (mode: RepeatRangeMode) => void
  setRange: (start: number, end: number) => void
  setRepeatCount: (count: number) => void
  incrementCount: () => void
  resetCount: () => void
  clearAll: () => void
  isInRange: (currentTime: number) => boolean
  shouldLoop: () => boolean
}

export const useRepeatStore = create<RepeatRangeState>((set, get) => ({
  mode: 'off',
  startTime: 0,
  endTime: 0,
  repeatCount: 5,
  currentCount: 0,

  setMode: (mode) => set({ mode, currentCount: 0 }),
  setRange: (start, end) => set({ startTime: start, endTime: end, mode: 'range' }),
  setRepeatCount: (count) => set({ repeatCount: count, currentCount: 0, mode: 'count' }),
  incrementCount: () => set((s) => ({ currentCount: s.currentCount + 1 })),
  resetCount: () => set({ currentCount: 0 }),
  clearAll: () => set({ mode: 'off', startTime: 0, endTime: 0, currentCount: 0 }),

  isInRange: (currentTime) => {
    const { mode, startTime, endTime } = get()
    if (mode !== 'range' || endTime <= startTime) return true
    return currentTime >= startTime && currentTime <= endTime
  },

  shouldLoop: () => {
    const { mode, repeatCount, currentCount } = get()
    if (mode === 'count') return currentCount < repeatCount
    if (mode === 'range') return true
    return false
  },
}))
