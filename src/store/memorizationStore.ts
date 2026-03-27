import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type HideLevel = 0 | 1 | 2 | 3 | 4
// 0 = show all, 1 = hide last word, 2 = hide last 2, 3 = hide half, 4 = hide all

interface MemorizationState {
  isActive: boolean
  hideLevel: HideLevel
  // Track which surahs the user is memorizing and their progress
  memorizedAyahs: Record<string, boolean> // "surah:ayah" → memorized

  toggleActive: () => void
  setHideLevel: (level: HideLevel) => void
  markMemorized: (surahNumber: number, ayahNumber: number) => void
  unmarkMemorized: (surahNumber: number, ayahNumber: number) => void
  isMemorized: (surahNumber: number, ayahNumber: number) => boolean
  getMemorizedCount: (surahNumber: number, totalAyahs: number) => number
}

export const useMemorizationStore = create<MemorizationState>()(
  persist(
    (set, get) => ({
      isActive: false,
      hideLevel: 0,
      memorizedAyahs: {},

      toggleActive: () => set((s) => ({ isActive: !s.isActive })),
      setHideLevel: (level) => set({ hideLevel: level }),

      markMemorized: (surahNumber, ayahNumber) =>
        set((s) => ({
          memorizedAyahs: { ...s.memorizedAyahs, [`${surahNumber}:${ayahNumber}`]: true },
        })),

      unmarkMemorized: (surahNumber, ayahNumber) =>
        set((s) => {
          const copy = { ...s.memorizedAyahs }
          delete copy[`${surahNumber}:${ayahNumber}`]
          return { memorizedAyahs: copy }
        }),

      isMemorized: (surahNumber, ayahNumber) =>
        !!get().memorizedAyahs[`${surahNumber}:${ayahNumber}`],

      getMemorizedCount: (surahNumber, totalAyahs) => {
        const memo = get().memorizedAyahs
        let count = 0
        for (let i = 1; i <= totalAyahs; i++) {
          if (memo[`${surahNumber}:${i}`]) count++
        }
        return count
      },
    }),
    { name: 'quran-memorization' }
  )
)

// Hide words from an Arabic text based on hide level
export function applyHideLevel(text: string, level: HideLevel): string {
  if (level === 0) return text
  const words = text.split(/\s+/)
  const total = words.length
  if (total <= 1) return level >= 3 ? '● ● ●' : text

  let hideCount: number
  switch (level) {
    case 1: hideCount = 1; break
    case 2: hideCount = Math.min(2, total - 1); break
    case 3: hideCount = Math.ceil(total / 2); break
    case 4: return words.map(() => '●').join(' ')
    default: return text
  }

  const visible = words.slice(0, total - hideCount)
  const hidden = words.slice(total - hideCount).map(() => '●')
  return [...visible, ...hidden].join(' ')
}
