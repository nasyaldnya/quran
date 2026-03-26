import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  // Quran text panel
  isTextPanelOpen: boolean
  toggleTextPanel: () => void
  setTextPanelOpen: (v: boolean) => void

  // Surah being viewed (independent of audio playback)
  // When set, panel shows this surah. When null, falls back to currentTrack.
  viewingSurahNumber: number | null
  setViewingSurahNumber: (num: number | null) => void
  openSurah: (surahNumber: number) => void

  // Selected translation edition (null = disabled)
  selectedTranslation: string | null
  setSelectedTranslation: (edition: string | null) => void

  // Selected tafsir edition (null = disabled)
  selectedTafsir: string | null
  setSelectedTafsir: (edition: string | null) => void

  // Arabic font size (rem)
  arabicFontSize: number
  setArabicFontSize: (size: number) => void

  // Currently expanded ayah for tafsir (null = all collapsed)
  expandedAyah: number | null
  setExpandedAyah: (ayahNum: number | null) => void
  toggleExpandedAyah: (ayahNum: number) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      isTextPanelOpen: false,
      toggleTextPanel: () => set((s) => ({ isTextPanelOpen: !s.isTextPanelOpen })),
      setTextPanelOpen: (v) => set({ isTextPanelOpen: v }),

      viewingSurahNumber: null,
      setViewingSurahNumber: (num) => set({ viewingSurahNumber: num }),
      openSurah: (surahNumber) =>
        set({ viewingSurahNumber: surahNumber, isTextPanelOpen: true, expandedAyah: null }),

      selectedTranslation: 'en.sahih',
      setSelectedTranslation: (edition) => set({ selectedTranslation: edition }),

      selectedTafsir: null,
      setSelectedTafsir: (edition) => set({ selectedTafsir: edition, expandedAyah: null }),

      arabicFontSize: 1.5,
      setArabicFontSize: (size) => set({ arabicFontSize: size }),

      expandedAyah: null,
      setExpandedAyah: (ayahNum) => set({ expandedAyah: ayahNum }),
      toggleExpandedAyah: (ayahNum) =>
        set((s) => ({
          expandedAyah: s.expandedAyah === ayahNum ? null : ayahNum,
        })),
    }),
    {
      name: 'quran-ui',
      partialize: (state) => ({
        selectedTranslation: state.selectedTranslation,
        selectedTafsir: state.selectedTafsir,
        arabicFontSize: state.arabicFontSize,
      }),
    }
  )
)
