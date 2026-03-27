import { useState, useCallback, useRef } from 'react'
import { Repeat, Repeat1, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PortalDropdown from '@/components/common/PortalDropdown'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface RepeatControlProps {
  totalAyahs: number
  onRepeatChange: (config: RepeatConfig | null) => void
  currentConfig: RepeatConfig | null
}

export interface RepeatConfig {
  mode: 'single' | 'range'
  startAyah: number
  endAyah: number
  repeatCount: number   // 0 = infinite
  currentLoop: number
}

const REPEAT_OPTIONS = [3, 5, 10, 20, 0] as const // 0 = infinite

export default function RepeatControl({ totalAyahs, onRepeatChange, currentConfig }: RepeatControlProps) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const [mode, setMode] = useState<'single' | 'range'>('single')
  const [startAyah, setStartAyah] = useState(1)
  const [endAyah, setEndAyah] = useState(1)
  const close = useCallback(() => setOpen(false), [])

  const isActive = !!currentConfig

  const apply = (count: number) => {
    const start = mode === 'single' ? startAyah : Math.min(startAyah, endAyah)
    const end = mode === 'single' ? startAyah : Math.max(startAyah, endAyah)
    onRepeatChange({ mode, startAyah: start, endAyah: end, repeatCount: count, currentLoop: 0 })
    close()
  }

  const clear = () => {
    onRepeatChange(null)
    close()
  }

  return (
    <>
      <Button ref={ref} variant="ghost" size="icon-sm"
        onClick={() => setOpen(v => !v)}
        className={cn('relative', isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
        aria-label={t.repeat_ayah}>
        {isActive ? <Repeat1 className="h-3.5 w-3.5" /> : <Repeat className="h-3.5 w-3.5" />}
        {isActive && (
          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[8px] font-bold rounded-full bg-primary text-primary-foreground leading-none">
            {currentConfig.repeatCount === 0 ? '∞' : `${currentConfig.currentLoop}/${currentConfig.repeatCount}`}
          </span>
        )}
      </Button>

      <PortalDropdown open={open} onClose={close} triggerRef={ref} anchor="below" align="left" width={240}>
        <div className="px-3 py-2 border-b border-border/40">
          <p className="text-xs font-semibold text-foreground">{t.repeat_ayah}</p>
        </div>

        <div className="p-3 space-y-3">
          {/* Mode toggle */}
          <div className="flex gap-1.5">
            <button onClick={() => setMode('single')}
              className={cn('flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                mode === 'single' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-border/60 hover:text-foreground')}>
              {t.repeat_single}
            </button>
            <button onClick={() => setMode('range')}
              className={cn('flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                mode === 'range' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-border/60 hover:text-foreground')}>
              {t.repeat_range}
            </button>
          </div>

          {/* Ayah selectors */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-muted-foreground block mb-1">
                {mode === 'single' ? t.repeat_ayah_num : t.repeat_from}
              </label>
              <select value={startAyah} onChange={e => setStartAyah(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-lg bg-background border border-border/80 text-foreground text-xs">
                {Array.from({ length: totalAyahs }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            {mode === 'range' && (
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground block mb-1">{t.repeat_to}</label>
                <select value={endAyah} onChange={e => setEndAyah(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-background border border-border/80 text-foreground text-xs">
                  {Array.from({ length: totalAyahs }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Repeat count options */}
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1.5">{t.repeat_times}</label>
            <div className="grid grid-cols-5 gap-1">
              {REPEAT_OPTIONS.map(count => (
                <button key={count} onClick={() => apply(count)}
                  className="px-2 py-1.5 rounded-lg text-xs font-medium bg-accent text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/40">
                  {count === 0 ? '∞' : `${count}×`}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {isActive && (
            <button onClick={clear}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors">
              <X className="w-3 h-3" />{t.repeat_stop}
            </button>
          )}
        </div>
      </PortalDropdown>
    </>
  )
}
