import { useEffect } from 'react'
import { useAudioStore } from '@/store/audioStore'
import { useUiStore } from '@/store/uiStore'

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const audio = useAudioStore.getState()
      const ui = useUiStore.getState()

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (audio.currentTrack) audio.setIsPlaying(!audio.isPlaying)
          break
        case 'ArrowRight':
          if (audio.currentTrack) audio.playNext()
          break
        case 'ArrowLeft':
          if (audio.currentTrack) audio.playPrev()
          break
        case 'ArrowUp':
          e.preventDefault()
          audio.setVolume(Math.min(1, audio.volume + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          audio.setVolume(Math.max(0, audio.volume - 0.1))
          break
        case 'm':
        case 'M':
          audio.toggleMute()
          break
        case 't':
        case 'T':
          ui.toggleTextPanel()
          break
        case 'Escape':
          if (ui.isTextPanelOpen) ui.setTextPanelOpen(false)
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
