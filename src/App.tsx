import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AudioPlayer from '@/components/layout/AudioPlayer'
import QuranTextPanel from '@/components/layout/QuranTextPanel'
import HomePage from '@/pages/HomePage'
import RecitersPage from '@/pages/RecitersPage'
import ReciterDetailPage from '@/pages/ReciterDetailPage'
import SurahsPage from '@/pages/SurahsPage'
import FavoritesPage from '@/pages/FavoritesPage'
import HistoryPage from '@/pages/HistoryPage'

export default function App() {
  const location = useLocation()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="quran-ui-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 pb-28">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/"               element={<HomePage />} />
              <Route path="/reciters"        element={<RecitersPage />} />
              <Route path="/reciters/:id"    element={<ReciterDetailPage />} />
              <Route path="/surahs"          element={<SurahsPage />} />
              <Route path="/favorites"       element={<FavoritesPage />} />
              <Route path="/history"         element={<HistoryPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <AudioPlayer />
        <QuranTextPanel />
      </div>
    </ThemeProvider>
  )
}
