import { useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronLeft, ChevronRight, Search,
  Maximize2, Minimize2, Layers, Palette, Moon, Sun,
  List, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'
import { parseTajweed } from '@/lib/tajweedParser'
import { getSurahList, JUZ_PAGES, HIZB_PAGES, SURAH_PAGES } from '@/lib/mushafNav'
import { cn } from '@/lib/utils'

// ── Types ──
interface PageAyah {
  number: number; text: string; numberInSurah: number; juz: number; hizbQuarter: number
  surah: { number: number; name: string; englishName: string }; page: number
}
type ViewMode = 'mushaf' | 'editions'
type Category = 'hafs' | 'qiraat' | 'translations'
type NavTab = 'surahs' | 'juz' | 'hizb'

interface QuranEdition { id: string; nameAr: string; nameEn: string; category: Category; url: string }

// ── Constants ──
const TOTAL_PAGES = 604
const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
const SURAH_LIST = getSurahList()

const EDITIONS: QuranEdition[] = [
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
  { id: 'qiraat-warsh', nameAr: 'مصحف ورش', nameEn: 'Warsh', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11326/1/' },
  { id: 'qiraat-duri', nameAr: 'مصحف الدوري', nameEn: 'Ad-Duri', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11324/1/' },
  { id: 'qiraat-qalun', nameAr: 'مصحف قالون', nameEn: 'Qalun', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11322/1/' },
  { id: 'qiraat-shubah', nameAr: 'مصحف شعبة', nameEn: "Shu'bah", category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11319/1/' },
  { id: 'qiraat-susi', nameAr: 'مصحف السوسي', nameEn: 'As-Susi', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11317/1/' },
  { id: 'tr-azerbaijani', nameAr: 'الأذرية', nameEn: 'Azerbaijani', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11469/1/' },
  { id: 'tr-urdu', nameAr: 'الأردية', nameEn: 'Urdu', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11467/1/' },
  { id: 'tr-indonesian', nameAr: 'الإندونيسية', nameEn: 'Indonesian', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11465/1/' },
  { id: 'tr-turkish', nameAr: 'التركية', nameEn: 'Turkish', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11444/1/' },
  { id: 'tr-chinese', nameAr: 'الصينية', nameEn: 'Chinese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11438/1/' },
  { id: 'tr-persian', nameAr: 'الفارسية', nameEn: 'Persian', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11986/1/' },
  { id: 'tr-hindi', nameAr: 'الهندية', nameEn: 'Hindi', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11417/1/' },
  { id: 'tr-japanese', nameAr: 'اليابانية', nameEn: 'Japanese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11415/1/' },
  { id: 'tr-bengali1', nameAr: 'البنغالية ١', nameEn: 'Bengali Vol.1', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11451/1/' },
  { id: 'tr-bengali2', nameAr: 'البنغالية ٢', nameEn: 'Bengali Vol.2', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11448/1/' },
  { id: 'tr-malay', nameAr: 'الملايوية', nameEn: 'Malay', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11425/1/' },
  { id: 'tr-dari', nameAr: 'الدريّة', nameEn: 'Dari', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11937/1/' },
  { id: 'tr-pashto1', nameAr: 'البشتو ١', nameEn: 'Pashto Vol.1', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11458/1/' },
  { id: 'tr-pashto2', nameAr: 'البشتو ٢', nameEn: 'Pashto Vol.2', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11456/1/' },
  { id: 'tr-kyrgyz', nameAr: 'القيرغيزية', nameEn: 'Kyrgyz', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11429/1/' },
  { id: 'tr-kurdish-k', nameAr: 'الكردية الكرمانجية', nameEn: 'Kurdish', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11427/1/' },
  { id: 'tr-nepali', nameAr: 'النيبالية', nameEn: 'Nepali', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11419/1/' },
  { id: 'tr-vietnamese', nameAr: 'الفيتنامية', nameEn: 'Vietnamese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11432/1/' },
  { id: 'tr-tagalog', nameAr: 'التغالوغ', nameEn: 'Tagalog', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11442/1/' },
  { id: 'tr-malayalam', nameAr: 'المليالم', nameEn: 'Malayalam', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11423/1/' },
  { id: 'tr-kannada', nameAr: 'الكنّاديّة', nameEn: 'Kannada', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11393/1/' },
  { id: 'tr-tajik', nameAr: 'الطاجيكية', nameEn: 'Tajik', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11436/1/' },
  { id: 'tr-telugu', nameAr: 'التلغو', nameEn: 'Telugu', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11440/1/' },
]

const CATEGORIES: { id: Category; labelAr: string; labelEn: string }[] = [
  { id: 'hafs', labelAr: 'مصحف حفص', labelEn: 'Hafs' },
  { id: 'qiraat', labelAr: 'القراءات', labelEn: 'Qiraat' },
  { id: 'translations', labelAr: 'الترجمات', labelEn: 'Translations' },
]

function toArabicNum(n: number): string { return n.toLocaleString('ar-EG') }

function TajweedInline({ text }: { text: string }) {
  const parts = useMemo(() => parseTajweed(text), [text])
  return <>{parts.map((p, i) => p.color ? <span key={i} style={{ color: p.color }}>{p.text}</span> : <span key={i}>{p.text}</span>)}</>
}

// ══════════════════════════════════════════════════════
export default function MushafPage() {
  const t = useT()
  const { arabicFontSize } = useUiStore()

  const [viewMode, setViewMode] = useState<ViewMode>('mushaf')
  const [page, setPage] = useState(1)
  const [ayahs, setAyahs] = useState<PageAyah[]>([])
  const [tajweedTexts, setTajweedTexts] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [tajweedOn, setTajweedOn] = useState(false)
  const [nightMode, setNightMode] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [navTab, setNavTab] = useState<NavTab>('surahs')
  const [navSearch, setNavSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<{ surah: string; ayah: number; surahNum: number }[]>([])
  const [searchDone, setSearchDone] = useState(false)
  const [edCategory, setEdCategory] = useState<Category>('hafs')
  const [selectedEdition, setSelectedEdition] = useState<QuranEdition>(EDITIONS[0])
  const [fullscreen, setFullscreen] = useState(false)

  const filteredEditions = useMemo(() => EDITIONS.filter(e => e.category === edCategory), [edCategory])

  // Filter surahs in nav drawer
  const filteredSurahs = useMemo(() => {
    if (!navSearch.trim()) return SURAH_LIST
    const q = navSearch.toLowerCase()
    return SURAH_LIST.filter(s => s.nameEn.toLowerCase().includes(q) || s.nameAr.includes(q) || String(s.number) === q)
  }, [navSearch])

  // Fetch page
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
          const map: Record<number, string> = {}
          for (const a of fetched) map[a.number] = a.text
          setTajweedTexts(map)
        }
      })
      .catch(() => setAyahs([]))
      .finally(() => setLoading(false))
  }, [page, viewMode, tajweedOn])

  // Search
  const doSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return
    setSearchLoading(true); setSearchDone(true)
    try {
      const isArabic = /[\u0600-\u06FF]/.test(searchQuery)
      const stripped = searchQuery.trim().replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
      const edition = isArabic ? 'quran-simple' : 'en.sahih'
      const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(isArabic ? stripped : searchQuery.trim())}/all/${edition}`)
      const data = await res.json()
      setSearchResults((data.data?.matches ?? []).slice(0, 30).map((m: any) => ({
        surah: m.surah?.englishName ?? '', ayah: m.numberInSurah ?? 1, surahNum: m.surah?.number ?? 1,
      })))
    } catch { setSearchResults([]) }
    finally { setSearchLoading(false) }
  }, [searchQuery])

  const goToSurah = (surahNum: number) => { setPage(SURAH_PAGES[surahNum] ?? 1); setNavOpen(false) }
  const goToJuz = (juzNum: number) => { setPage(JUZ_PAGES[juzNum - 1] ?? 1); setNavOpen(false) }
  const goToHizb = (hizbNum: number) => { setPage(HIZB_PAGES[hizbNum - 1] ?? 1); setNavOpen(false) }

  const surahGroups = useMemo(() => {
    const groups: { surahName: string; surahNameEn: string; surahNum: number; ayahs: PageAyah[] }[] = []
    let last = -1
    for (const a of ayahs) {
      if (a.surah.number !== last) { groups.push({ surahName: a.surah.name, surahNameEn: a.surah.englishName, surahNum: a.surah.number, ayahs: [] }); last = a.surah.number }
      groups[groups.length - 1].ayahs.push(a)
    }
    return groups
  }, [ayahs])

  const juzOnPage = ayahs.length > 0 ? ayahs[0].juz : null
  const prevPage = () => setPage(p => Math.max(1, p - 1))
  const nextPage = () => setPage(p => Math.min(TOTAL_PAGES, p + 1))

  const renderAyahText = (a: PageAyah): ReactNode => {
    if (tajweedOn && tajweedTexts[a.number]) return <TajweedInline text={tajweedTexts[a.number]} />
    return <>{a.text}</>
  }

  // Night mode classes
  const nightBg = nightMode ? 'bg-[#1a1408] text-[#e8dcc8]' : 'bg-card text-foreground'
  const nightBorder = nightMode ? 'border-[#3d2e12]/40' : 'border-border/60'
  const nightMuted = nightMode ? 'text-[#b8a880]' : 'text-muted-foreground'
  const nightPrimary = nightMode ? 'text-[#c4a44a]' : 'text-primary'

  return (
    <PageTransition>
      {/* Header */}
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
            <div className="flex gap-2 mt-4">
              <button onClick={() => setViewMode('mushaf')}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                  viewMode === 'mushaf' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card text-muted-foreground border-border/60 hover:text-foreground')}>
                <BookOpen className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t.mushaf_reader}
              </button>
              <button onClick={() => setViewMode('editions')}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                  viewMode === 'editions' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-card text-muted-foreground border-border/60 hover:text-foreground')}>
                <Layers className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t.editions_label}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════ MUSHAF READER ══════════ */}
      {viewMode === 'mushaf' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 mb-6">
            {/* Search */}
            <div className="flex gap-2">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder={t.search_placeholder}
                className="flex-1 px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" dir="auto" />
              <Button onClick={doSearch} disabled={searchLoading || !searchQuery.trim()} size="sm">
                {searchLoading ? <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              </Button>
            </div>
            {searchDone && searchResults.length > 0 && (
              <div className="max-h-32 overflow-y-auto rounded-xl border border-border/60 bg-card p-2 space-y-0.5">
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => { goToSurah(r.surahNum); setSearchResults([]); setSearchDone(false) }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-accent transition-colors">
                    <span className="text-foreground">{r.surah}</span> <span className="text-muted-foreground">: {r.ayah}</span>
                  </button>
                ))}
              </div>
            )}
            {searchDone && !searchLoading && searchResults.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-1">{t.search_no_results}</p>
            )}

            {/* Controls: Nav + Tajweed + Night + Page */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                {/* Navigation drawer toggle */}
                <button onClick={() => setNavOpen(v => !v)}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border',
                    navOpen ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground border-border/60 hover:text-foreground')}>
                  <List className="w-3.5 h-3.5" />{t.mushaf_index}
                </button>
                {/* Tajweed */}
                <button onClick={() => setTajweedOn(v => !v)}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border',
                    tajweedOn ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground border-border/60 hover:text-foreground')}>
                  <Palette className="w-3.5 h-3.5" />{t.tajweed}
                </button>
                {/* Night mode */}
                <button onClick={() => setNightMode(v => !v)}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border',
                    nightMode ? 'bg-amber-900/20 text-amber-400 border-amber-700/30' : 'text-muted-foreground border-border/60 hover:text-foreground')}>
                  {nightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {t.mushaf_night}
                </button>
              </div>
              {/* Page navigation */}
              <div className="flex items-center gap-2" dir="ltr">
                <Button variant="ghost" size="icon-sm" onClick={prevPage} disabled={page <= 1}><ChevronLeft className="w-4 h-4" /></Button>
                <input type="number" min={1} max={TOTAL_PAGES} value={page}
                  onChange={e => { const v = Number(e.target.value); if (v >= 1 && v <= TOTAL_PAGES) setPage(v) }}
                  className="w-14 text-center px-1 py-1 rounded-lg bg-background border border-border/80 text-foreground text-sm font-bold tabular-nums" />
                <span className="text-xs text-muted-foreground">/ {TOTAL_PAGES}</span>
                <Button variant="ghost" size="icon-sm" onClick={nextPage} disabled={page >= TOTAL_PAGES}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>

          {/* ── Navigation Drawer ── */}
          <AnimatePresence>
            {navOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                className="overflow-hidden mb-6">
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
                  {/* Nav tabs */}
                  <div className="flex border-b border-border/40">
                    {(['surahs', 'juz', 'hizb'] as NavTab[]).map(tab => (
                      <button key={tab} onClick={() => setNavTab(tab)}
                        className={cn('flex-1 px-3 py-2.5 text-xs font-semibold transition-colors',
                          navTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground')}>
                        {tab === 'surahs' ? t.nav_surahs : tab === 'juz' ? t.nav_juz : t.mushaf_hizb}
                      </button>
                    ))}
                  </div>

                  {/* Surah search (only in surahs tab) */}
                  {navTab === 'surahs' && (
                    <div className="px-3 pt-3">
                      <input type="text" value={navSearch} onChange={e => setNavSearch(e.target.value)}
                        placeholder={t.search_placeholder} dir="auto"
                        className="w-full px-3 py-1.5 rounded-lg bg-background border border-border/80 text-foreground placeholder:text-muted-foreground/50 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="max-h-64 overflow-y-auto p-2">
                    {navTab === 'surahs' && filteredSurahs.map(s => (
                      <button key={s.number} onClick={() => goToSurah(s.number)}
                        className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-accent',
                          SURAH_PAGES[s.number] === page && 'bg-primary/10')}>
                        <span className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold tabular-nums text-primary">{s.number}</span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{s.nameEn}</p>
                          <p className="text-[10px] text-muted-foreground">{s.verses} {t.ayahs} · {t.mushaf_page} {s.page}</p>
                        </div>
                        <span className="text-xs font-arabic text-muted-foreground">{s.nameAr}</span>
                      </button>
                    ))}

                    {navTab === 'juz' && Array.from({ length: 30 }, (_, i) => i + 1).map(juz => (
                      <button key={juz} onClick={() => goToJuz(juz)}
                        className={cn('w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors hover:bg-accent',
                          JUZ_PAGES[juz - 1] === page && 'bg-primary/10')}>
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold tabular-nums text-primary">{juz}</span>
                          </span>
                          <span className="text-sm font-semibold text-foreground">{t.juz_label} {juz}</span>
                        </div>
                        <span className="text-xs text-muted-foreground arabic">الجزء {toArabicNum(juz)}</span>
                      </button>
                    ))}

                    {navTab === 'hizb' && Array.from({ length: 60 }, (_, i) => i + 1).map(hizb => (
                      <button key={hizb} onClick={() => goToHizb(hizb)}
                        className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-accent',
                          HIZB_PAGES[hizb - 1] === page && 'bg-primary/10')}>
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold tabular-nums text-primary">{hizb}</span>
                          </span>
                          <span className="text-xs font-semibold text-foreground">{t.mushaf_hizb} {hizb}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{t.mushaf_page} {HIZB_PAGES[hizb - 1]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Mushaf Page Content ── */}
          <motion.div key={`${page}-${tajweedOn}-${nightMode}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={cn('rounded-2xl border p-5 sm:p-8 min-h-[60vh] transition-colors duration-300', nightBg, nightBorder)}>

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className={cn('w-6 h-6 border-2 rounded-full animate-spin', nightMode ? 'border-amber-900/30 border-t-amber-400' : 'border-primary/30 border-t-primary')} />
              </div>
            ) : (
              <div dir="rtl" lang="ar">
                {juzOnPage && ayahs.length > 0 && ayahs[0].numberInSurah === 1 && (
                  <div className="text-center mb-3">
                    <span className={cn('inline-block px-4 py-1 rounded-full border text-xs font-semibold',
                      nightMode ? 'bg-amber-900/20 border-amber-800/30 text-amber-400' : 'bg-primary/10 border-primary/20 text-primary')}>
                      الجزء {toArabicNum(juzOnPage)}
                    </span>
                  </div>
                )}

                {surahGroups.map(group => (
                  <div key={`${group.surahNum}-${page}`} className="mb-4">
                    {group.ayahs[0].numberInSurah === 1 && (
                      <div className={cn('text-center py-4 mb-4 border-y rounded-xl mx-[-0.5rem] px-2',
                        nightMode ? 'border-[#3d2e12]/30 bg-[#1e1508]' : 'border-primary/15 bg-primary/[0.03]')}>
                        <p className={cn('font-arabic text-2xl sm:text-3xl leading-relaxed', nightPrimary)}>
                          ❁ {group.surahName} ❁
                        </p>
                        <p className={cn('text-[11px] mt-1', nightMuted)}>
                          {group.surahNameEn} · {toArabicNum(group.ayahs[group.ayahs.length - 1].numberInSurah)} {t.ayahs}
                        </p>
                        {group.surahNum !== 9 && group.surahNum !== 1 && (
                          <p className={cn('font-arabic text-lg mt-3', nightMuted)}>{BISMILLAH}</p>
                        )}
                      </div>
                    )}

                    <p className={cn('font-arabic leading-[2.4] text-justify', nightMode ? 'text-[#e8dcc8]' : 'text-foreground')}
                      style={{ fontSize: `${arabicFontSize * 1.1}rem` }}>
                      {group.ayahs.map(a => (
                        <span key={a.number}>
                          {renderAyahText(a)}
                          <span className={cn('inline-flex items-center justify-center mx-0.5 font-arabic', nightPrimary)}
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

      {/* ══════════ EDITIONS ══════════ */}
      {viewMode === 'editions' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground arabic" dir="rtl">{selectedEdition.nameAr}</p>
              <p className="text-xs text-muted-foreground">{selectedEdition.nameEn}</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => setFullscreen(v => !v)} className="text-muted-foreground hover:text-foreground">
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
          <motion.div key={selectedEdition.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={cn('relative rounded-xl border border-border/60 overflow-hidden bg-card',
              fullscreen ? 'fixed inset-0 z-[60] rounded-none border-none' : 'aspect-[2/1]')}>
            {fullscreen && (
              <div className="absolute top-3 right-3 z-10">
                <Button variant="ghost" size="icon" onClick={() => setFullscreen(false)}
                  className="bg-card/90 backdrop-blur-sm text-foreground hover:bg-card shadow-md"><Minimize2 className="w-5 h-5" /></Button>
              </div>
            )}
            <iframe src={selectedEdition.url} className="absolute inset-0 w-full h-full border-0" allowFullScreen title={selectedEdition.nameEn} />
          </motion.div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-4">{t.editions_source}</p>
        </div>
      )}
    </PageTransition>
  )
}
