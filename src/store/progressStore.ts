import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  // Surahs fully listened to (audio played to end)
  listenedSurahs: Set<number>
  // Surahs fully read (scrolled through text panel)
  readSurahs: Set<number>

  // Serialized for persist (Sets don't serialize)
  _listened: number[]
  _read: number[]

  markListened: (surahNumber: number) => void
  markRead: (surahNumber: number) => void
  isListened: (surahNumber: number) => boolean
  isRead: (surahNumber: number) => boolean
  getListenedCount: () => number
  getReadCount: () => number
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      listenedSurahs: new Set<number>(),
      readSurahs: new Set<number>(),
      _listened: [],
      _read: [],

      markListened: (surahNumber) =>
        set((s) => {
          const next = new Set(s._listened)
          next.add(surahNumber)
          return { _listened: Array.from(next), listenedSurahs: next }
        }),

      markRead: (surahNumber) =>
        set((s) => {
          const next = new Set(s._read)
          next.add(surahNumber)
          return { _read: Array.from(next), readSurahs: next }
        }),

      isListened: (surahNumber) => get()._listened.includes(surahNumber),
      isRead: (surahNumber) => get()._read.includes(surahNumber),
      getListenedCount: () => get()._listened.length,
      getReadCount: () => get()._read.length,

      resetProgress: () =>
        set({ _listened: [], _read: [], listenedSurahs: new Set(), readSurahs: new Set() }),
    }),
    {
      name: 'quran-progress',
      partialize: (state) => ({
        _listened: state._listened,
        _read: state._read,
      }),
    }
  )
)
