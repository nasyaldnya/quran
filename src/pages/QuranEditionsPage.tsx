import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// ── All Quran editions data ──────────────────────────

type Category = 'hafs' | 'qiraat' | 'translations'

interface QuranEdition {
  id: string
  nameAr: string
  nameEn: string
  category: Category
  url: string
}

const EDITIONS: QuranEdition[] = [
  // ── إصدارات مصحف حفص ──
  { id: 'hafs-mumtaz', nameAr: 'المصحف الممتاز', nameEn: 'Al-Mushaf Al-Mumtaz', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11311/1/' },
  { id: 'hafs-khas1', nameAr: 'المصحف الخاص ١', nameEn: 'Special Mushaf 1', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11309/1/' },
  { id: 'hafs-jawami', nameAr: 'المصحف الجوامعي', nameEn: 'Al-Jawami Mushaf', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11305/1/' },
  { id: 'hafs-jawami3', nameAr: 'المصحف الجوامعي – ٣', nameEn: 'Al-Jawami Mushaf 3', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11552/1/' },
  { id: 'hafs-normal', nameAr: 'المصحف العادي', nameEn: 'Standard Mushaf', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11301/1/' },
  { id: 'hafs-normal3', nameAr: 'المصحف العادي – ٣', nameEn: 'Standard Mushaf 3', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11299/1/' },
  { id: 'hafs-wasat', nameAr: 'المصحف الوسط', nameEn: 'Medium Mushaf', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11297/1/' },
  { id: 'hafs-pocket', nameAr: 'مصحف الجيب', nameEn: 'Pocket Mushaf', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11295/1/' },
  { id: 'hafs-kafi', nameAr: 'المصحف الكفي', nameEn: 'Palm Mushaf', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11293/1/' },
  { id: 'hafs-indopak', nameAr: 'مصحف نسخ إندوباك', nameEn: 'IndoPak Mushaf', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11291/1/' },
  { id: 'hafs-yasin', nameAr: 'ربع يس', nameEn: 'Quarter Yasin', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11289/1/' },
  { id: 'hafs-qadsami', nameAr: 'جزء قد سمع', nameEn: 'Juz Qad Sami', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11286/1/' },
  { id: 'hafs-tabarak', nameAr: 'جزء تبارك', nameEn: 'Juz Tabarak', category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11284/1/' },
  { id: 'hafs-amma', nameAr: 'الفاتحة وجزء عم', nameEn: "Al-Fatihah & Juz 'Amma", category: 'hafs', url: 'https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11282/1/' },

  // ── مصاحف الروايات الأخرى ──
  { id: 'qiraat-warsh', nameAr: 'مصحف ورش', nameEn: 'Warsh Mushaf', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11326/1/' },
  { id: 'qiraat-duri', nameAr: 'مصحف الدوري', nameEn: 'Ad-Duri Mushaf', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11324/1/' },
  { id: 'qiraat-qalun', nameAr: 'مصحف قالون', nameEn: 'Qalun Mushaf', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11322/1/' },
  { id: 'qiraat-shubah', nameAr: 'مصحف شعبة', nameEn: "Shu'bah Mushaf", category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11319/1/' },
  { id: 'qiraat-susi', nameAr: 'مصحف السوسي', nameEn: 'As-Susi Mushaf', category: 'qiraat', url: 'https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11317/1/' },

  // ── ترجمات معاني القرآن الكريم ──
  { id: 'tr-azerbaijani', nameAr: 'الأذرية', nameEn: 'Azerbaijani', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11469/1/' },
  { id: 'tr-urdu', nameAr: 'الأردية', nameEn: 'Urdu', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11467/1/' },
  { id: 'tr-indonesian', nameAr: 'الإندونيسية', nameEn: 'Indonesian', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11465/1/' },
  { id: 'tr-avar1', nameAr: 'الأوارية – المجلد الأول', nameEn: 'Avar Vol. 1', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11463/1/' },
  { id: 'tr-avar2', nameAr: 'الأوارية – المجلد الثاني', nameEn: 'Avar Vol. 2', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11461/1/' },
  { id: 'tr-pashto1', nameAr: 'البشتو – المجلد الأول', nameEn: 'Pashto Vol. 1', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11458/1/' },
  { id: 'tr-pashto2', nameAr: 'البشتو – المجلد الثاني', nameEn: 'Pashto Vol. 2', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11456/1/' },
  { id: 'tr-bengali1', nameAr: 'البنغالية – المجلد الأول', nameEn: 'Bengali Vol. 1', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11451/1/' },
  { id: 'tr-bengali2', nameAr: 'البنغالية – المجلد الثاني', nameEn: 'Bengali Vol. 2', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11448/1/' },
  { id: 'tr-turkish', nameAr: 'التركية', nameEn: 'Turkish', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11444/1/' },
  { id: 'tr-tagalog', nameAr: 'الفلبينية (التغالوغ)', nameEn: 'Tagalog', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11442/1/' },
  { id: 'tr-telugu', nameAr: 'التلغو', nameEn: 'Telugu', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11440/1/' },
  { id: 'tr-chinese', nameAr: 'الصينية', nameEn: 'Chinese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11438/1/' },
  { id: 'tr-tajik', nameAr: 'الطاجيكية', nameEn: 'Tajik', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11436/1/' },
  { id: 'tr-persian', nameAr: 'الفارسية', nameEn: 'Persian', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11986/1/' },
  { id: 'tr-vietnamese', nameAr: 'الفيتنامية', nameEn: 'Vietnamese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11432/1/' },
  { id: 'tr-kyrgyz', nameAr: 'القيرغيزية', nameEn: 'Kyrgyz', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11429/1/' },
  { id: 'tr-kurdish-k', nameAr: 'الكردية (الكرمانجية)', nameEn: 'Kurdish (Kurmanji)', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11427/1/' },
  { id: 'tr-malay', nameAr: 'الملايوية', nameEn: 'Malay', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11425/1/' },
  { id: 'tr-malayalam', nameAr: 'المليبارية (المليالم)', nameEn: 'Malayalam', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11423/1/' },
  { id: 'tr-mandar', nameAr: 'المندرية', nameEn: 'Mandar', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11421/1/' },
  { id: 'tr-nepali', nameAr: 'النيبالية', nameEn: 'Nepali', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11419/1/' },
  { id: 'tr-hindi', nameAr: 'الهندية', nameEn: 'Hindi', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11417/1/' },
  { id: 'tr-japanese', nameAr: 'اليابانية', nameEn: 'Japanese', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11415/1/' },
  { id: 'tr-kannada', nameAr: 'الكنّاديّة', nameEn: 'Kannada', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11393/1/' },
  { id: 'tr-kurdish-s', nameAr: 'الكردية (السورانية)', nameEn: 'Kurdish (Sorani)', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11988/1/' },
  { id: 'tr-dari', nameAr: 'الدريّة', nameEn: 'Dari', category: 'translations', url: 'https://qurancomplex.gov.sa/isdarat-translations/#flipbook-df_11937/1/' },
]

const CATEGORIES: { id: Category; labelAr: string; labelEn: string }[] = [
  { id: 'hafs', labelAr: 'إصدارات مصحف حفص', labelEn: 'Hafs Editions' },
  { id: 'qiraat', labelAr: 'مصاحف الروايات الأخرى', labelEn: 'Other Recitations' },
  { id: 'translations', labelAr: 'ترجمات معاني القرآن', labelEn: 'Translations' },
]

export default function QuranEditionsPage() {
  const t = useT()
  const [activeCategory, setActiveCategory] = useState<Category>('hafs')
  const [selectedEdition, setSelectedEdition] = useState<QuranEdition>(EDITIONS[0])
  const [fullscreen, setFullscreen] = useState(false)

  const filteredEditions = useMemo(
    () => EDITIONS.filter((e) => e.category === activeCategory),
    [activeCategory]
  )

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat)
    const first = EDITIONS.find((e) => e.category === cat)
    if (first) setSelectedEdition(first)
  }

  return (
    <PageTransition>
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block" opacity={0.05} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">{t.editions_label}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              {t.editions_title}
              <span className="mr-3 text-xl font-normal text-muted-foreground arabic"> إصدارات المصحف</span>
            </h1>
            <p className="text-muted-foreground max-w-lg">{t.editions_subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                activeCategory === cat.id
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground'
              )}
            >
              <span className="hidden sm:inline">{cat.labelAr}</span>
              <span className="sm:hidden">{cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Edition selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-6">
          {filteredEditions.map((edition) => (
            <button
              key={edition.id}
              onClick={() => setSelectedEdition(edition)}
              className={cn(
                'px-3 py-2.5 rounded-xl text-right transition-all duration-200 border',
                selectedEdition.id === edition.id
                  ? 'bg-primary/10 text-primary border-primary/30 shadow-sm'
                  : 'bg-card text-foreground border-border/60 hover:border-primary/30'
              )}
            >
              <p className="text-xs font-semibold truncate arabic">{edition.nameAr}</p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{edition.nameEn}</p>
            </button>
          ))}
        </div>

        {/* Current edition title + fullscreen toggle */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground arabic" dir="rtl">{selectedEdition.nameAr}</p>
            <p className="text-xs text-muted-foreground">{selectedEdition.nameEn}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setFullscreen((v) => !v)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Embedded Quran viewer */}
        <motion.div
          key={selectedEdition.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'relative rounded-xl border border-border/60 overflow-hidden bg-card',
            fullscreen
              ? 'fixed inset-0 z-[60] rounded-none border-none'
              : 'aspect-[2/1]'
          )}
        >
          {fullscreen && (
            <div className="absolute top-3 right-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFullscreen(false)}
                className="bg-card/90 backdrop-blur-sm text-foreground hover:bg-card shadow-md"
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
            </div>
          )}
          <iframe
            src={selectedEdition.url}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            title={selectedEdition.nameEn}
          />
        </motion.div>

        {/* Source attribution */}
        <p className="text-[10px] text-muted-foreground/50 text-center mt-4">
          {t.editions_source}
        </p>
      </div>
    </PageTransition>
  )
}
