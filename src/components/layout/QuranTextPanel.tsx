import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Loader2, AlertCircle, Type, Palette, EyeOff } from 'lucide-react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import AyahRow from '@/components/quran/AyahRow'
import LanguageSelector from '@/components/quran/LanguageSelector'
import FontSizeControl from '@/components/quran/FontSizeControl'
import WordByWord from '@/components/quran/WordByWord'
import TajweedText from '@/components/quran/TajweedText'
import MemorizationMode from '@/components/quran/MemorizationMode'
import RepeatControl, { type RepeatConfig } from '@/components/quran/RepeatControl'
import { useQuranArabic, useQuranTranslation, useQuranTafsir } from '@/hooks/useQuranText'
import { useAudioStore } from '@/store/audioStore'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'
import {
  TRANSLATION_EDITIONS,
  TAFSIR_EDITIONS,
} from '@/types/quranText'
import { cn } from '@/lib/utils'

// ── Bismillah (displayed before ayahs, except for Surah 1 & 9) ──
const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ'

export default function QuranTextPanel() {
  const t = useT()
  const {
    isTextPanelOpen, setTextPanelOpen,
    viewingSurahNumber,
    selectedTranslation, selectedTafsir, setExpandedAyah,
  } = useUiStore()
  const { currentTrack } = useAudioStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reading mode toggles
  const [showWordByWord, setShowWordByWord] = useState(false)
  const [showTajweed, setShowTajweed] = useState(false)
  const [showMemorization, setShowMemorization] = useState(false)
  const [repeatConfig, setRepeatConfig] = useState<RepeatConfig | null>(null)

  // viewingSurahNumber takes priority (user clicked a card)
  // falls back to currently playing track
  const surahNumber = viewingSurahNumber ?? currentTrack?.surahNumber

  // ── Data fetching ──
  const {
    data: arabicData,
    isLoading: isArabicLoading,
    error: arabicError,
  } = useQuranArabic(isTextPanelOpen ? surahNumber : undefined)

  const {
    data: translationData,
    isLoading: isTranslationLoading,
  } = useQuranTranslation(
    isTextPanelOpen ? surahNumber : undefined,
    selectedTranslation
  )

  const {
    data: tafsirData,
    isLoading: isTafsirLoading,
  } = useQuranTafsir(
    isTextPanelOpen ? surahNumber : undefined,
    selectedTafsir
  )

  // Reset scroll & collapse tafsir when surah changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
    setExpandedAyah(null)
  }, [surahNumber, setExpandedAyah])

  // Resolve translation/tafsir directions
  const translationEdition = TRANSLATION_EDITIONS.find(
    (e) => e.id === selectedTranslation
  )
  const tafsirEdition = TAFSIR_EDITIONS.find((e) => e.id === selectedTafsir)

  // Show bismillah for all surahs except Al-Fatiha (1) and At-Tawbah (9)
  const showBismillah =
    surahNumber !== undefined && surahNumber !== 1 && surahNumber !== 9

  const isLoading = isArabicLoading
  const hasError = !!arabicError

  return (
    <AnimatePresence>
      {isTextPanelOpen && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setTextPanelOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className={cn(
              'fixed right-0 z-40 flex flex-col',
              'top-[72px] h-[calc(100vh-72px-5rem)]',
              'w-full sm:w-[420px] lg:w-[480px]',
              'bg-background border-l border-border/60 shadow-2xl'
            )}
          >
            {/* ── Header ── */}
            <div className="flex-shrink-0 border-b border-border/40 px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    {arabicData ? (
                      <>
                        <h2 className="text-sm font-semibold text-foreground leading-tight">
                          {arabicData.englishName}
                        </h2>
                        <p className="text-[11px] text-muted-foreground">
                          {arabicData.englishNameTranslation} · {arabicData.numberOfAyahs} {t.ayahs}
                        </p>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-4 w-28 rounded mb-1" />
                        <Skeleton className="h-3 w-20 rounded" />
                      </>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setTextPanelOpen(false)}
                  aria-label="Close panel"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Language, Tafsir & Font size controls */}
              <div className="flex items-center justify-between gap-2">
                <LanguageSelector />
                <FontSizeControl />
              </div>

              {/* Reading mode toolbar */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <button onClick={() => setShowWordByWord(v => !v)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all border ${
                    showWordByWord ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-border/60 hover:text-foreground'
                  }`}>
                  <Type className="w-3 h-3" />
                  {t.word_by_word}
                </button>
                <button onClick={() => setShowTajweed(v => !v)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all border ${
                    showTajweed ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-border/60 hover:text-foreground'
                  }`}>
                  <Palette className="w-3 h-3" />
                  {t.tajweed}
                </button>
                <button onClick={() => setShowMemorization(v => !v)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all border ${
                    showMemorization ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-border/60 hover:text-foreground'
                  }`}>
                  <EyeOff className="w-3 h-3" />
                  {t.memorization}
                </button>
                {arabicData && (
                  <RepeatControl
                    totalAyahs={arabicData.numberOfAyahs}
                    onRepeatChange={setRepeatConfig}
                    currentConfig={repeatConfig}
                  />
                )}
              </div>
            </div>

            {/* ── Surah name in Arabic ── */}
            {arabicData && (
              <div className="flex-shrink-0 py-4 text-center border-b border-border/20">
                <p className="font-arabic text-3xl text-primary leading-loose">
                  {arabicData.name}
                </p>
                {showBismillah && (
                  <p className="font-arabic text-lg text-muted-foreground mt-2">
                    {BISMILLAH}
                  </p>
                )}
              </div>
            )}

            {/* ── Content ── */}
            <ScrollArea.Root className="flex-1 overflow-hidden">
              <ScrollArea.Viewport ref={scrollRef} className="h-full w-full px-3 py-4">
                {/* No track playing */}
                {!surahNumber && (
                  <EmptyState
                    icon={BookOpen}
                    title={t.no_surah_playing}
                    description={t.no_surah_playing_desc}
                  />
                )}

                {/* Loading */}
                {surahNumber && isLoading && <AyahSkeletons />}

                {/* Error */}
                {surahNumber && hasError && (
                  <EmptyState
                    icon={AlertCircle}
                    title={t.failed_to_load}
                    description={t.failed_to_load_desc}
                  />
                )}

                {/* Ayahs */}
                {arabicData && !isLoading && (
                  <div className="space-y-1">
                    {/* Translation/Tafsir loading indicator */}
                    {(isTranslationLoading || isTafsirLoading) && (
                      <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {isTranslationLoading ? t.loading_translation : ''}{isTafsirLoading ? ` ${t.loading_tafsir}` : ''}…
                      </div>
                    )}

                    {/* Memorization mode replaces normal view */}
                    {showMemorization && arabicData ? (
                      <MemorizationMode ayahs={arabicData.ayahs} visible={showMemorization} />
                    ) : (
                      arabicData.ayahs.map((ayah) => {
                        const translationAyah = translationData?.ayahs.find(
                          (a) => a.numberInSurah === ayah.numberInSurah
                        )
                        const tafsirAyah = tafsirData?.ayahs.find(
                          (a) => a.numberInSurah === ayah.numberInSurah
                        )

                        return (
                          <div key={ayah.numberInSurah}>
                            {showTajweed ? (
                              // Tajweed ON → show colored text instead of normal AyahRow Arabic
                              <div className={cn(
                                'group rounded-xl border transition-all duration-200 px-4 py-4',
                                'border-transparent hover:bg-accent/50'
                              )}>
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
                                    <span className="text-xs font-bold tabular-nums text-primary">{ayah.numberInSurah}</span>
                                  </div>
                                  <div className="flex-1 min-w-0 space-y-3">
                                    {/* Tajweed-colored Arabic text (replaces plain text) */}
                                    <TajweedText surahNumber={surahNumber!} ayahNumber={ayah.numberInSurah} visible={true} />
                                    {/* Translation still shows */}
                                    {translationAyah && (
                                      <p className="text-sm text-muted-foreground leading-relaxed"
                                        dir={translationEdition?.direction ?? 'ltr'}>
                                        {translationAyah.text}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Tajweed OFF → normal AyahRow
                              <AyahRow
                                ayah={ayah}
                                translationAyah={translationAyah ?? null}
                                tafsirAyah={tafsirAyah ?? null}
                                translationDirection={translationEdition?.direction ?? 'ltr'}
                                tafsirDirection={tafsirEdition?.direction ?? 'rtl'}
                                hasTafsir={!!selectedTafsir && !!tafsirAyah}
                                surahNumber={surahNumber}
                                surahNameEn={arabicData.englishName}
                                surahNameAr={arabicData.name}
                              />
                            )}
                            {/* Word-by-word (shown in both modes) */}
                            {showWordByWord && surahNumber && (
                              <div className="px-12">
                                <WordByWord surahNumber={surahNumber} ayahNumber={ayah.numberInSurah} visible={showWordByWord} />
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}

                    {/* Bottom spacer */}
                    <div className="h-4" />
                  </div>
                )}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                orientation="vertical"
                className="flex w-1.5 touch-none select-none p-0.5"
              >
                <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Loading skeletons ────────────────────────────
function AyahSkeletons() {
  return (
    <div className="space-y-4">
      {/* Surah name skeleton */}
      <div className="text-center py-4">
        <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
      </div>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3">
          <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Empty state ──────────────────────────────────
function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-base font-semibold text-foreground mb-1">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
