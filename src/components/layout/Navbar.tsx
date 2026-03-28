import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen, ChevronDown, Search } from 'lucide-react'
import ThemeToggle from '@/components/common/ThemeToggle'
import LanguageSelectorNav from '@/components/common/LanguageSelectorNav'
import PortalDropdown from '@/components/common/PortalDropdown'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLButtonElement>(null)
  const closeMore = useCallback(() => setMoreOpen(false), [])

  // Primary links (always visible in desktop nav)
  const PRIMARY = [
    { to: '/',          label: t.nav_home },
    { to: '/reciters',  label: t.nav_reciters },
    { to: '/surahs',    label: t.nav_surahs },
    { to: '/mushaf',    label: t.nav_mushaf },
    { to: '/search',    label: t.nav_search },
  ]

  // Secondary links (in "More" dropdown on desktop, full list on mobile)
  const SECONDARY = [
    { to: '/juz',       label: t.nav_juz },
    { to: '/favorites', label: t.nav_favorites },
    { to: '/bookmarks', label: t.nav_bookmarks },
    { to: '/playlists', label: t.nav_playlists },
    { to: '/compare',   label: t.nav_compare },
    { to: '/stats',     label: t.nav_stats },
    { to: '/history',   label: t.nav_history },
  ]

  const ALL_LINKS = [...PRIMARY, ...SECONDARY]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass-strong shadow-player border-b border-white/5 py-2.5' : 'bg-transparent py-4'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="mp3quran.cam">
            <div className="relative w-8 h-8 rounded-lg bg-sage-gradient flex items-center justify-center shadow-sage-sm group-hover:shadow-sage transition-shadow duration-300">
              <BookOpen className="w-4 h-4 text-sage-900" />
            </div>
            <span className="font-display font-semibold text-base tracking-wide hidden sm:block">
              <span className="gold-text">mp3quran</span>
              <span className="text-muted-foreground text-xs font-normal">.cam</span>
            </span>
          </Link>

          {/* Desktop Nav — primary links + "More" */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {PRIMARY.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                className={({ isActive }) => cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}>
                {link.label}
              </NavLink>
            ))}

            {/* More dropdown */}
            <button ref={moreRef} onClick={() => setMoreOpen(v => !v)}
              className={cn('flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                moreOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}>
              {t.nav_more} <ChevronDown className={cn('w-3 h-3 transition-transform', moreOpen && 'rotate-180')} />
            </button>

            <PortalDropdown open={moreOpen} onClose={closeMore} triggerRef={moreRef} anchor="below" align="right" width={200}>
              <div className="p-1.5">
                {SECONDARY.map(link => (
                  <NavLink key={link.to} to={link.to}
                    onClick={closeMore}
                    className={({ isActive }) => cn(
                      'block px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-accent'
                    )}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </PortalDropdown>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            {/* Quick search (desktop, compact) */}
            <NavLink to="/search" className="hidden md:flex lg:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
              <Search className="w-4 h-4" />
            </NavLink>
            <LanguageSelectorNav />
            <ThemeToggle />
            <button className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu — full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              className="relative mt-[60px] mx-4 rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
              <nav className="p-2">
                {ALL_LINKS.map(link => (
                  <NavLink key={link.to} to={link.to} end={link.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[64px]" />
    </>
  )
}
