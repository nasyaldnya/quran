import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AyahBookmark {
  surahNumber: number
  ayahNumber: number
  surahNameEn: string
  surahNameAr: string
  arabicText: string
  note?: string
  createdAt: number
}

interface BookmarkState {
  bookmarks: AyahBookmark[]
  addBookmark: (bookmark: Omit<AyahBookmark, 'createdAt'>) => void
  removeBookmark: (surahNumber: number, ayahNumber: number) => void
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean
  toggleBookmark: (bookmark: Omit<AyahBookmark, 'createdAt'>) => void
  clearAll: () => void
}

const MAX_BOOKMARKS = 500

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (bookmark) =>
        set((s) => {
          if (s.bookmarks.some((b) => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber))
            return s
          return { bookmarks: [{ ...bookmark, createdAt: Date.now() }, ...s.bookmarks].slice(0, MAX_BOOKMARKS) }
        }),

      removeBookmark: (surahNumber, ayahNumber) =>
        set((s) => ({
          bookmarks: s.bookmarks.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)),
        })),

      isBookmarked: (surahNumber, ayahNumber) =>
        get().bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber),

      toggleBookmark: (bookmark) => {
        const { isBookmarked, addBookmark, removeBookmark } = get()
        if (isBookmarked(bookmark.surahNumber, bookmark.ayahNumber)) {
          removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)
        } else {
          addBookmark(bookmark)
        }
      },

      clearAll: () => set({ bookmarks: [] }),
    }),
    { name: 'quran-bookmarks' }
  )
)
