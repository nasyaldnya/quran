import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Headphones, PlayCircle, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useFavoritesStore } from '@/store/favoritesStore'
import type { Reciter } from '@/types/api'

interface ReciterCardProps {
  reciter: Reciter
  index:   number
}

export default function ReciterCard({ reciter, index }: ReciterCardProps) {
  const totalSurahs = reciter.moshaf.reduce((acc, m) => acc + m.surah_total, 0)
  const moshafCount = reciter.moshaf.length
  const { isReciterFav, toggleReciter } = useFavoritesStore()
  const isFav = isReciterFav(reciter.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.6), duration: 0.4, ease: [0.22,1,0.36,1] }}
    >
      <Link
        to={`/reciters/${reciter.id}`}
        className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        <div className="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-1 hover:shadow-gold-sm">
          {/* Top accent gradient */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gold-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          <div className="p-6 flex flex-col h-full">
            {/* Avatar */}
            <div className="mb-4 flex items-start justify-between">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/20 flex items-center justify-center group-hover:shadow-gold-sm transition-shadow duration-300">
                  <span className="font-arabic text-2xl font-bold text-primary">
                    {reciter.letter || reciter.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <PlayCircle className="w-3 h-3 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Headphones className="w-2.5 h-2.5 mr-1" />
                  {moshafCount} {moshafCount === 1 ? 'Riwaya' : 'Riwayat'}
                </Badge>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleReciter({
                      id: reciter.id,
                      name: reciter.name,
                      letter: reciter.letter,
                    })
                  }}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-colors duration-200',
                      isFav
                        ? 'text-red-500 fill-red-500'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="flex-1">
              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug mb-1">
                {reciter.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {totalSurahs} {totalSurahs === 1 ? 'Surah' : 'Surahs'} available
              </p>
            </div>

            {/* Moshaf tags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {reciter.moshaf.slice(0, 3).map((m) => (
                <span
                  key={m.id}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50 truncate max-w-[120px]"
                  title={m.name}
                >
                  {m.name}
                </span>
              ))}
              {reciter.moshaf.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
                  +{reciter.moshaf.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
