import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useBookmarkStore, type AyahBookmark } from '@/store/bookmarkStore'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'

export default function BookmarksPage() {
  const t = useT()
  const { bookmarks, removeBookmark, clearAll } = useBookmarkStore()
  const { openSurah } = useUiStore()

  const sorted = useMemo(
    () => [...bookmarks].sort((a, b) => b.createdAt - a.createdAt),
    [bookmarks]
  )

  return (
    <PageTransition>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-hero-gradient opacity-50" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] text-primary" opacity={0.03} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
              <Bookmark className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">{t.bookmarks_title}</h1>
            <p className="text-muted-foreground text-sm">
              {bookmarks.length === 0 ? t.bookmarks_empty : `${bookmarks.length} ${t.bookmarks_saved}`}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {bookmarks.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-destructive text-xs">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />{t.clear_all}
            </Button>
          </div>
        )}

        {bookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">{t.bookmarks_empty}</p>
            <p className="text-sm text-muted-foreground mb-6">{t.bookmarks_empty_desc}</p>
          </div>
        )}

        <div className="space-y-2">
          {sorted.map((bm, i) => (
            <motion.div key={`${bm.surahNumber}-${bm.ayahNumber}`}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.3 }}>
              <div className="group flex items-start gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-accent transition-all duration-200">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold tabular-nums text-primary">{bm.ayahNumber}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-arabic text-lg text-foreground leading-relaxed text-right mb-1.5" dir="rtl">
                    {bm.arabicText.length > 100 ? bm.arabicText.slice(0, 100) + '…' : bm.arabicText}
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openSurah(bm.surahNumber)}
                      className="text-xs text-primary hover:underline">
                      {bm.surahNameEn} {bm.surahNumber}:{bm.ayahNumber}
                    </button>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-xs text-muted-foreground/60">
                      {new Date(bm.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => removeBookmark(bm.surahNumber, bm.ayahNumber)}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0" aria-label={t.remove_bookmark}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
