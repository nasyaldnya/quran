// ── Al-Quran Cloud API Response Types ──────────────

export interface QuranAyah {
  number: number            // Global ayah number (1–6236)
  text: string              // Ayah text (Arabic or translation)
  numberInSurah: number     // Ayah number within the surah
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean }
}

export interface QuranEdition {
  identifier: string        // e.g. "quran-uthmani", "en.sahih"
  language: string          // e.g. "ar", "en", "ur"
  name: string              // e.g. "Uthmani", "Sahih International"
  englishName: string
  format: 'text' | 'audio'
  type: 'quran' | 'translation' | 'tafsir'
  direction: 'rtl' | 'ltr' | null
}

export interface QuranSurahData {
  number: number
  name: string              // Arabic name, e.g. "سُورَةُ ٱلْفَاتِحَةِ"
  englishName: string       // e.g. "Al-Faatiha"
  englishNameTranslation: string // e.g. "The Opening"
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
  ayahs: QuranAyah[]
  edition: QuranEdition
}

export interface QuranApiResponse<T> {
  code: number
  status: string
  data: T
}

// ── Available Translation Editions ──────────────────

export interface TranslationOption {
  id: string                // Edition identifier, e.g. "en.sahih"
  label: string             // Display name, e.g. "English — Sahih International"
  language: string          // Language code
  direction: 'ltr' | 'rtl'
}

export const TRANSLATION_EDITIONS: TranslationOption[] = [
  { id: 'en.sahih',        label: 'English — Sahih International',   language: 'en', direction: 'ltr' },
  { id: 'en.pickthall',    label: 'English — Pickthall',             language: 'en', direction: 'ltr' },
  { id: 'en.yusufali',     label: 'English — Yusuf Ali',             language: 'en', direction: 'ltr' },
  { id: 'ur.jalandhry',    label: 'اردو — جالندہری',                    language: 'ur', direction: 'rtl' },
  { id: 'ur.ahmedali',     label: 'اردو — احمد علی',                    language: 'ur', direction: 'rtl' },
  { id: 'fr.hamidullah',   label: 'Français — Hamidullah',           language: 'fr', direction: 'ltr' },
  { id: 'id.indonesian',   label: 'Bahasa Indonesia',                language: 'id', direction: 'ltr' },
  { id: 'tr.ates',         label: 'Türkçe — Süleyman Ateş',         language: 'tr', direction: 'ltr' },
  { id: 'de.aburida',      label: 'Deutsch — Abu Rida',              language: 'de', direction: 'ltr' },
  { id: 'es.cortes',       label: 'Español — Julio Cortes',          language: 'es', direction: 'ltr' },
  { id: 'ru.kuliev',       label: 'Русский — Кулиев',                language: 'ru', direction: 'ltr' },
  { id: 'bn.bengali',      label: 'বাংলা — মুহিউদ্দীন খান',                language: 'bn', direction: 'ltr' },
  { id: 'ml.abdulhameed',  label: 'മലയാളം — Abdul Hameed',            language: 'ml', direction: 'ltr' },
  { id: 'zh.majian',       label: '中文 — Ma Jian',                   language: 'zh', direction: 'ltr' },
]

// ── Available Tafsir Editions ───────────────────────

export interface TafsirOption {
  id: string
  label: string
  language: string
  direction: 'ltr' | 'rtl'
}

export const TAFSIR_EDITIONS: TafsirOption[] = [
  { id: 'ar.muyassar',     label: 'التفسير الميسر',                     language: 'ar', direction: 'rtl' },
  { id: 'ar.jalalayn',     label: 'تفسير الجلالين',                      language: 'ar', direction: 'rtl' },
  { id: 'en.ibn-kathir',   label: 'Ibn Kathir (English)',              language: 'en', direction: 'ltr' },
]
