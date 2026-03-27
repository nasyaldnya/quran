import { useEffect, useState } from 'react'
import { useAudioStore } from '@/store/audioStore'

export default function LiveRegion() {
  const [message, setMessage] = useState('')
  const currentTrack = useAudioStore((s) => s.currentTrack)
  const isPlaying = useAudioStore((s) => s.isPlaying)

  useEffect(() => {
    if (currentTrack) {
      const action = isPlaying ? 'Now playing' : 'Paused'
      setMessage(`${action}: ${currentTrack.surahNameEn} by ${currentTrack.reciterName}`)
    }
  }, [currentTrack?.audioUrl, isPlaying])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}
