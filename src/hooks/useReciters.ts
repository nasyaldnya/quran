import { useQuery } from '@tanstack/react-query'
import { fetchReciters, fetchReciterById, fetchSurahs } from '@/lib/api'
import type { Reciter, Surah } from '@/types/api'

// ── Reciters ────────────────────────────────────────

export function useReciters() {
  return useQuery({
    queryKey:  ['reciters'],
    queryFn:   fetchReciters,
    select:    (data) => data.reciters as Reciter[],
  })
}

export function useReciter(id: number | undefined) {
  return useQuery({
    queryKey:  ['reciter', id],
    queryFn:   () => fetchReciterById(id!),
    enabled:   !!id,
    select:    (data) => data.reciters?.[0] as Reciter | undefined,
  })
}

// ── Surahs ──────────────────────────────────────────

export function useSurahs() {
  return useQuery({
    queryKey:  ['surahs'],
    queryFn:   fetchSurahs,
    select:    (data) => data.suwar as Surah[],
  })
}
