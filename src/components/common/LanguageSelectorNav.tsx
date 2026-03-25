import { useState, useRef, useCallback } from 'react'
import { Globe, Check } from 'lucide-react'
import PortalDropdown from '@/components/common/PortalDropdown'
import { useLanguageStore, APP_LANGUAGES } from '@/store/languageStore'
import { cn } from '@/lib/utils'

export default function LanguageSelectorNav() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { locale, setLocale } = useLanguageStore()

  const current = APP_LANGUAGES.find((l) => l.code === locale) ?? APP_LANGUAGES[0]
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.native}</span>
      </button>

      <PortalDropdown open={open} onClose={close} triggerRef={triggerRef} anchor="below" align="right" width={224} maxHeight={320}>
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
              onClick={() => { setLocale(lang.code); close() }}
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
              {locale === lang.code && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      </PortalDropdown>
    </>
  )
}
