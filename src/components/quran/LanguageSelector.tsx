import { useState, useRef, useCallback } from 'react'
import { Languages, BookMarked, Check, ChevronDown, X } from 'lucide-react'
import PortalDropdown from '@/components/common/PortalDropdown'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'
import { TRANSLATION_EDITIONS, TAFSIR_EDITIONS } from '@/types/quranText'
import { cn } from '@/lib/utils'

export default function LanguageSelector() {
  const t = useT()
  const [transOpen, setTransOpen] = useState(false)
  const [tafsirOpen, setTafsirOpen] = useState(false)
  const transRef = useRef<HTMLButtonElement>(null)
  const tafsirRef = useRef<HTMLButtonElement>(null)

  const {
    selectedTranslation, setSelectedTranslation,
    selectedTafsir, setSelectedTafsir,
  } = useUiStore()

  const closeTrans = useCallback(() => setTransOpen(false), [])
  const closeTafsir = useCallback(() => setTafsirOpen(false), [])

  const activeTranslation = TRANSLATION_EDITIONS.find((e) => e.id === selectedTranslation)

  return (
    <div className="flex items-center gap-2">
      {/* ── Translation selector ── */}
      <button
        ref={transRef}
        onClick={() => { setTransOpen((v) => !v); setTafsirOpen(false) }}
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
        <ChevronDown className={cn('w-3 h-3 transition-transform', transOpen && 'rotate-180')} />
      </button>

      <PortalDropdown open={transOpen} onClose={closeTrans} triggerRef={transRef} anchor="below" align="left" width={224} maxHeight={280}>
        <div className="px-3 py-2 border-b border-border/40 flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">{t.translation}</p>
          {selectedTranslation && (
            <button onClick={() => { setSelectedTranslation(null); closeTrans() }}
              className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1">
              <X className="w-3 h-3" /> {t.off}
            </button>
          )}
        </div>
        <div className="p-1.5">
          {TRANSLATION_EDITIONS.map((edition) => (
            <button key={edition.id} onClick={() => { setSelectedTranslation(edition.id); closeTrans() }}
              className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors',
                selectedTranslation === edition.id ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent')}>
              <span className="truncate pr-2">{edition.label}</span>
              {selectedTranslation === edition.id && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      </PortalDropdown>

      {/* ── Tafsir selector ── */}
      <button
        ref={tafsirRef}
        onClick={() => { setTafsirOpen((v) => !v); setTransOpen(false) }}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
          selectedTafsir
            ? 'bg-primary/10 text-primary border-primary/20'
            : 'bg-muted/50 text-muted-foreground border-border/60 hover:text-foreground'
        )}
      >
        <BookMarked className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t.tafsir}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', tafsirOpen && 'rotate-180')} />
      </button>

      <PortalDropdown open={tafsirOpen} onClose={closeTafsir} triggerRef={tafsirRef} anchor="below" align="left" width={224}>
        <div className="px-3 py-2 border-b border-border/40 flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">{t.tafsir}</p>
          {selectedTafsir && (
            <button onClick={() => { setSelectedTafsir(null); closeTafsir() }}
              className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1">
              <X className="w-3 h-3" /> {t.off}
            </button>
          )}
        </div>
        <div className="p-1.5">
          {TAFSIR_EDITIONS.map((edition) => (
            <button key={edition.id} onClick={() => { setSelectedTafsir(edition.id); closeTafsir() }}
              className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors',
                selectedTafsir === edition.id ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent')}>
              <span className="truncate pr-2">{edition.label}</span>
              {selectedTafsir === edition.id && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      </PortalDropdown>
    </div>
  )
}
