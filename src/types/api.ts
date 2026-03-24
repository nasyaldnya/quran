// ── Mp3Quran API v3 Response Types ─────────────────

export interface Moshaf {
  id: number
  name: string
  server: string          // base URL for audio files, e.g. "https://server.mp3quran.net/..."
  surah_total: number
  moshaf_type: number
  surah_list: string      // comma-separated surah numbers, e.g. "1,2,3,..."
}

export interface Reciter {
  id: number
  name: string
  letter: string          // First letter for alphabetic grouping
  moshaf: Moshaf[]
}

export interface RecitersResponse {
  reciters: Reciter[]
}

export interface Surah {
  id: number
  name: string            // Arabic name from API
}

export interface SurahsResponse {
  suwar: Surah[]
}

// ── Internal App Types ──────────────────────────────

export interface Track {
  surahNumber: number
  surahNameAr: string
  surahNameEn: string
  reciterName: string
  reciterId: number
  moshafId: number
  audioUrl: string        // full constructed URL: server + surahNumber.mp3
  verseCount: number
  revelationType: 'Makki' | 'Madani'
}
