import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '@/lib/i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-border/40 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          {/* Arabic verse */}
          <p className="arabic text-center md:text-right text-base text-muted-foreground/80">
            ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
          </p>

          {/* Nav links */}
          <nav className="flex items-center gap-4">
            <Link to="/"         className="hover:text-primary transition-colors">{t.nav_home}</Link>
            <Link to="/reciters" className="hover:text-primary transition-colors">{t.nav_reciters}</Link>
            <Link to="/surahs"   className="hover:text-primary transition-colors">{t.nav_surahs}</Link>
          </nav>

          {/* Credit */}
          <p className="flex items-center gap-1.5">
            {t.footer_credit}{' '}
            <a
              href="https://www.mp3quran.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mp3Quran
            </a>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border/30 flex justify-center">
          <p className="text-xs text-muted-foreground/50 flex items-center gap-1">
            {t.footer_love} <Heart className="w-3 h-3 text-primary fill-current" />
          </p>
        </div>
      </div>
    </footer>
  )
}
