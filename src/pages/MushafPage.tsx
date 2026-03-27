import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'

interface PageAyah {
  number: number
  text: string
  numberInSurah: number
  surah: { number: number; name: string; englishName: string }
  page: number
}

const TOTAL_PAGES = 604

export default function MushafPage() {
  const t = useT()
  const { arabicFontSize } = useUiStore()
  const [page, setPage] = useState(1)
  const [ayahs, setAyahs] = useState<PageAyah[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`)
      .then(r => r.json())
      .then(data => setAyahs(data.data?.ayahs ?? []))
      .catch(() => setAyahs([]))
      .finally(() => setLoading(false))
  }, [page])

  const prevPage = () => setPage(p => Math.max(1, p - 1))
  const nextPage = () => setPage(p => Math.min(TOTAL_PAGES, p + 1))

  // Group ayahs by surah for section headers
  const surahGroups: { surahName: string; surahNameEn: string; surahNum: number; ayahs: PageAyah[] }[] = []
  let lastSurah = -1
  for (const a of ayahs) {
    if (a.surah.number !== lastSurah) {
      surahGroups.push({ surahName: a.surah.name, surahNameEn: a.surah.englishName, surahNum: a.surah.number, ayahs: [] })
      lastSurah = a.surah.number
    }
    surahGroups[surahGroups.length - 1].ayahs.push(a)
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page navigation header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={nextPage} disabled={page >= TOTAL_PAGES}
            className="text-foreground/70 hover:text-foreground">
            <ChevronRight className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{t.mushaf_page}</p>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number" min={1} max={TOTAL_PAGES} value={page}
                onChange={e => { const v = Number(e.target.value); if (v >= 1 && v <= TOTAL_PAGES) setPage(v) }}
                className="w-16 text-center px-2 py-1 rounded-lg bg-background border border-border/80 text-foreground text-lg font-bold tabular-nums"
              />
              <span className="text-sm text-muted-foreground">/ {TOTAL_PAGES}</span>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={prevPage} disabled={page <= 1}
            className="text-foreground/70 hover:text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Mushaf page content */}
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 min-h-[60vh]"
        >
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div dir="rtl" lang="ar">
              {surahGroups.map(group => (
                <div key={group.surahNum} className="mb-6">
                  {/* Surah header — only show if first ayah is 1 (surah begins on this page) */}
                  {group.ayahs[0].numberInSurah === 1 && (
                    <div className="text-center py-4 mb-4 border-y border-border/30">
                      <p className="font-arabic text-2xl text-primary">{group.surahName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{group.surahNameEn}</p>
                      {/* Bismillah — skip for At-Tawbah (9) and Al-Fatihah (1 — embedded) */}
                      {group.surahNum !== 9 && group.surahNum !== 1 && (
                        <p className="font-arabic text-lg text-muted-foreground mt-2">
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </p>
                      )}
                    </div>
                  )}

                  {/* Continuous text flow like a real mushaf */}
                  <p className="font-arabic leading-[2.4] text-foreground text-justify"
                    style={{ fontSize: `${arabicFontSize * 1.1}rem` }}>
                    {group.ayahs.map(a => (
                      <span key={a.number}>
                        {a.text}
                        <span className="inline-flex items-center justify-center mx-1 text-primary text-[0.6em] font-sans">
                          ﴿{a.numberInSurah.toLocaleString('ar-EG')}﴾
                        </span>
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Bottom page nav */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button variant="outline" size="sm" onClick={nextPage} disabled={page >= TOTAL_PAGES}>
            {t.mushaf_next_page} <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">{page} / {TOTAL_PAGES}</span>
          <Button variant="outline" size="sm" onClick={prevPage} disabled={page <= 1}>
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {t.mushaf_prev_page}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
