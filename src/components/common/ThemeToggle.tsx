import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeProvider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn('relative overflow-hidden', className)}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Sun className="h-[1.1rem] w-[1.1rem] text-sage-400" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90,  opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Moon className="h-[1.1rem] w-[1.1rem] text-primary" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
