import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { sheetsConfigured, sheetsLogin, sheetsRegister, type SheetsAuth } from '../lib/sheets'

export type AuthStatus = 'loading' | 'signedout' | 'guest' | 'authed'
export type AuthProvider = 'sheets' | 'supabase' | 'none'

interface AuthState {
  status: AuthStatus
  provider: AuthProvider
  userId: string | null
  email: string | null
  token: string | null
  init: () => Promise<void>
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  continueAsGuest: () => void
}

const GUEST_KEY = 'lingodaily-guest'
const SHEETS_SESSION_KEY = 'lingodaily-sheets-session'

// เลือก backend: Google Sheets มาก่อน แล้วค่อย Supabase ถ้าไม่ตั้งค่าทั้งคู่ = guest เท่านั้น
const PROVIDER: AuthProvider = sheetsConfigured ? 'sheets' : supabase ? 'supabase' : 'none'

function loadSheetsSession(): SheetsAuth | null {
  try {
    const raw = localStorage.getItem(SHEETS_SESSION_KEY)
    return raw ? (JSON.parse(raw) as SheetsAuth) : null
  } catch {
    return null
  }
}

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
  provider: PROVIDER,
  userId: null,
  email: null,
  token: null,

  init: async () => {
    const wasGuest = () => localStorage.getItem(GUEST_KEY) === '1'

    if (PROVIDER === 'sheets') {
      const session = loadSheetsSession()
      if (session) {
        set({ status: 'authed', userId: session.email, email: session.email, token: session.token })
      } else {
        set({ status: wasGuest() ? 'guest' : 'signedout' })
      }
      return
    }

    if (PROVIDER === 'supabase' && supabase) {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        set({ status: 'authed', userId: data.session.user.id, email: data.session.user.email ?? null })
      } else {
        set({ status: wasGuest() ? 'guest' : 'signedout' })
      }
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          set({ status: 'authed', userId: session.user.id, email: session.user.email ?? null })
        } else if (!wasGuest()) {
          set({ status: 'signedout', userId: null, email: null })
        }
      })
      return
    }

    // ไม่มี backend → guest mode อย่างเดียว
    set({ status: wasGuest() ? 'guest' : 'signedout', userId: null, email: null })
  },

  signIn: async (email, password) => {
    if (PROVIDER === 'sheets') {
      const { auth, error } = await sheetsLogin(email, password)
      if (error || !auth) return error ?? 'เข้าสู่ระบบไม่สำเร็จ'
      localStorage.setItem(SHEETS_SESSION_KEY, JSON.stringify(auth))
      localStorage.removeItem(GUEST_KEY)
      set({ status: 'authed', userId: auth.email, email: auth.email, token: auth.token })
      return null
    }
    if (PROVIDER === 'supabase' && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return translateError(error.message)
      localStorage.removeItem(GUEST_KEY)
      return null
    }
    return 'ยังไม่ได้ตั้งค่าฐานข้อมูล (ดูวิธีใน README) — ใช้โหมด Guest ได้เลย'
  },

  signUp: async (email, password) => {
    if (PROVIDER === 'sheets') {
      const { auth, error } = await sheetsRegister(email, password)
      if (error || !auth) return error ?? 'สมัครไม่สำเร็จ'
      localStorage.setItem(SHEETS_SESSION_KEY, JSON.stringify(auth))
      localStorage.removeItem(GUEST_KEY)
      set({ status: 'authed', userId: auth.email, email: auth.email, token: auth.token })
      return null
    }
    if (PROVIDER === 'supabase' && supabase) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) return translateError(error.message)
      localStorage.removeItem(GUEST_KEY)
      return null
    }
    return 'ยังไม่ได้ตั้งค่าฐานข้อมูล (ดูวิธีใน README) — ใช้โหมด Guest ได้เลย'
  },

  signOut: async () => {
    localStorage.removeItem(GUEST_KEY)
    localStorage.removeItem(SHEETS_SESSION_KEY)
    if (PROVIDER === 'supabase' && supabase) await supabase.auth.signOut()
    set({ status: 'signedout', userId: null, email: null, token: null })
  },

  continueAsGuest: () => {
    localStorage.setItem(GUEST_KEY, '1')
    set({ status: 'guest', userId: null, email: null, token: null })
  },
}))
