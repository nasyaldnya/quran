import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'

interface SearchResult {
  number: number
  text: string
  surah: { number: number; englishName: string; name: string }
  numberInSurah: number
}

export default function SearchPage() {
  const t = useT()
  const { openSurah } = useUiStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async () => {
    if (!query.trim() || query.trim().length < 2) return
    setLoading(true)
    setSearched(true)
    try {
      const isArabic = /[\u0600-\u06FF]/.test(query)

      if (isArabic) {
        // Strip tashkeel (diacritics) so both تَكْفُرُونَ and تكفرون work
        const stripped = query.trim().replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')

        // Try quran-simple first (no diacritics — best for matching)
        let res = await fetch(
          `https://api.alquran.cloud/v1/search/${encodeURIComponent(stripped)}/all/quran-simple`
        )
        let data = await res.json()
        let matches = data.data?.matches ?? []

        // Fallback: try quran-uthmani with the original query (in case user typed exact tashkeel)
        if (matches.length === 0) {
          res = await fetch(
            `https://api.alquran.cloud/v1/search/${encodeURIComponent(query.trim())}/all/quran-uthmani`
          )
          data = await res.json()
          matches = data.data?.matches ?? []
        }

        // Fallback: try quran-simple-clean
        if (matches.length === 0) {
          res = await fetch(
            `https://api.alquran.cloud/v1/search/${encodeURIComponent(stripped)}/all/quran-simple-clean`
          )
          data = await res.json()
          matches = data.data?.matches ?? []
        }

        setResults(matches.slice(0, 50))
      } else {
        // English search
        const res = await fetch(
          `https://api.alquran.cloud/v1/search/${encodeURIComponent(query.trim())}/all/en.sahih`
        )
        const data = await res.json()
        setResults(data.data?.matches?.slice(0, 50) ?? [])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query])

  return (
    <PageTransition>
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block" opacity={0.05} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">{t.search_quran}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">{t.search_title}</h1>
            <p className="text-muted-foreground max-w-lg mb-6">{t.search_subtitle}</p>

            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                placeholder={t.search_placeholder}
                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                dir="auto"
              />
              <Button onClick={doSearch} disabled={loading || !query.trim()} className="px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-semibold text-foreground mb-1">{t.search_no_results}</p>
            <p className="text-sm text-muted-foreground">{t.search_try_again}</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground mb-4">{results.length} {t.search_results_found}</p>
            <div className="space-y-2">
              {results.map((r, i) => (
                <motion.div key={`${r.surah.number}-${r.numberInSurah}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}>
                  <button
                    onClick={() => openSurah(r.surah.number)}
                    className="w-full text-left group flex items-start gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-accent transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-arabic text-lg text-foreground leading-relaxed text-right mb-1" dir="rtl">
                        {r.text.length > 150 ? r.text.slice(0, 150) + '…' : r.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-primary">{r.surah.englishName}</span> · {r.surah.number}:{r.numberInSurah}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  )
}
