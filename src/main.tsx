import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { queryClient } from './lib/queryClient'
import { useAudioStore } from '@/store/audioStore'
import { useHistoryStore } from '@/store/historyStore'
import './index.css'

// Auto-log to listening history whenever a new track starts
useAudioStore.subscribe((state, prevState) => {
  if (
    state.currentTrack &&
    state.currentTrack.audioUrl !== prevState.currentTrack?.audioUrl
  ) {
    useHistoryStore.getState().addEntry(state.currentTrack)
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
