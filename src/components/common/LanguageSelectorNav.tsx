import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { useLanguageStore, APP_LANGUAGES } from '@/store/languageStore'
import { cn } from '@/lib/utils'

export default function LanguageSelectorNav() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { locale, setLocale } = useLanguageStore()

  const current = APP_LANGUAGES.find((l) => l.code === locale) ?? APP_LANGUAGES[0]

  // Close on outside click
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
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.native}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-2 w-56 max-h-80 overflow-y-auto rounded-xl border border-border/60 bg-card shadow-xl z-50"
          >
            <div className="px-3 py-2 border-b border-border/40">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-primary" />
                Language
              </p>
            </div>
            <div className="p-1.5">
              {APP_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code)
                    setOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                    locale === lang.code
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent'
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-xs text-muted-foreground w-7">{lang.code}</span>
                    <span>{lang.native}</span>
                  </span>
                  {locale === lang.code && (
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
