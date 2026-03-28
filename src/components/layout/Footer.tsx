import { Heart, ExternalLink, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '@/lib/i18n'

export default function Footer() {
  const t = useT()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 mt-auto bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-sage-gradient flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-sage-900" />
              </div>
              <span className="font-display font-semibold text-sm gold-text">mp3quran.cam</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.footer_desc}</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">{t.footer_nav}</p>
            <div className="space-y-2">
              <Link to="/reciters" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_reciters}</Link>
              <Link to="/surahs" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_surahs}</Link>
              <Link to="/mushaf" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_mushaf}</Link>
              <Link to="/search" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_search}</Link>
              <Link to="/juz" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_juz}</Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">{t.footer_features}</p>
            <div className="space-y-2">
              <Link to="/compare" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_compare}</Link>
              <Link to="/playlists" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_playlists}</Link>
              <Link to="/bookmarks" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_bookmarks}</Link>
              <Link to="/stats" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_stats}</Link>
              <Link to="/favorites" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.nav_favorites}</Link>
            </div>
          </div>

          {/* Partners & APIs */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">{t.footer_partners}</p>
            <div className="space-y-2">
              <a href="https://www.mp3quran.net" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                Mp3Quran.net <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                AlQuran Cloud API <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a href="https://qurancomplex.gov.sa" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                {t.footer_kfqpc} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Verse + API credits */}
        <div className="border-t border-border/30 py-6">
          <p className="arabic text-center text-base text-muted-foreground/60 mb-4">
            ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground/50">
            <p>{t.footer_api_credit}</p>
            <p className="flex items-center gap-1">
              © {year} mp3quran.cam · {t.footer_love} <Heart className="w-2.5 h-2.5 text-primary fill-current" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
