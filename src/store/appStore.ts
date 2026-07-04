import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BirthInfo } from '../lib/bazi'
import type { ChatMessage } from '../lib/sesheta'

export type ModuleKey = 'bazi' | 'tongshu' | 'qimen' | 'sesheta' | 'numerology'

interface AppState {
  user: { name: string; email: string } | null
  birth: BirthInfo | null
  module: ModuleKey
  chat: ChatMessage[]
  timingChat: ChatMessage[]
  login: (name: string, email: string) => void
  logout: () => void
  setBirth: (b: BirthInfo) => void
  setModule: (m: ModuleKey) => void
  pushChat: (m: ChatMessage) => void
  pushTimingChat: (m: ChatMessage) => void
  clearChat: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      birth: null,
      module: 'bazi',
      chat: [],
      timingChat: [],
      login: (name, email) => set({ user: { name, email } }),
      logout: () => set({ user: null }),
      setBirth: (birth) => set({ birth }),
      setModule: (module) => set({ module }),
      pushChat: (m) => set(s => ({ chat: [...s.chat, m] })),
      pushTimingChat: (m) => set(s => ({ timingChat: [...s.timingChat, m] })),
      clearChat: () => set({ chat: [], timingChat: [] }),
    }),
    { name: 'sesheta-app' },
  ),
)
