import { motion } from 'framer-motion'
import { Play, Pause, Loader2, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn, SURAH_NAMES_AR, SURAH_NAMES, REVELATION_TYPE, VERSE_COUNTS } from '@/lib/utils'
import { useAudioStore } from '@/store/audioStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useT } from '@/lib/i18n'
import type { Track } from '@/types/api'

interface SurahListItemProps {
  track:   Track
  index:   number
  allTracks: Track[]
}

export default function SurahListItem({ track, index, allTracks }: SurahListItemProps) {
  const { currentTrack, isPlaying, isLoading, setCurrentTrack, setIsPlaying } = useAudioStore()
  const { isSurahFav, toggleSurah } = useFavoritesStore()
  const t = useT()
  const isFav = isSurahFav(track.surahNumber)

  const isActive  = currentTrack?.audioUrl === track.audioUrl
  const isThisLoading = isActive && isLoading
  const isThisPlaying = isActive && isPlaying

  const handleClick = () => {
    if (isActive) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track, allTracks, index)
    }
  }

  const revealType = REVELATION_TYPE[track.surahNumber]
  const verseCount = VERSE_COUNTS[track.surahNumber] ?? track.verseCount

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.025, 1), duration: 0.3 }}
    >
      <button
        onClick={handleClick}
        className={cn(
          'w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-left',
          isActive
            ? 'bg-primary/10 border border-primary/20'
            : 'hover:bg-accent border border-transparent hover:border-border/60'
        )}
        aria-label={`Play Surah ${track.surahNameEn}`}
      >
        {/* Number / Play icon */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          isActive
            ? 'bg-primary/20'
            : 'bg-muted group-hover:bg-primary/10'
        )}>
          {isThisLoading ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : isThisPlaying ? (
            <Pause className="w-4 h-4 text-primary fill-current" />
          ) : (
            <>
              <span className={cn(
                'text-sm font-semibold tabular-nums group-hover:hidden',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {track.surahNumber}
              </span>
              <Play className="w-4 h-4 text-primary fill-current hidden group-hover:block" />
            </>
          )}
        </div>

        {/* Names */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-semibold truncate',
              isActive ? 'text-primary' : 'text-foreground'
            )}>
              {SURAH_NAMES[track.surahNumber] ?? track.surahNameEn}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{verseCount} {t.verses}</span>
        </div>

        {/* Arabic name */}
        <span className={cn(
          'arabic text-base hidden sm:block flex-shrink-0',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}>
          {SURAH_NAMES_AR[track.surahNumber] ?? track.surahNameAr}
        </span>

        {/* Reveal type badge */}
        <Badge
          variant={revealType === 'Makki' ? 'makkia' : 'madania'}
          className="flex-shrink-0 hidden md:flex"
        >
          {revealType}
        </Badge>

        {/* Favorite heart */}
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            toggleSurah({
              surahNumber: track.surahNumber,
              surahNameEn: track.surahNameEn,
              surahNameAr: track.surahNameAr,
            })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              toggleSurah({
                surahNumber: track.surahNumber,
                surahNameEn: track.surahNameEn,
                surahNameAr: track.surahNameAr,
              })
            }
          }}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-accent transition-colors"
          aria-label={isFav ? t.remove_favorite : t.add_favorite}
        >
          <Heart
            className={cn(
              'w-3.5 h-3.5 transition-colors duration-200',
              isFav
                ? 'text-red-500 fill-red-500'
                : 'text-muted-foreground opacity-0 group-hover:opacity-100'
            )}
          />
        </div>
      </button>
    </motion.div>
  )
}
