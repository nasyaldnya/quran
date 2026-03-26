import { useState, useRef, useCallback } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PortalDropdown from '@/components/common/PortalDropdown'
import { useAudioStore } from '@/store/audioStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export default function SpeedControl() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const { playbackRate, setPlaybackRate } = useAudioStore()
  const t = useT()
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button
        ref={ref}
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'text-[10px] font-bold tabular-nums w-auto px-1.5 min-w-[2rem]',
          playbackRate !== 1 ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
        )}
        aria-label={t.playback_speed}
      >
        {playbackRate}x
      </Button>

      <PortalDropdown open={open} onClose={close} triggerRef={ref} anchor="above" align="right" width={140}>
        <div className="px-3 py-2 border-b border-border/40">
          <p className="text-xs font-semibold text-foreground">{t.playback_speed}</p>
        </div>
        <div className="p-1.5">
          {SPEEDS.map((speed) => (
            <button key={speed} onClick={() => { setPlaybackRate(speed); close() }}
              className={cn('w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors',
                playbackRate === speed ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent')}>
              <span>{speed === 1 ? t.speed_normal : `${speed}x`}</span>
              {playbackRate === speed && <Check className="w-3 h-3 text-primary" />}
            </button>
          ))}
        </div>
      </PortalDropdown>
    </>
  )
}
