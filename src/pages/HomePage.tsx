import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Headphones, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ReciterCard from '@/components/reciters/ReciterCard'
import GeometricPattern from '@/components/common/GeometricPattern'
import PageTransition from '@/components/common/PageTransition'
import DailyAyah from '@/components/common/DailyAyah'
import { useReciters } from '@/hooks/useReciters'
import { useT } from '@/lib/i18n'

// ── Hero section ──────────────────────────────────
function Hero() {
  const t = useT()

  const STATS = [
    { icon: BookOpen,    value: '114',    label: t.stat_surahs   },
    { icon: Headphones,  value: '6,000+', label: t.stat_verses   },
    { icon: Music2,      value: '100+',   label: t.stat_reciters },
  ]
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 dot-pattern opacity-40" />

      {/* Ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-sage-500/4 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-sage-700/4 blur-[80px] pointer-events-none" />

      {/* Large geometric pattern — bg decoration */}
      <GeometricPattern
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] text-primary animate-spin-slow"
        opacity={0.04}
      />
      <GeometricPattern
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] text-sage-500 animate-float"
        opacity={0.05}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-xs font-medium text-primary mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {t.hero_badge}
        </motion.div>

        {/* Arabic Bismillah */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="arabic text-3xl sm:text-4xl text-primary/80 mb-4 animate-glow"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
        >
          <span className="gold-shimmer-text">{t.hero_title}</span>
          <br />
          <span className="text-foreground/90 text-4xl sm:text-5xl lg:text-6xl">
            القرآن الكريم
          </span>
        </motion.h1>

        {/* Sub heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
        >
          {t.hero_subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button variant="gold" size="xl" asChild>
            <Link to="/reciters">
              <Headphones className="w-5 h-5 mr-2" />
              {t.hero_browse_reciters}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="glass" size="xl" asChild>
            <Link to="/surahs">
              <BookOpen className="w-5 h-5 mr-2" />
              {t.hero_view_surahs}
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground gold-text">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

// ── Featured Reciters ─────────────────────────────
function FeaturedReciters() {
  const t = useT()
  const { data: reciters, isLoading } = useReciters()
  const featured = reciters?.slice(0, 8) ?? []

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            {t.featured_label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            {t.featured_title}
          </h2>
        </div>
        <Button variant="outline" asChild className="hidden sm:flex">
          <Link to="/reciters">
            {t.view_all} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <Skeleton className="w-20 h-5 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2 rounded-lg" />
              <Skeleton className="h-3 w-1/3 mb-4 rounded-lg" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featured.map((r, i) => (
            <ReciterCard key={r.id} reciter={r} index={i} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link to="/reciters">{t.view_all} <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
        </Button>
      </div>
    </section>
  )
}

// ── Quran Quote Banner ────────────────────────────
function QuranBanner() {
  const t = useT()
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden py-20 my-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-sage-900/10 via-sage-700/5 to-sage-900/10" />
      <div className="absolute inset-y-0 left-0 w-px bg-sage-gradient opacity-40" />
      <div className="absolute inset-y-0 right-0 w-px bg-sage-gradient opacity-40" />
      <GeometricPattern className="absolute left-8 top-1/2 -translate-y-1/2 w-40 h-40 text-primary" opacity={0.08} />
      <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 text-primary" opacity={0.08} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <p className="arabic text-2xl sm:text-3xl text-primary leading-loose mb-4">
          ﴿ إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ ﴾
        </p>
        <p className="text-sm text-muted-foreground italic">
          {t.banner_translation}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-2">— {t.banner_ref}</p>
      </div>
    </motion.section>
  )
}

// ── Page ──────────────────────────────────────────
export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <FeaturedReciters />
      <DailyAyah />
      <QuranBanner />
    </PageTransition>
  )
}
