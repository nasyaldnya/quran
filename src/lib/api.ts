import axios from 'axios'
import type { RecitersResponse, SurahsResponse } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { Accept: 'application/json' },
})

// ── Reciters ──────────────────────────────────────

export async function fetchReciters(language: string): Promise<RecitersResponse> {
  const { data } = await apiClient.get<RecitersResponse>('/reciters', {
    params: { language },
  })
  return data
}

export async function fetchReciterById(id: number, language: string): Promise<RecitersResponse> {
  const { data } = await apiClient.get<RecitersResponse>('/reciters', {
    params: { language, reciter: id },
  })
  return data
}

// ── Surahs ────────────────────────────────────────

export async function fetchSurahs(language: string): Promise<SurahsResponse> {
  const { data } = await apiClient.get<SurahsResponse>('/suwar', {
    params: { language },
  })
  return data
}

// ── Audio URL Builder ─────────────────────────────
// Mp3Quran pattern: {server}/{surahNumber padded to 3 digits}.mp3
export function buildAudioUrl(server: string, surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, '0')
  const base   = server.endsWith('/') ? server : `${server}/`
  return `${base}${padded}.mp3`
}
