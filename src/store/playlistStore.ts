import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track } from '@/types/api'

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
  createdAt: number
}

interface PlaylistState {
  playlists: Playlist[]
  createPlaylist: (name: string) => string
  deletePlaylist: (id: string) => void
  renamePlaylist: (id: string, name: string) => void
  addTrack: (playlistId: string, track: Track) => void
  removeTrack: (playlistId: string, audioUrl: string) => void
  reorderTracks: (playlistId: string, tracks: Track[]) => void
  getPlaylist: (id: string) => Playlist | undefined
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],

      createPlaylist: (name) => {
        const id = `pl_${Date.now()}`
        set((s) => ({
          playlists: [...s.playlists, { id, name, tracks: [], createdAt: Date.now() }],
        }))
        return id
      },

      deletePlaylist: (id) =>
        set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),

      renamePlaylist: (id, name) =>
        set((s) => ({
          playlists: s.playlists.map((p) => (p.id === id ? { ...p, name } : p)),
        })),

      addTrack: (playlistId, track) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId && !p.tracks.some((t) => t.audioUrl === track.audioUrl)
              ? { ...p, tracks: [...p.tracks, track] }
              : p
          ),
        })),

      removeTrack: (playlistId, audioUrl) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.filter((t) => t.audioUrl !== audioUrl) }
              : p
          ),
        })),

      reorderTracks: (playlistId, tracks) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId ? { ...p, tracks } : p
          ),
        })),

      getPlaylist: (id) => get().playlists.find((p) => p.id === id),
    }),
    { name: 'quran-playlists' }
  )
)
