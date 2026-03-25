import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

export default function QuranTextToggle() {
  const { isTextPanelOpen, toggleTextPanel } = useUiStore()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTextPanel}
      className={cn(
        'relative',
        isTextPanelOpen
          ? 'text-primary'
          : 'text-foreground/70 hover:text-foreground'
      )}
      aria-label={isTextPanelOpen ? 'Close Quran text' : 'Show Quran text'}
    >
      <BookOpen className="h-4 w-4" />
      {isTextPanelOpen && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
      )}
    </Button>
  )
}
