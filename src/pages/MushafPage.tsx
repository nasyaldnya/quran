import { useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, ChevronLeft, ChevronRight, Search,
  Maximize2, Minimize2, Layers, Palette,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'
import { parseTajweed } from '@/lib/tajweedParser'
import { JUZ_BOUNDARIES } from '@/lib/juzData'
import { cn } from '@/lib/utils'

// ── Types ──
interface PageAyah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  hizbQuarter: number
  surah: { number: number; name: string; englishName: string }
  page: number
}

type ViewMode = 'mushaf' | 'editions'
type Category = 'hafs' | 'qiraat' | 'translations'

interface QuranEdition {
  id: string
  nameAr: string
  nameEn: string
  category: Category
  url: string
}

// ── Constants ──
const TOTAL_PAGES = 604
const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'

const EDITIONS: QuranEdition[] = [
  // حفص
  { id: 'hafs-mumtaz', nameAr: 'المصحف الممتاز', nameEn: 'Al-Mumtaz', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11311/1/' },
  { id: 'hafs-khas1', nameAr: 'المصحف الخاص ١', nameEn: 'Special 1', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11309/1/' },
  { id: 'hafs-jawami', nameAr: 'المصحف الجوامعي', nameEn: 'Al-Jawami', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11305/1/' },
  { id: 'hafs-jawami3', nameAr: 'الجوامعي – ٣', nameEn: 'Al-Jawami 3', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11552/1/' },
  { id: 'hafs-normal', nameAr: 'المصحف العادي', nameEn: 'Standard', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11301/1/' },
  { id: 'hafs-normal3', nameAr: 'العادي – ٣', nameEn: 'Standard 3', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11299/1/' },
  { id: 'hafs-wasat', nameAr: 'المصحف الوسط', nameEn: 'Medium', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11297/1/' },
  { id: 'hafs-pocket', nameAr: 'مصحف الجيب', nameEn: 'Pocket', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11295/1/' },
  { id: 'hafs-kafi', nameAr: 'المصحف الكفي', nameEn: 'Palm', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11293/1/' },
  { id: 'hafs-indopak', nameAr: 'نسخ إندوباك', nameEn: 'IndoPak', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11291/1/' },
  { id: 'hafs-yasin', nameAr: 'ربع يس', nameEn: 'Quarter Yasin', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11289/1/' },
  { id: 'hafs-qadsami', nameAr: 'جزء قد سمع', nameEn: 'Juz Qad Sami', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11286/1/' },
  { id: 'hafs-tabarak', nameAr: 'جزء تبارك', nameEn: 'Juz Tabarak', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11284/1/' },
  { id: 'hafs-amma', nameAr: 'الفاتحة وجزء عم', nameEn: "Juz 'Amma", category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11282/1/' },
  // قراءات
  { id: 'qiraat-warsh', nameAr: 'مصحف ورش', nameEn: 'Warsh', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11326/1/' },
  { id: 'qiraat-duri', nameAr: 'مصحف الدوري', nameEn: 'Ad-Duri', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11324/1/' },
  { id: 'qiraat-qalun', nameAr: 'مصحف قالون', nameEn: 'Qalun', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11322/1/' },
  { id: 'qiraat-shubah', nameAr: 'مصحف شعبة', nameEn: "Shu'bah", category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11319/1/' },
  { id: 'qiraat-susi', nameAr: 'مصحف السوسي', nameEn: 'As-Susi', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11317/1/' },
  // ترجمات
  { id: 'tr-azerbaijani', nameAr: 'الأذرية', nameEn: 'Azerbaijani', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11469/1/' },
  { id: 'tr-urdu', nameAr: 'الأردية', nameEn: 'Urdu', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11467/1/' },
  { id: 'tr-indonesian', nameAr: 'الإندونيسية', nameEn: 'Indonesian', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11465/1/' },
  { id: 'tr-avar1', nameAr: 'الأوارية – ١', nameEn: 'Avar Vol.1', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11463/1/' },
  { id: 'tr-avar2', nameAr: 'الأوارية – ٢', nameEn: 'Avar Vol.2', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11461/1/' },
  { id: 'tr-pashto1', nameAr: 'البشتو – ١', nameEn: 'Pashto Vol.1', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11458/1/' },
  { id: 'tr-pashto2', nameAr: 'البشتو – ٢', nameEn: 'Pashto Vol.2', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11456/1/' },
  { id: 'tr-bengali1', nameAr: 'البنغالية – ١', nameEn: 'Bengali Vol.1', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11451/1/' },
  { id: 'tr-bengali2', nameAr: 'البنغالية – ٢', nameEn: 'Bengali Vol.2', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11448/1/' },
  { id: 'tr-turkish', nameAr: 'التركية', nameEn: 'Turkish', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11444/1/' },
  { id: 'tr-tagalog', nameAr: 'التغالوغ', nameEn: 'Tagalog', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11442/1/' },
  { id: 'tr-telugu', nameAr: 'التلغو', nameEn: 'Telugu', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11440/1/' },
  { id: 'tr-chinese', nameAr: 'الصينية', nameEn: 'Chinese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11438/1/' },
  { id: 'tr-tajik', nameAr: 'الطاجيكية', nameEn: 'Tajik', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11436/1/' },
  { id: 'tr-persian', nameAr: 'الفارسية', nameEn: 'Persian', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11986/1/' },
  { id: 'tr-vietnamese', nameAr: 'الفيتنامية', nameEn: 'Vietnamese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11432/1/' },
  { id: 'tr-kyrgyz', nameAr: 'القيرغيزية', nameEn: 'Kyrgyz', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11429/1/' },
  { id: 'tr-kurdish-k', nameAr: 'الكردية الكرمانجية', nameEn: 'Kurdish Kurmanji', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11427/1/' },
  { id: 'tr-malay', nameAr: 'الملايوية', nameEn: 'Malay', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11425/1/' },
  { id: 'tr-malayalam', nameAr: 'المليالم', nameEn: 'Malayalam', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11423/1/' },
  { id: 'tr-mandar', nameAr: 'المندرية', nameEn: 'Mandar', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11421/1/' },
  { id: 'tr-nepali', nameAr: 'النيبالية', nameEn: 'Nepali', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11419/1/' },
  { id: 'tr-hindi', nameAr: 'الهندية', nameEn: 'Hindi', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11417/1/' },
  { id: 'tr-japanese', nameAr: 'اليابانية', nameEn: 'Japanese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11415/1/' },
  { id: 'tr-kannada', nameAr: 'الكنّاديّة', nameEn: 'Kannada', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11393/1/' },
  { id: 'tr-kurdish-s', nameAr: 'الكردية السورانية', nameEn: 'Kurdish Sorani', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11988/1/' },
  { id: 'tr-dari', nameAr: 'الدريّة', nameEn: 'Dari', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11937/1/' },
]

const CATEGORIES: { id: Category; labelAr: string; labelEn: string }[] = [
  { id: 'hafs', labelAr: 'مصحف حفص', labelEn: 'Hafs' },
  { id: 'qiraat', labelAr: 'الروايات الأخرى', labelEn: 'Other Qiraat' },
  { id: 'translations', labelAr: 'الترجمات', labelEn: 'Translations' },
]

// Convert number to Arabic-Indic digits
function toArabicNum(n: number): string {
  return n.toLocaleString('ar-EG')
}

// ── Inline Tajweed Ayah Renderer ──
function TajweedInline({ text }: { text: string }) {
  const parts = useMemo(() => parseTajweed(text), [text])
  return (
    <>
      {parts.map((p, i) =>
        p.color
          ? <span key={i} style={{ color: p.color }}>{p.text}</span>
          : <span key={i}>{p.text}</span>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════

export default function MushafPage() {
  const t = useT()
  const { arabicFontSize } = useUiStore()

  // View mode: mushaf reader vs editions viewer
  const [viewMode, setViewMode] = useState<ViewMode>('mushaf')

  // ── Mushaf state ──
  const [page, setPage] = useState(1)
  const [ayahs, setAyahs] = useState<PageAyah[]>([])
  const [tajweedTexts, setTajweedTexts] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [tajweedOn, setTajweedOn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<{ page: number; surah: string; ayah: number }[]>([])
  const [searchDone, setSearchDone] = useState(false)

  // ── Editions state ──
  const [edCategory, setEdCategory] = useState<Category>('hafs')
  const [selectedEdition, setSelectedEdition] = useState<QuranEdition>(EDITIONS[0])
  const [fullscreen, setFullscreen] = useState(false)

  const filteredEditions = useMemo(() => EDITIONS.filter(e => e.category === edCategory), [edCategory])

  // ── Fetch mushaf page ──
  useEffect(() => {
    if (viewMode !== 'mushaf') return
    setLoading(true)

    const edition = tajweedOn ? 'quran-tajweed' : 'quran-uthmani'
    fetch(`https://api.alquran.cloud/v1/page/${page}/${edition}`)
      .then(r => r.json())
      .then(data => {
        const fetched: PageAyah[] = data.data?.ayahs ?? []
        setAyahs(fetched)

        if (tajweedOn) {
          // Store raw tajweed texts keyed by ayah number
          const map: Record<number, string> = {}
          for (const a of fetched) map[a.number] = a.text
          setTajweedTexts(map)

          // Also fetch plain text for structure (surah names etc come from either)
          // The tajweed edition already includes surah metadata, so we're good
        }
      })
      .catch(() => setAyahs([]))
      .finally(() => setLoading(false))
  }, [page, viewMode, tajweedOn])

  // ── Search ──
  const doSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return
    setSearchLoading(true)
    setSearchDone(true)
    try {
      const isArabic = /[\u0600-\u06FF]/.test(searchQuery)
      const stripped = searchQuery.trim().replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
      const edition = isArabic ? 'quran-simple' : 'en.sahih'
      const q = isArabic ? stripped : searchQuery.trim()

      const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(q)}/all/${edition}`)
      const data = await res.json()
      const matches = (data.data?.matches ?? []).slice(0, 30).map((m: any) => ({
        page: m.surah?.number ?? 1,
        surah: m.surah?.englishName ?? '',
        ayah: m.numberInSurah ?? 1,
        surahNum: m.surah?.number ?? 1,
        // We need the page number — approximate from surah:ayah
        // The API match includes page in some editions
      }))
      setSearchResults(matches)
    } catch {
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [searchQuery])

  // ── Group ayahs by surah ──
  const surahGroups = useMemo(() => {
    const groups: { surahName: string; surahNameEn: string; surahNum: number; ayahs: PageAyah[] }[] = []
    let last = -1
    for (const a of ayahs) {
      if (a.surah.number !== last) {
        groups.push({ surahName: a.surah.name, surahNameEn: a.surah.englishName, surahNum: a.surah.number, ayahs: [] })
        last = a.surah.number
      }
      groups[groups.length - 1].ayahs.push(a)
    }
    return groups
  }, [ayahs])

  // Detect juz start on this page
  const juzOnPage = useMemo(() => {
    if (ayahs.length === 0) return null
    const firstAyah = ayahs[0]
    return firstAyah.juz
  }, [ayahs])

  const prevPage = () => setPage(p => Math.max(1, p - 1))
  const nextPage = () => setPage(p => Math.min(TOTAL_PAGES, p + 1))

  // ── Render ayah text (tajweed or plain) ──
  const renderAyahText = (a: PageAyah): ReactNode => {
    if (tajweedOn && tajweedTexts[a.number]) {
      return <TajweedInline text={tajweedTexts[a.number]} />
    }
    return <>{a.text}</>
  }

  return (
    <PageTransition>
      {/* ── Header ── */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block" opacity={0.05} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">{t.nav_mushaf}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              {t.mushaf_page_title}
              <span className="mr-3 text-xl font-normal text-muted-foreground arabic"> المصحف الشريف</span>
            </h1>

            {/* View mode tabs */}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setViewMode('mushaf')}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                  viewMode === 'mushaf' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card text-muted-foreground border-border/60 hover:text-foreground')}>
                <BookOpen className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                {t.mushaf_reader}
              </button>
              <button onClick={() => setViewMode('editions')}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                  viewMode === 'editions' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card text-muted-foreground border-border/60 hover:text-foreground')}>
                <Layers className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                {t.editions_label}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
           MUSHAF READER VIEW
         ══════════════════════════════════════════════ */}
      {viewMode === 'mushaf' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {/* Toolbar: search + tajweed toggle + page nav */}
          <div className="flex flex-col gap-3 mb-6">
            {/* Search bar */}
            <div className="flex gap-2">
              <input type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                placeholder={t.search_placeholder}
                className="flex-1 px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                dir="auto" />
              <Button onClick={doSearch} disabled={searchLoading || !searchQuery.trim()} size="sm">
                {searchLoading
                  ? <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  : <Search className="w-3.5 h-3.5" />}
              </Button>
            </div>

            {/* Search results */}
            {searchDone && searchResults.length > 0 && (
              <div className="max-h-32 overflow-y-auto rounded-xl border border-border/60 bg-card p-2 space-y-0.5">
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => { setSearchResults([]); setSearchDone(false) }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-accent transition-colors flex justify-between">
                    <span className="text-foreground">{r.surah} : {r.ayah}</span>
                  </button>
                ))}
              </div>
            )}
            {searchDone && !searchLoading && searchResults.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">{t.search_no_results}</p>
            )}

            {/* Controls row */}
            <div className="flex items-center justify-between">
              {/* Tajweed toggle */}
              <button onClick={() => setTajweedOn(v => !v)}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border',
                  tajweedOn ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground border-border/60 hover:text-foreground')}>
                <Palette className="w-3.5 h-3.5" />
                {t.tajweed}
              </button>

              {/* Page navigation */}
              <div className="flex items-center gap-2" dir="ltr">
                <Button variant="ghost" size="icon-sm" onClick={prevPage} disabled={page <= 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <input type="number" min={1} max={TOTAL_PAGES} value={page}
                  onChange={e => { const v = Number(e.target.value); if (v >= 1 && v <= TOTAL_PAGES) setPage(v) }}
                  className="w-14 text-center px-1 py-1 rounded-lg bg-background border border-border/80 text-foreground text-sm font-bold tabular-nums" />
                <span className="text-xs text-muted-foreground">/ {TOTAL_PAGES}</span>
                <Button variant="ghost" size="icon-sm" onClick={nextPage} disabled={page >= TOTAL_PAGES}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* ── Mushaf page content ── */}
          <motion.div key={`${page}-${tajweedOn}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl border border-border/60 bg-card p-5 sm:p-8 min-h-[60vh]">

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div dir="rtl" lang="ar">
                {/* Juz marker */}
                {ayahs.length > 0 && ayahs[0].numberInSurah === 1 && juzOnPage && (
                  <div className="text-center mb-3">
                    <span className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                      الجزء {toArabicNum(juzOnPage)}
                    </span>
                  </div>
                )}

                {surahGroups.map(group => (
                  <div key={`${group.surahNum}-${page}`} className="mb-4">
                    {/* Surah header — when surah begins on this page */}
                    {group.ayahs[0].numberInSurah === 1 && (
                      <div className="text-center py-4 mb-4 border-y border-primary/15 bg-primary/[0.03] rounded-xl mx-[-0.5rem] px-2">
                        {/* Decorative surah frame */}
                        <div className="inline-block">
                          <p className="font-arabic text-2xl sm:text-3xl text-primary leading-relaxed">
                            ❁ {group.surahName} ❁
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {group.surahNameEn} · {group.ayahs.length > 0 ? toArabicNum(group.ayahs[group.ayahs.length - 1].numberInSurah) : ''} {t.ayahs}
                          </p>
                        </div>
                        {/* Bismillah */}
                        {group.surahNum !== 9 && group.surahNum !== 1 && (
                          <p className="font-arabic text-lg text-muted-foreground mt-3">
                            {BISMILLAH}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Continuous text flow */}
                    <p className="font-arabic leading-[2.4] text-foreground text-justify"
                      style={{ fontSize: `${arabicFontSize * 1.1}rem` }}>
                      {group.ayahs.map(a => (
                        <span key={a.number}>
                          {renderAyahText(a)}
                          <span className="inline-flex items-center justify-center mx-0.5 text-primary font-arabic"
                            style={{ fontSize: '0.55em' }}>
                            ﴿{toArabicNum(a.numberInSurah)}﴾
                          </span>
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Bottom nav */}
          <div className="flex items-center justify-center gap-4 mt-5" dir="ltr">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={page <= 1}>
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {t.mushaf_prev_page}
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">{page} / {TOTAL_PAGES}</span>
            <Button variant="outline" size="sm" onClick={nextPage} disabled={page >= TOTAL_PAGES}>
              {t.mushaf_next_page} <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           EDITIONS VIEWER
         ══════════════════════════════════════════════ */}
      {viewMode === 'editions' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(cat => (
              <button key={cat.id}
                onClick={() => { setEdCategory(cat.id); const f = EDITIONS.find(e => e.category === cat.id); if (f) setSelectedEdition(f) }}
                className={cn('px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border',
                  edCategory === cat.id ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card text-muted-foreground border-border/60 hover:text-foreground')}>
                <span className="hidden sm:inline">{cat.labelAr}</span>
                <span className="sm:hidden">{cat.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Edition grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-5">
            {filteredEditions.map(ed => (
              <button key={ed.id} onClick={() => setSelectedEdition(ed)}
                className={cn('px-3 py-2.5 rounded-xl text-right transition-all border',
                  selectedEdition.id === ed.id ? 'bg-primary/10 text-primary border-primary/30 shadow-sm' : 'bg-card text-foreground border-border/60 hover:border-primary/30')}>
                <p className="text-xs font-semibold truncate arabic">{ed.nameAr}</p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">{ed.nameEn}</p>
              </button>
            ))}
          </div>

          {/* Current edition + fullscreen */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground arabic" dir="rtl">{selectedEdition.nameAr}</p>
              <p className="text-xs text-muted-foreground">{selectedEdition.nameEn}</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => setFullscreen(v => !v)}
              className="text-muted-foreground hover:text-foreground">
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>

          {/* Iframe viewer */}
          <motion.div key={selectedEdition.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={cn('relative rounded-xl border border-border/60 overflow-hidden bg-card',
              fullscreen ? 'fixed inset-0 z-[60] rounded-none border-none' : 'aspect-[2/1]')}>
            {fullscreen && (
              <div className="absolute top-3 right-3 z-10">
                <Button variant="ghost" size="icon" onClick={() => setFullscreen(false)}
                  className="bg-card/90 backdrop-blur-sm text-foreground hover:bg-card shadow-md">
                  <Minimize2 className="w-5 h-5" />
                </Button>
              </div>
            )}
            <iframe src={selectedEdition.url} className="absolute inset-0 w-full h-full border-0"
              allowFullScreen title={selectedEdition.nameEn} />
          </motion.div>

          <p className="text-[10px] text-muted-foreground/50 text-center mt-4">{t.editions_source}</p>
        </div>
      )}
    </PageTransition>
  )
}
