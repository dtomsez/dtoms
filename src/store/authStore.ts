import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export type AuthStatus = 'loading' | 'signedout' | 'guest' | 'authed'

interface AuthState {
  status: AuthStatus
  userId: string | null
  email: string | null
  init: () => Promise<void>
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  continueAsGuest: () => void
}

const GUEST_KEY = 'lingodaily-guest'

function translateError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  if (/already registered/i.test(message)) return 'อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน'
  if (/at least 6 characters/i.test(message)) return 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'
  if (/valid email/i.test(message)) return 'รูปแบบอีเมลไม่ถูกต้อง'
  if (/rate limit/i.test(message)) return 'ลองใหม่อีกครั้งในอีกสักครู่'
  return `เกิดข้อผิดพลาด: ${message}`
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  userId: null,
  email: null,

  init: async () => {
    if (!supabase) {
      // ไม่ได้ตั้งค่า Supabase → ใช้ guest mode ได้อย่างเดียว
      const wasGuest = localStorage.getItem(GUEST_KEY) === '1'
      set({ status: wasGuest ? 'guest' : 'signedout', userId: null, email: null })
      return
    }
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      set({ status: 'authed', userId: data.session.user.id, email: data.session.user.email ?? null })
    } else {
      const wasGuest = localStorage.getItem(GUEST_KEY) === '1'
      set({ status: wasGuest ? 'guest' : 'signedout' })
    }
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ status: 'authed', userId: session.user.id, email: session.user.email ?? null })
      } else if (localStorage.getItem(GUEST_KEY) !== '1') {
        set({ status: 'signedout', userId: null, email: null })
      }
    })
  },

  signIn: async (email, password) => {
    if (!supabase) return 'ยังไม่ได้ตั้งค่า Supabase (ดูวิธีใน README) — ใช้โหมด Guest ได้เลย'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return translateError(error.message)
    localStorage.removeItem(GUEST_KEY)
    return null
  },

  signUp: async (email, password) => {
    if (!supabase) return 'ยังไม่ได้ตั้งค่า Supabase (ดูวิธีใน README) — ใช้โหมด Guest ได้เลย'
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return translateError(error.message)
    localStorage.removeItem(GUEST_KEY)
    return null
  },

  signOut: async () => {
    localStorage.removeItem(GUEST_KEY)
    if (supabase) await supabase.auth.signOut()
    set({ status: 'signedout', userId: null, email: null })
  },

  continueAsGuest: () => {
    localStorage.setItem(GUEST_KEY, '1')
    set({ status: 'guest', userId: null, email: null })
  },
}))
