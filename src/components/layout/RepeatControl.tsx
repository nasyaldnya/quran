import { useState, useRef, useCallback } from 'react'
import { Repeat2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PortalDropdown from '@/components/common/PortalDropdown'
import { useRepeatStore } from '@/store/repeatStore'
import { useAudioStore } from '@/store/audioStore'
import { formatTime } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const COUNT_OPTIONS = [3, 5, 10, 20, 50] as const

export default function RepeatControl() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const t = useT()
  const close = useCallback(() => setOpen(false), [])

  const { mode, startTime, endTime, repeatCount, currentCount, setMode, setRange, setRepeatCount, clearAll } = useRepeatStore()
  const { currentTime, duration } = useAudioStore()

  const setA = () => setRange(Math.floor(currentTime), endTime > 0 ? endTime : Math.floor(duration))
  const setB = () => setRange(startTime, Math.floor(currentTime))

  const isActive = mode !== 'off'

  return (
    <>
      <Button
        ref={ref}
        variant="ghost" size="icon-sm"
        onClick={() => setOpen(v => !v)}
        className={cn('relative', isActive ? 'text-primary' : 'text-foreground/50 hover:text-foreground')}
        aria-label={t.repeat_range}
      >
        <Repeat2 className="h-3.5 w-3.5" />
        {mode === 'count' && (
          <span className="absolute -top-1.5 -right-1.5 px-1 py-px text-[8px] font-bold rounded-full bg-primary text-primary-foreground leading-none">
            {currentCount}/{repeatCount}
          </span>
        )}
      </Button>

      <PortalDropdown open={open} onClose={close} triggerRef={ref} anchor="above" align="right" width={220}>
        <div className="px-3 py-2 border-b border-border/40">
          <p className="text-xs font-semibold text-foreground">{t.repeat_range}</p>
        </div>
        <div className="p-1.5">
          {/* Off */}
          <button onClick={() => { clearAll(); close() }}
            className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
              mode === 'off' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent')}>
            <span>{t.off}</span>
            {mode === 'off' && <Check className="w-3 h-3" />}
          </button>

          {/* A-B Range Loop */}
          <div className="px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">{t.repeat_ab_loop}</p>
            <div className="flex items-center gap-2">
              <button onClick={setA}
                className="flex-1 px-2 py-1.5 rounded-md bg-muted text-xs font-medium text-foreground hover:bg-accent transition-colors text-center">
                A: {startTime > 0 ? formatTime(startTime) : '—'}
              </button>
              <span className="text-muted-foreground/40">→</span>
              <button onClick={setB}
                className="flex-1 px-2 py-1.5 rounded-md bg-muted text-xs font-medium text-foreground hover:bg-accent transition-colors text-center">
                B: {endTime > 0 ? formatTime(endTime) : '—'}
              </button>
            </div>
            {mode === 'range' && (
              <p className="text-[10px] text-primary mt-1 text-center">{t.repeat_looping}</p>
            )}
          </div>

          <div className="border-t border-border/30 my-1" />

          {/* Count repeat */}
          <p className="px-3 pt-1 text-[10px] text-muted-foreground uppercase tracking-widest">{t.repeat_count}</p>
          {COUNT_OPTIONS.map((count) => (
            <button key={count}
              onClick={() => { setRepeatCount(count); close() }}
              className={cn('w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors',
                mode === 'count' && repeatCount === count ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent')}>
              <span>{count}x</span>
              {mode === 'count' && repeatCount === count && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </PortalDropdown>
    </>
  )
}
