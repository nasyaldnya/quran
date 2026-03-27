import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen } from 'lucide-react'
import ThemeToggle from '@/components/common/ThemeToggle'
import LanguageSelectorNav from '@/components/common/LanguageSelectorNav'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const t = useT()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const NAV_LINKS = [
    { to: '/',          label: t.nav_home      },
    { to: '/reciters',  label: t.nav_reciters  },
    { to: '/surahs',    label: t.nav_surahs    },
    { to: '/juz',       label: t.nav_juz       },
    { to: '/mushaf',    label: t.nav_mushaf    },
    { to: '/editions',  label: t.nav_editions  },
    { to: '/search',    label: t.nav_search    },
    { to: '/favorites', label: t.nav_favorites },
    { to: '/bookmarks', label: t.nav_bookmarks },
    { to: '/playlists', label: t.nav_playlists },
    { to: '/compare',   label: t.nav_compare   },
    { to: '/stats',     label: t.nav_stats     },
    { to: '/history',   label: t.nav_history   },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-strong shadow-player border-b border-white/5 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Home">
            <div className="relative w-9 h-9 rounded-lg bg-sage-gradient flex items-center justify-center shadow-sage-sm group-hover:shadow-sage transition-shadow duration-300">
              <BookOpen className="w-5 h-5 text-sage-900" />
            </div>
            <span className="font-display font-semibold text-lg tracking-wide hidden sm:block">
              <span className="gold-text">Quran</span>
              <span className="text-muted-foreground ml-1 text-sm font-normal">الكريم</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelectorNav />
            <ThemeToggle />
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] z-40 glass-strong border-b border-white/5 px-4 py-4 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-[72px]" />
    </>
  )
}
