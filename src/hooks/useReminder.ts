import { useEffect, useCallback } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReminderState {
  enabled: boolean
  hour: number // 0-23
  minute: number
  setEnabled: (v: boolean) => void
  setTime: (hour: number, minute: number) => void
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      enabled: false,
      hour: 7,
      minute: 0,
      setEnabled: (v) => set({ enabled: v }),
      setTime: (hour, minute) => set({ hour, minute }),
    }),
    { name: 'quran-reminder' }
  )
)

export function useReminder() {
  const { enabled, hour, minute } = useReminderStore()

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  useEffect(() => {
    if (!enabled) return
    if (!('Notification' in window)) return

    const check = () => {
      const now = new Date()
      if (now.getHours() === hour && now.getMinutes() === minute) {
        if (Notification.permission === 'granted') {
          new Notification('القرآن الكريم', {
            body: 'حان وقت قراءة القرآن الكريم 📖',
            icon: '/icons/favicon.svg',
          })
        }
      }
    }

    const interval = setInterval(check, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [enabled, hour, minute])

  return { requestPermission }
}
