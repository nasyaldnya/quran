import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteReciter {
  id: number
  name: string
  letter: string
  addedAt: number
}

interface FavoriteSurah {
  surahNumber: number
  surahNameEn: string
  surahNameAr: string
  addedAt: number
}

interface FavoritesState {
  reciters: FavoriteReciter[]
  surahs: FavoriteSurah[]

  // Reciter actions
  addReciter: (reciter: Omit<FavoriteReciter, 'addedAt'>) => void
  removeReciter: (id: number) => void
  isReciterFav: (id: number) => boolean
  toggleReciter: (reciter: Omit<FavoriteReciter, 'addedAt'>) => void

  // Surah actions
  addSurah: (surah: Omit<FavoriteSurah, 'addedAt'>) => void
  removeSurah: (surahNumber: number) => void
  isSurahFav: (surahNumber: number) => boolean
  toggleSurah: (surah: Omit<FavoriteSurah, 'addedAt'>) => void

  // Bulk
  clearAll: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      reciters: [],
      surahs: [],

      // ── Reciter actions ─────────────────────────
      addReciter: (reciter) =>
        set((s) => ({
          reciters: s.reciters.some((r) => r.id === reciter.id)
            ? s.reciters
            : [...s.reciters, { ...reciter, addedAt: Date.now() }],
        })),

      removeReciter: (id) =>
        set((s) => ({
          reciters: s.reciters.filter((r) => r.id !== id),
        })),

      isReciterFav: (id) => get().reciters.some((r) => r.id === id),

      toggleReciter: (reciter) => {
        const { isReciterFav, addReciter, removeReciter } = get()
        if (isReciterFav(reciter.id)) {
          removeReciter(reciter.id)
        } else {
          addReciter(reciter)
        }
      },

      // ── Surah actions ───────────────────────────
      addSurah: (surah) =>
        set((s) => ({
          surahs: s.surahs.some((su) => su.surahNumber === surah.surahNumber)
            ? s.surahs
            : [...s.surahs, { ...surah, addedAt: Date.now() }],
        })),

      removeSurah: (surahNumber) =>
        set((s) => ({
          surahs: s.surahs.filter((su) => su.surahNumber !== surahNumber),
        })),

      isSurahFav: (surahNumber) =>
        get().surahs.some((su) => su.surahNumber === surahNumber),

      toggleSurah: (surah) => {
        const { isSurahFav, addSurah, removeSurah } = get()
        if (isSurahFav(surah.surahNumber)) {
          removeSurah(surah.surahNumber)
        } else {
          addSurah(surah)
        }
      },

      // ── Bulk ────────────────────────────────────
      clearAll: () => set({ reciters: [], surahs: [] }),
    }),
    {
      name: 'quran-favorites',
    }
  )
)
