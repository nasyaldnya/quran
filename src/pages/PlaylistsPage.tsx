import { useState } from 'react'
import { motion } from 'framer-motion'
import { ListMusic, Plus, Trash2, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/common/PageTransition'
import GeometricPattern from '@/components/common/GeometricPattern'
import { usePlaylistStore, type Playlist } from '@/store/playlistStore'
import { useAudioStore } from '@/store/audioStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function PlaylistsPage() {
  const t = useT()
  const { playlists, createPlaylist, deletePlaylist } = usePlaylistStore()
  const { setCurrentTrack, currentTrack, isPlaying, setIsPlaying } = useAudioStore()
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    if (!newName.trim()) return
    createPlaylist(newName.trim())
    setNewName('')
  }

  const playPlaylist = (pl: Playlist) => {
    if (!pl.tracks.length) return
    const isThisPlaying = currentTrack?.audioUrl === pl.tracks[0].audioUrl && isPlaying
    if (isThisPlaying) { setIsPlaying(false); return }
    setCurrentTrack(pl.tracks[0], pl.tracks, 0)
  }

  return (
    <PageTransition>
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/60 to-transparent">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <GeometricPattern className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-primary hidden lg:block" opacity={0.05} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <ListMusic className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">{t.playlists_label}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">{t.playlists_title}</h1>
            <p className="text-muted-foreground max-w-lg">{t.playlists_subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Create new */}
        <div className="flex gap-2 mb-8">
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder={t.playlist_new_placeholder}
            className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          <Button onClick={handleCreate} disabled={!newName.trim()}>
            <Plus className="w-4 h-4 mr-1.5" />{t.playlist_create}
          </Button>
        </div>

        {playlists.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ListMusic className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">{t.playlists_empty}</p>
            <p className="text-sm text-muted-foreground">{t.playlists_empty_desc}</p>
          </div>
        )}

        <div className="space-y-3">
          {playlists.map((pl, i) => (
            <motion.div key={pl.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-all">
                <button onClick={() => playPlaylist(pl)}
                  className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                    pl.tracks.length > 0 ? 'bg-primary/10 hover:bg-primary/20' : 'bg-muted')}>
                  {currentTrack && pl.tracks.some(t => t.audioUrl === currentTrack.audioUrl) && isPlaying
                    ? <Pause className="w-4 h-4 text-primary fill-current" />
                    : <Play className="w-4 h-4 text-primary fill-current ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{pl.name}</p>
                  <p className="text-xs text-muted-foreground">{pl.tracks.length} {t.surahs_word}</p>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => deletePlaylist(pl.id)}
                  className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
