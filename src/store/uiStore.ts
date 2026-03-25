import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  // Quran text panel
  isTextPanelOpen: boolean
  toggleTextPanel: () => void
  setTextPanelOpen: (v: boolean) => void

  // Selected translation edition (null = disabled)
  selectedTranslation: string | null
  setSelectedTranslation: (edition: string | null) => void

  // Selected tafsir edition (null = disabled)
  selectedTafsir: string | null
  setSelectedTafsir: (edition: string | null) => void

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

      selectedTranslation: 'en.sahih', // Default to English Sahih
      setSelectedTranslation: (edition) => set({ selectedTranslation: edition }),

      selectedTafsir: null,             // Off by default
      setSelectedTafsir: (edition) => set({ selectedTafsir: edition, expandedAyah: null }),

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
        // Only persist user preferences, not ephemeral UI state
        selectedTranslation: state.selectedTranslation,
        selectedTafsir: state.selectedTafsir,
      }),
    }
  )
)
