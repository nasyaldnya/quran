import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListMusic, Play, Pause, X, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PortalDropdown from '@/components/common/PortalDropdown'
import { useAudioStore } from '@/store/audioStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function QueueDrawer() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const t = useT()
  const close = useCallback(() => setOpen(false), [])

  const {
    queue, queueIndex, currentTrack, isPlaying,
    setCurrentTrack, setIsPlaying,
  } = useAudioStore()

  const playFromIndex = (idx: number) => {
    const track = queue[idx]
    if (!track) return
    if (currentTrack?.audioUrl === track.audioUrl) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track, queue, idx)
    }
  }

  const removeFromQueue = (idx: number) => {
    const newQueue = queue.filter((_, i) => i !== idx)
    useAudioStore.setState({ queue: newQueue })
  }

  if (!currentTrack || queue.length <= 1) return null

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost" size="icon-sm"
        onClick={() => setOpen(v => !v)}
        className={cn('relative', open ? 'text-primary' : 'text-foreground/60 hover:text-foreground')}
        aria-label={t.queue_title}
      >
        <ListMusic className="h-4 w-4" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
          {queue.length}
        </span>
      </Button>

      <PortalDropdown open={open} onClose={close} triggerRef={triggerRef} anchor="above" align="right" width={300} maxHeight={360}>
        <div className="px-3 py-2 border-b border-border/40 flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <ListMusic className="w-3 h-3 text-primary" />
            {t.queue_title} ({queue.length})
          </p>
        </div>
        <div className="p-1.5 overflow-y-auto max-h-[280px]">
          {queue.map((track, idx) => {
            const isCurrent = idx === queueIndex
            return (
              <div key={`${track.audioUrl}-${idx}`}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors',
                  isCurrent ? 'bg-primary/10' : 'hover:bg-accent'
                )}>
                <button onClick={() => playFromIndex(idx)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                  <div className={cn(
                    'w-6 h-6 rounded flex items-center justify-center flex-shrink-0',
                    isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {isCurrent && isPlaying
                      ? <Pause className="w-3 h-3 fill-current" />
                      : <Play className="w-3 h-3 fill-current ml-px" />}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('truncate', isCurrent ? 'text-primary font-semibold' : 'text-foreground')}>
                      {track.surahNameEn}
                    </p>
                    <p className="text-muted-foreground/60 truncate text-[10px]">{track.reciterName}</p>
                  </div>
                </button>
                {!isCurrent && (
                  <button onClick={() => removeFromQueue(idx)}
                    className="text-muted-foreground/40 hover:text-destructive p-0.5 flex-shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </PortalDropdown>
    </>
  )
}
