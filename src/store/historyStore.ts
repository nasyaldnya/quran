import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track } from '@/types/api'

const MAX_HISTORY = 100

export interface HistoryEntry {
  track: Track
  playedAt: number   // timestamp
}

interface HistoryState {
  entries: HistoryEntry[]

  // Actions
  addEntry: (track: Track) => void
  removeEntry: (index: number) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (track) =>
        set((s) => {
          // Remove duplicate if same audioUrl already exists (move to top)
          const filtered = s.entries.filter(
            (e) => e.track.audioUrl !== track.audioUrl
          )

          const newEntry: HistoryEntry = {
            track,
            playedAt: Date.now(),
          }

          // Prepend new entry, cap at MAX_HISTORY
          return {
            entries: [newEntry, ...filtered].slice(0, MAX_HISTORY),
          }
        }),

      removeEntry: (index) =>
        set((s) => ({
          entries: s.entries.filter((_, i) => i !== index),
        })),

      clearHistory: () => set({ entries: [] }),
    }),
    {
      name: 'quran-history',
    }
  )
)
