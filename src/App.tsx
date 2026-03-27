import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AudioPlayer from '@/components/layout/AudioPlayer'
import QuranTextPanel from '@/components/layout/QuranTextPanel'
import SkipToContent from '@/components/common/SkipToContent'
import LiveRegion from '@/components/common/LiveRegion'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

// Feature 17: Lazy route splitting — only HomePage loads eagerly
import HomePage from '@/pages/HomePage'

const RecitersPage     = lazy(() => import('@/pages/RecitersPage'))
const ReciterDetailPage = lazy(() => import('@/pages/ReciterDetailPage'))
const SurahsPage       = lazy(() => import('@/pages/SurahsPage'))
const FavoritesPage    = lazy(() => import('@/pages/FavoritesPage'))
const HistoryPage      = lazy(() => import('@/pages/HistoryPage'))
const BookmarksPage    = lazy(() => import('@/pages/BookmarksPage'))
const JuzPage          = lazy(() => import('@/pages/JuzPage'))
const SearchPage       = lazy(() => import('@/pages/SearchPage'))
const PlaylistsPage    = lazy(() => import('@/pages/PlaylistsPage'))
const ComparePage      = lazy(() => import('@/pages/ComparePage'))
const StatsPage        = lazy(() => import('@/pages/StatsPage'))
const MushafPage       = lazy(() => import('@/pages/MushafPage'))
const QuranEditionsPage = lazy(() => import('@/pages/QuranEditionsPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  useKeyboardShortcuts()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="quran-ui-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <SkipToContent />
        <Navbar />
        <main id="main-content" className="flex-1 pb-28" role="main" tabIndex={-1}>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route path="/"               element={<HomePage />} />
                <Route path="/reciters"        element={<RecitersPage />} />
                <Route path="/reciters/:id"    element={<ReciterDetailPage />} />
                <Route path="/surahs"          element={<SurahsPage />} />
                <Route path="/favorites"       element={<FavoritesPage />} />
                <Route path="/history"         element={<HistoryPage />} />
                <Route path="/bookmarks"       element={<BookmarksPage />} />
                <Route path="/juz"             element={<JuzPage />} />
                <Route path="/search"          element={<SearchPage />} />
                <Route path="/playlists"       element={<PlaylistsPage />} />
                <Route path="/compare"         element={<ComparePage />} />
                <Route path="/stats"           element={<StatsPage />} />
              <Route path="/mushaf"          element={<MushafPage />} />
              <Route path="/editions"       element={<QuranEditionsPage />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        <Footer />
        <AudioPlayer />
        <QuranTextPanel />
        <LiveRegion />
      </div>
    </ThemeProvider>
  )
}
