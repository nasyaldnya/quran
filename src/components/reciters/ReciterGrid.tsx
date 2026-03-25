import { Skeleton } from '@/components/ui/skeleton'
import ReciterCard from './ReciterCard'
import { useT } from '@/lib/i18n'
import type { Reciter } from '@/types/api'

interface ReciterGridProps {
  reciters:  Reciter[]
  isLoading: boolean
  error?:    Error | null
}

function ReciterSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
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
  )
}

export default function ReciterGrid({ reciters, isLoading, error }: ReciterGridProps) {
  const t = useT()

  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-lg font-semibold text-foreground mb-1">{t.failed_load_reciters}</p>
        <p className="text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => <ReciterSkeleton key={i} />)}
      </div>
    )
  }

  if (!reciters.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-lg font-semibold text-foreground mb-1">{t.no_reciters_found}</p>
        <p className="text-sm text-muted-foreground">Try adjusting your search query.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {reciters.map((r, i) => (
        <ReciterCard key={r.id} reciter={r} index={i} />
      ))}
    </div>
  )
}
