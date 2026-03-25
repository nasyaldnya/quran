import { useQuery } from '@tanstack/react-query'
import {
  fetchSurahArabic,
  fetchSurahTranslation,
  fetchSurahTafsir,
} from '@/lib/quranTextApi'
import type { QuranSurahData } from '@/types/quranText'

// ── Arabic Uthmanic text ──────────────────────────
export function useQuranArabic(surahNumber: number | undefined) {
  return useQuery<QuranSurahData>({
    queryKey: ['quran-arabic', surahNumber],
    queryFn: () => fetchSurahArabic(surahNumber!),
    enabled: !!surahNumber,
    staleTime: Infinity,        // Quran text never changes
    gcTime: 1000 * 60 * 60 * 2, // Keep in cache 2 hours
    retry: 2,
  })
}

// ── Translation ───────────────────────────────────
export function useQuranTranslation(
  surahNumber: number | undefined,
  edition: string | null
) {
  return useQuery<QuranSurahData>({
    queryKey: ['quran-translation', surahNumber, edition],
    queryFn: () => fetchSurahTranslation(surahNumber!, edition!),
    enabled: !!surahNumber && !!edition,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 2,
  })
}

// ── Tafsir ────────────────────────────────────────
export function useQuranTafsir(
  surahNumber: number | undefined,
  edition: string | null
) {
  return useQuery<QuranSurahData>({
    queryKey: ['quran-tafsir', surahNumber, edition],
    queryFn: () => fetchSurahTafsir(surahNumber!, edition!),
    enabled: !!surahNumber && !!edition,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 2,
  })
}
