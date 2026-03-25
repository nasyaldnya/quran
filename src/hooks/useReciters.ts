import { useQuery } from '@tanstack/react-query'
import { fetchReciters, fetchReciterById, fetchSurahs } from '@/lib/api'
import { useLanguageStore } from '@/store/languageStore'
import type { Reciter, Surah } from '@/types/api'

// ── Reciters ────────────────────────────────────────

export function useReciters() {
  const locale = useLanguageStore((s) => s.locale)
  return useQuery({
    queryKey:  ['reciters', locale],
    queryFn:   () => fetchReciters(locale),
    select:    (data) => data.reciters as Reciter[],
  })
}

export function useReciter(id: number | undefined) {
  const locale = useLanguageStore((s) => s.locale)
  return useQuery({
    queryKey:  ['reciter', id, locale],
    queryFn:   () => fetchReciterById(id!, locale),
    enabled:   !!id,
    select:    (data) => data.reciters?.[0] as Reciter | undefined,
  })
}

// ── Surahs ──────────────────────────────────────────

export function useSurahs() {
  const locale = useLanguageStore((s) => s.locale)
  return useQuery({
    queryKey:  ['surahs', locale],
    queryFn:   () => fetchSurahs(locale),
    select:    (data) => data.suwar as Surah[],
  })
}
