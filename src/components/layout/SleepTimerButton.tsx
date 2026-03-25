import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, TimerOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const menuRef = useRef<HTMLDivElement>(null)

  const { mode, isActive, remainingSeconds, totalSeconds, startTimer, startEndOfSurah, cancelTimer } =
    useSleepTimerStore()
  const t = useT()

  // Close menu on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={menuRef}>
      {/* Toggle button */}
      <Button
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

        {/* Active countdown badge */}
        {isActive && mode === 'minutes' && (
          <span className="absolute -top-2 -right-2 px-1 py-0.5 text-[9px] font-bold tabular-nums rounded-full bg-primary text-primary-foreground leading-none min-w-[28px] text-center">
            {formatCountdown(remainingSeconds)}
          </span>
        )}

        {/* End of surah indicator dot */}
        {isActive && mode === 'end-of-surah' && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </Button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-48 rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-border/40">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Timer className="w-3 h-3 text-primary" />
                Sleep Timer
              </p>
            </div>

            {/* Options */}
            <div className="p-1.5">
              {TIMER_OPTIONS.map((opt) => {
                const isSelected =
                  mode === 'minutes' &&
                  isActive &&
                  Math.ceil(totalSeconds / 60) === opt.minutes

                return (
                  <button
                    key={opt.minutes}
                    onClick={() => {
                      startTimer(opt.minutes)
                      setOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                )
              })}

              {/* End of surah */}
              <button
                onClick={() => {
                  startEndOfSurah()
                  setOpen(false)
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                  mode === 'end-of-surah' && isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-accent'
                )}
              >
                <span>{t.end_of_surah}</span>
                {mode === 'end-of-surah' && isActive && (
                  <Check className="w-3.5 h-3.5 text-primary" />
                )}
              </button>

              {/* Cancel — only show when active */}
              {isActive && (
                <>
                  <div className="my-1.5 border-t border-border/40" />
                  <button
                    onClick={() => {
                      cancelTimer()
                      setOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <TimerOff className="w-3.5 h-3.5" />
                    {t.cancel_timer}
                  </button>
                </>
              )}
            </div>

            {/* Active status footer */}
            {isActive && (
              <div className="px-3 py-2 border-t border-border/40 bg-muted/30">
                <p className="text-[10px] text-muted-foreground text-center">
                  {mode === 'minutes'
                    ? `${t.pausing_in} ${formatCountdown(remainingSeconds)}`
                    : t.pausing_after_surah}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
