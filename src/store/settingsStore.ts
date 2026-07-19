import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  displayName: string
  dailyGoalXp: number
  ttsRate: number
  newWordsPerDay: number
  setDisplayName: (name: string) => void
  setDailyGoalXp: (xp: number) => void
  setTtsRate: (rate: number) => void
  setNewWordsPerDay: (n: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      displayName: 'ผู้เรียน',
      dailyGoalXp: 50,
      ttsRate: 0.9,
      newWordsPerDay: 8,
      setDisplayName: (displayName) => set({ displayName }),
      setDailyGoalXp: (dailyGoalXp) => set({ dailyGoalXp }),
      setTtsRate: (ttsRate) => set({ ttsRate }),
      setNewWordsPerDay: (newWordsPerDay) => set({ newWordsPerDay }),
    }),
    { name: 'lingodaily-settings' },
  ),
)
