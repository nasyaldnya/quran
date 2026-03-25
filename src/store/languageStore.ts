import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AppLanguage {
  id: string
  code: string       // locale code sent to API: "ar", "eng", "fr", etc.
  language: string   // English name: "Arabic", "English", etc.
  native: string     // Native name: "العربية", "English", etc.
  dir: 'ltr' | 'rtl'
}

// All 21 languages from the Mp3Quran API
export const APP_LANGUAGES: AppLanguage[] = [
  { id: '1',  code: 'ar',  language: 'Arabic',          native: 'العربية',        dir: 'rtl' },
  { id: '2',  code: 'eng', language: 'English',         native: 'English',        dir: 'ltr' },
  { id: '3',  code: 'fr',  language: 'French',          native: 'Français',       dir: 'ltr' },
  { id: '4',  code: 'ru',  language: 'Russian',         native: 'Русский',        dir: 'ltr' },
  { id: '5',  code: 'de',  language: 'German',          native: 'Deutsch',        dir: 'ltr' },
  { id: '6',  code: 'es',  language: 'Spanish',         native: 'Español',        dir: 'ltr' },
  { id: '7',  code: 'tr',  language: 'Turkish',         native: 'Türkçe',         dir: 'ltr' },
  { id: '8',  code: 'cn',  language: 'Chinese',         native: '中文',            dir: 'ltr' },
  { id: '9',  code: 'th',  language: 'Thai',            native: 'ไทย',            dir: 'ltr' },
  { id: '10', code: 'ur',  language: 'Urdu',            native: 'اردو',           dir: 'rtl' },
  { id: '11', code: 'bn',  language: 'Bengali',         native: 'বাংলা',          dir: 'ltr' },
  { id: '12', code: 'bs',  language: 'Bosnian',         native: 'Bosanski',       dir: 'ltr' },
  { id: '13', code: 'ug',  language: 'Uyghur',          native: 'ئۇيغۇرچە',       dir: 'rtl' },
  { id: '14', code: 'fa',  language: 'Persian',         native: 'فارسی',          dir: 'rtl' },
  { id: '15', code: 'tg',  language: 'Tajik',           native: 'тоҷикӣ',         dir: 'ltr' },
  { id: '16', code: 'ml',  language: 'Malayalam',       native: 'മലയാളം',        dir: 'ltr' },
  { id: '17', code: 'tl',  language: 'Tagalog',         native: 'Tagalog',        dir: 'ltr' },
  { id: '18', code: 'id',  language: 'Indonesian',      native: 'Indonesia',      dir: 'ltr' },
  { id: '19', code: 'pt',  language: 'Portuguese',      native: 'Português',      dir: 'ltr' },
  { id: '20', code: 'ha',  language: 'Hausa',           native: 'Hausa',          dir: 'ltr' },
  { id: '21', code: 'sw',  language: 'Swahili',         native: 'Kiswahili',      dir: 'ltr' },
]

interface LanguageState {
  locale: string // current API locale code, e.g. "ar", "eng"
  setLocale: (code: string) => void
  getLanguage: () => AppLanguage
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: 'ar',

      setLocale: (code) => set({ locale: code }),

      getLanguage: () => {
        const { locale } = get()
        return APP_LANGUAGES.find((l) => l.code === locale) ?? APP_LANGUAGES[0]
      },
    }),
    { name: 'quran-language' }
  )
)
