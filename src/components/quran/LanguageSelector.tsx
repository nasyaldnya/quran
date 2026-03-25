import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, BookMarked, Check, ChevronDown, X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'
import { TRANSLATION_EDITIONS, TAFSIR_EDITIONS } from '@/types/quranText'
import { cn } from '@/lib/utils'

type ActiveDropdown = 'translation' | 'tafsir' | null

export default function LanguageSelector() {
  const t = useT()
  const [openDropdown, setOpenDropdown] = useState<ActiveDropdown>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    selectedTranslation,
    setSelectedTranslation,
    selectedTafsir,
    setSelectedTafsir,
  } = useUiStore()

  // Close on outside click
  useEffect(() => {
    if (!openDropdown) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openDropdown])

  const activeTranslation = TRANSLATION_EDITIONS.find(
    (e) => e.id === selectedTranslation
  )
  const activeTafsir = TAFSIR_EDITIONS.find((e) => e.id === selectedTafsir)

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      {/* ── Translation selector ── */}
      <div className="relative">
        <button
          onClick={() =>
            setOpenDropdown((d) => (d === 'translation' ? null : 'translation'))
          }
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
            selectedTranslation
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-muted/50 text-muted-foreground border-border/60 hover:text-foreground'
          )}
        >
          <Languages className="w-3.5 h-3.5" />
          <span className="hidden sm:inline max-w-[120px] truncate">
            {activeTranslation ? activeTranslation.label.split('—')[0].trim() : t.translation}
          </span>
          <ChevronDown
            className={cn(
              'w-3 h-3 transition-transform',
              openDropdown === 'translation' && 'rotate-180'
            )}
          />
        </button>

        <AnimatePresence>
          {openDropdown === 'translation' && (
            <DropdownMenu>
              <div className="px-3 py-2 border-b border-border/40 flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">{t.translation}</p>
                {selectedTranslation && (
                  <button
                    onClick={() => {
                      setSelectedTranslation(null)
                      setOpenDropdown(null)
                    }}
                    className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> {t.off}
                  </button>
                )}
              </div>
              <div className="p-1.5 max-h-64 overflow-y-auto">
                {TRANSLATION_EDITIONS.map((edition) => (
                  <button
                    key={edition.id}
                    onClick={() => {
                      setSelectedTranslation(edition.id)
                      setOpenDropdown(null)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors',
                      selectedTranslation === edition.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    <span className="truncate pr-2">{edition.label}</span>
                    {selectedTranslation === edition.id && (
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </DropdownMenu>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tafsir selector ── */}
      <div className="relative">
        <button
          onClick={() =>
            setOpenDropdown((d) => (d === 'tafsir' ? null : 'tafsir'))
          }
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
            selectedTafsir
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-muted/50 text-muted-foreground border-border/60 hover:text-foreground'
          )}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.tafsir}</span>
          <ChevronDown
            className={cn(
              'w-3 h-3 transition-transform',
              openDropdown === 'tafsir' && 'rotate-180'
            )}
          />
        </button>

        <AnimatePresence>
          {openDropdown === 'tafsir' && (
            <DropdownMenu>
              <div className="px-3 py-2 border-b border-border/40 flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">{t.tafsir}</p>
                {selectedTafsir && (
                  <button
                    onClick={() => {
                      setSelectedTafsir(null)
                      setOpenDropdown(null)
                    }}
                    className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> {t.off}
                  </button>
                )}
              </div>
              <div className="p-1.5">
                {TAFSIR_EDITIONS.map((edition) => (
                  <button
                    key={edition.id}
                    onClick={() => {
                      setSelectedTafsir(edition.id)
                      setOpenDropdown(null)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors',
                      selectedTafsir === edition.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    <span className="truncate pr-2">{edition.label}</span>
                    {selectedTafsir === edition.id && (
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </DropdownMenu>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Shared dropdown wrapper ──────────────────────
function DropdownMenu({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className="absolute top-full left-0 mt-1.5 w-56 rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden z-50"
    >
      {children}
    </motion.div>
  )
}
