import { useState, useRef, useCallback } from 'react'
import { Timer, TimerOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PortalDropdown from '@/components/common/PortalDropdown'
import { useSleepTimerStore } from '@/store/sleepTimerStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const TIMER_OPTIONS = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '60 min', minutes: 60 },
] as const

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function SleepTimerButton() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const { mode, isActive, remainingSeconds, totalSeconds, startTimer, startEndOfSurah, cancelTimer } =
    useSleepTimerStore()
  const t = useT()

  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative',
          isActive
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Sleep timer"
      >
        {isActive ? (
          <TimerOff className="h-3.5 w-3.5" />
        ) : (
          <Timer className="h-3.5 w-3.5" />
        )}
        {isActive && mode === 'minutes' && (
          <span className="absolute -top-2 -right-2 px-1 py-0.5 text-[9px] font-bold tabular-nums rounded-full bg-primary text-primary-foreground leading-none min-w-[28px] text-center">
            {formatCountdown(remainingSeconds)}
          </span>
        )}
        {isActive && mode === 'end-of-surah' && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </Button>

      <PortalDropdown open={open} onClose={close} triggerRef={triggerRef} anchor="above" align="right" width={192}>
        <div className="px-3 py-2 border-b border-border/40">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Timer className="w-3 h-3 text-primary" />
            {t.sleep_timer}
          </p>
        </div>
        <div className="p-1.5">
          {TIMER_OPTIONS.map((opt) => {
            const isSelected = mode === 'minutes' && isActive && Math.ceil(totalSeconds / 60) === opt.minutes
            return (
              <button key={opt.minutes} onClick={() => { startTimer(opt.minutes); close() }}
                className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                  isSelected ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent')}>
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            )
          })}
          <button onClick={() => { startEndOfSurah(); close() }}
            className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
              mode === 'end-of-surah' && isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent')}>
            <span>{t.end_of_surah}</span>
            {mode === 'end-of-surah' && isActive && <Check className="w-3.5 h-3.5 text-primary" />}
          </button>
          {isActive && (
            <>
              <div className="my-1.5 border-t border-border/40" />
              <button onClick={() => { cancelTimer(); close() }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                <TimerOff className="w-3.5 h-3.5" />{t.cancel_timer}
              </button>
            </>
          )}
        </div>
        {isActive && (
          <div className="px-3 py-2 border-t border-border/40 bg-muted/30">
            <p className="text-[10px] text-muted-foreground text-center">
              {mode === 'minutes' ? `${t.pausing_in} ${formatCountdown(remainingSeconds)}` : t.pausing_after_surah}
            </p>
          </div>
        )}
      </PortalDropdown>
    </>
  )
}
