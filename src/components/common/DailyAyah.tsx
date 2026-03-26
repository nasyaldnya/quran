import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useT } from '@/lib/i18n'

interface DailyAyahData {
  arabic: string
  translation: string
  surahName: string
  surahNumber: number
  ayahNumber: number
}

// Deterministic daily seed — same ayah all day
function getDailySeed(): number {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

// Map seed to ayah number (1-6236)
function seedToAyah(seed: number): number {
  return (seed * 2654435761 >>> 0) % 6236 + 1
}

export default function DailyAyah() {
  const t = useT()
  const { openSurah } = useUiStore()
  const [data, setData] = useState<DailyAyahData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ayahNum = seedToAyah(getDailySeed())
    const cacheKey = `daily-ayah-${getDailySeed()}`
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
      try { setData(JSON.parse(cached)); setLoading(false); return } catch {}
    }

    Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/quran-uthmani`).then(r => r.json()),
      fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/en.sahih`).then(r => r.json()),
    ]).then(([ar, en]) => {
      const result: DailyAyahData = {
        arabic: ar.data?.text ?? '',
        translation: en.data?.text ?? '',
        surahName: ar.data?.surah?.englishName ?? '',
        surahNumber: ar.data?.surah?.number ?? 1,
        ayahNumber: ar.data?.numberInSurah ?? 1,
      }
      setData(result)
      localStorage.setItem(cacheKey, JSON.stringify(result))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading || !data) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-12"
    >
      <div className="relative rounded-2xl border border-border/60 bg-card p-6 sm:p-8 overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-sage-gradient" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">{t.daily_ayah}</p>
            <p className="text-[11px] text-muted-foreground">{t.daily_ayah_subtitle}</p>
          </div>
        </div>

        {/* Arabic text */}
        <p className="font-arabic text-2xl sm:text-3xl text-foreground leading-[2.2] text-right mb-4" dir="rtl">
          {data.arabic}
        </p>

        {/* Translation */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
          {data.translation}
        </p>

        {/* Reference */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/70">
            {data.surahName} {data.surahNumber}:{data.ayahNumber}
          </span>
          <button
            onClick={() => openSurah(data.surahNumber)}
            className="text-xs text-primary hover:underline"
          >
            {t.read_more} →
          </button>
        </div>
      </div>
    </motion.section>
  )
}
