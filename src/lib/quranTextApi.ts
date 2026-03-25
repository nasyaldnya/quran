import axios from 'axios'
import type { QuranApiResponse, QuranSurahData } from '@/types/quranText'

const quranClient = axios.create({
  baseURL: 'https://api.alquran.cloud/v1',
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

// ── Arabic Text ───────────────────────────────────
// Fetches Uthmanic Arabic text for a given surah
export async function fetchSurahArabic(
  surahNumber: number
): Promise<QuranSurahData> {
  const { data } = await quranClient.get<QuranApiResponse<QuranSurahData>>(
    `/surah/${surahNumber}/quran-uthmani`
  )
  return data.data
}

// ── Translation ───────────────────────────────────
// Fetches a translated edition for a given surah
export async function fetchSurahTranslation(
  surahNumber: number,
  edition: string
): Promise<QuranSurahData> {
  const { data } = await quranClient.get<QuranApiResponse<QuranSurahData>>(
    `/surah/${surahNumber}/${edition}`
  )
  return data.data
}

// ── Tafsir ────────────────────────────────────────
// Fetches tafsir (commentary) for a given surah
export async function fetchSurahTafsir(
  surahNumber: number,
  edition: string
): Promise<QuranSurahData> {
  const { data } = await quranClient.get<QuranApiResponse<QuranSurahData>>(
    `/surah/${surahNumber}/${edition}`
  )
  return data.data
}

// ── Multi-edition (Arabic + Translation in one call) ──
// Returns an array of 2 SurahData objects: [arabic, translation]
export async function fetchSurahMultiEdition(
  surahNumber: number,
  translationEdition: string
): Promise<QuranSurahData[]> {
  const { data } = await quranClient.get<QuranApiResponse<QuranSurahData[]>>(
    `/surah/${surahNumber}/editions/quran-uthmani,${translationEdition}`
  )
  return data.data
}
