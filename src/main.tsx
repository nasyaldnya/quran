import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { queryClient } from './lib/queryClient'
import { useAudioStore } from '@/store/audioStore'
import { useHistoryStore } from '@/store/historyStore'
import { useUiStore } from '@/store/uiStore'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { useProgressStore } from '@/store/progressStore'
import './index.css'

// Auto-log to listening history whenever a new track starts
useAudioStore.subscribe((state, prevState) => {
  if (
    state.currentTrack &&
    state.currentTrack.audioUrl !== prevState.currentTrack?.audioUrl
  ) {
    useHistoryStore.getState().addEntry(state.currentTrack)
    useUiStore.getState().setViewingSurahNumber(null)

    // Log analytics for the PREVIOUS track (it finished or was skipped)
    if (prevState.currentTrack && prevState.duration > 0) {
      const listenedSeconds = Math.floor(prevState.currentTime)
      if (listenedSeconds > 10) {
        useAnalyticsStore.getState().logPlay(prevState.currentTrack.surahNumber, listenedSeconds)
      }
      // Mark as fully listened if played > 90%
      if (prevState.currentTime / prevState.duration > 0.9) {
        useProgressStore.getState().markListened(prevState.currentTrack.surahNumber)
      }
    }
  }
})

// Auto-open Quran text panel when a new track starts playing
useAudioStore.subscribe((state, prevState) => {
  if (
    state.currentTrack &&
    state.currentTrack.audioUrl !== prevState.currentTrack?.audioUrl
  ) {
    useUiStore.getState().setTextPanelOpen(true)
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <App />
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
