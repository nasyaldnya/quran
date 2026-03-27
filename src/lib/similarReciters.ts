import type { Reciter } from '@/types/api'
import { classifyMoshafType } from './recitationStyles'

// Find reciters with similar recitation styles
// Sorts by: same style → similar surah count → alphabetical
export function findSimilarReciters(
  targetReciter: Reciter,
  allReciters: Reciter[],
  limit: number = 6
): Reciter[] {
  if (!targetReciter.moshaf[0]) return []

  const targetStyle = classifyMoshafType(targetReciter.moshaf[0].moshaf_type)
  const targetSurahCount = targetReciter.moshaf[0].surah_total

  return allReciters
    .filter((r) => r.id !== targetReciter.id && r.moshaf.length > 0)
    .map((r) => {
      const style = classifyMoshafType(r.moshaf[0].moshaf_type)
      const sameStyle = style === targetStyle ? 1 : 0
      const surahDiff = Math.abs(r.moshaf[0].surah_total - targetSurahCount)
      return { reciter: r, sameStyle, surahDiff }
    })
    .sort((a, b) => {
      // Prefer same style first
      if (b.sameStyle !== a.sameStyle) return b.sameStyle - a.sameStyle
      // Then prefer similar surah count (closer = better)
      return a.surahDiff - b.surahDiff
    })
    .slice(0, limit)
    .map((r) => r.reciter)
}
