import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Headphones, Play, Pause,
  List, Search, BookOpen, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import SurahListItem from '@/components/surahs/SurahListItem'
import PageTransition from '@/components/common/PageTransition'
import SearchBar from '@/components/common/SearchBar'
import GeometricPattern from '@/components/common/GeometricPattern'
import { useReciter } from '@/hooks/useReciters'
import { useAudioStore } from '@/store/audioStore'
import { buildAudioUrl } from '@/lib/api'
import { SURAH_NAMES, SURAH_NAMES_AR, REVELATION_TYPE, VERSE_COUNTS } from '@/lib/utils'
import { useDebounce as useDB } from '@/hooks/useDebounce'
import type { Track, Moshaf } from '@/types/api'

// Build track list from a Moshaf
function buildTracks(moshaf: Moshaf, reciterName: string, reciterId: number): Track[] {
  const surahNums = moshaf.surah_list
    .split(',')
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !isNaN(n))

  return surahNums.map((num) => ({
    surahNumber:    num,
    surahNameAr:    SURAH_NAMES_AR[num]  ?? `سورة ${num}`,
    surahNameEn:    SURAH_NAMES[num]     ?? `Surah ${num}`,
    reciterName,
    reciterId,
    moshafId:       moshaf.id,
    audioUrl:       buildAudioUrl(moshaf.server, num),
    verseCount:     VERSE_COUNTS[num]    ?? 0,
    revelationType: REVELATION_TYPE[num] ?? 'Makki',
  }))
}

// Skeleton for loading state
function ReciterDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Skeleton className="h-6 w-24 mb-8 rounded-lg" />
      <div className="flex items-start gap-6 mb-10">
        <Skeleton className="w-20 h-20 rounded-2xl flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-8 w-2/3 mb-3 rounded-xl" />
          <Skeleton className="h-4 w-1/3 mb-2 rounded-lg" />
          <Skeleton className="h-4 w-1/4 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function ReciterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const reciterId = id ? parseInt(id, 10) : undefined

  const { data: reciter, isLoading, error } = useReciter(reciterId)

  const [selectedMoshafId, setSelectedMoshafId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDB(search, 280)

  const {
    currentTrack, isPlaying, isLoading: isAudioLoading,
    setCurrentTrack, setIsPlaying,
  } = useAudioStore()

  // Resolve active moshaf
  const activeMoshaf = useMemo(() => {
    if (!reciter) return null
    const id = selectedMoshafId ?? reciter.moshaf[0]?.id
    return reciter.moshaf.find((m) => m.id === id) ?? reciter.moshaf[0]
  }, [reciter, selectedMoshafId])

  // Build full track queue for active moshaf
  const allTracks = useMemo(() => {
    if (!activeMoshaf || !reciter) return []
    return buildTracks(activeMoshaf, reciter.name, reciter.id)
  }, [activeMoshaf, reciter])

  // Filter by search
  const filteredTracks = useMemo(() => {
    if (!debouncedSearch.trim()) return allTracks
    const q = debouncedSearch.toLowerCase()
    return allTracks.filter(
      (t) =>
        t.surahNameEn.toLowerCase().includes(q) ||
        t.surahNameAr.includes(q) ||
        String(t.surahNumber).includes(q)
    )
  }, [allTracks, debouncedSearch])

  // "Play All" — play first track with full queue
  const isQueueActive = currentTrack?.reciterId === reciterId && currentTrack?.moshafId === activeMoshaf?.id
  const handlePlayAll = () => {
    if (!allTracks.length) return
    if (isQueueActive) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(allTracks[0], allTracks, 0)
    }
  }

  if (isLoading) return <PageTransition><ReciterDetailSkeleton /></PageTransition>

  if (error || !reciter) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-xl font-semibold mb-2">Reciter not found</p>
          <p className="text-muted-foreground mb-6">We couldn't load this reciter's data.</p>
          <Button variant="outline" asChild>
            <Link to="/reciters"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Reciters</Link>
          </Button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      {/* Bg decoration */}
      <div className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <GeometricPattern
          className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-56 h-56 text-primary hidden md:block"
          opacity={0.06}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <Link
              to="/reciters"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Reciters
            </Link>
          </motion.div>

          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/25 to-gold-700/10 border border-gold-500/25 flex items-center justify-center flex-shrink-0 shadow-gold-sm">
              <span className="arabic text-3xl font-bold text-primary">
                {reciter.letter || reciter.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2 leading-tight">
                {reciter.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline">
                  <Headphones className="w-3 h-3 mr-1.5" />
                  {reciter.moshaf.length} {reciter.moshaf.length === 1 ? 'Riwaya' : 'Riwayat'}
                </Badge>
                <Badge variant="outline">
                  <List className="w-3 h-3 mr-1.5" />
                  {allTracks.length} Surahs
                </Badge>
              </div>

              {/* Moshaf selector */}
              <div className="flex flex-wrap gap-2">
                {reciter.moshaf.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMoshafId(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                      (selectedMoshafId ?? reciter.moshaf[0]?.id) === m.id
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Play all */}
            <Button
              variant="gold"
              size="lg"
              onClick={handlePlayAll}
              disabled={!allTracks.length}
              className="flex-shrink-0"
            >
              {isAudioLoading && isQueueActive ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isQueueActive && isPlaying ? (
                <Pause className="w-4 h-4 mr-2 fill-current" />
              ) : (
                <Play className="w-4 h-4 mr-2 fill-current" />
              )}
              {isQueueActive && isPlaying ? 'Pause All' : 'Play All'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Surah list */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & stats bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search surahs…"
            className="w-full sm:w-72"
          />
          <p className="text-xs text-muted-foreground flex-shrink-0">
            <BookOpen className="w-3 h-3 inline mr-1.5 -mt-0.5" />
            {filteredTracks.length} {filteredTracks.length === 1 ? 'surah' : 'surahs'}
          </p>
        </div>

        {/* List */}
        <div className="space-y-1">
          {filteredTracks.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-muted-foreground">No surahs match your search.</p>
            </div>
          ) : (
            filteredTracks.map((track, i) => (
              <SurahListItem
                key={`${track.surahNumber}-${track.moshafId}`}
                track={track}
                index={i}
                allTracks={filteredTracks}
              />
            ))
          )}
        </div>
      </div>
    </PageTransition>
  )
}
