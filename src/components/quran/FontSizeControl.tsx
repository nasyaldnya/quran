import { Minus, Plus, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'

const MIN_SIZE = 1.0
const MAX_SIZE = 2.5
const STEP = 0.25

export default function FontSizeControl() {
  const { arabicFontSize, setArabicFontSize } = useUiStore()
  const t = useT()

  return (
    <div className="flex items-center gap-1.5">
      <Type className="w-3.5 h-3.5 text-muted-foreground" />
      <Button
        variant="ghost" size="icon-sm"
        onClick={() => setArabicFontSize(Math.max(MIN_SIZE, arabicFontSize - STEP))}
        disabled={arabicFontSize <= MIN_SIZE}
        className="text-foreground/60 hover:text-foreground w-6 h-6"
        aria-label={t.font_size_decrease}
      >
        <Minus className="w-3 h-3" />
      </Button>
      <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-center">
        {Math.round(arabicFontSize * 100 / 1.5)}%
      </span>
      <Button
        variant="ghost" size="icon-sm"
        onClick={() => setArabicFontSize(Math.min(MAX_SIZE, arabicFontSize + STEP))}
        disabled={arabicFontSize >= MAX_SIZE}
        className="text-foreground/60 hover:text-foreground w-6 h-6"
        aria-label={t.font_size_increase}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  )
}
