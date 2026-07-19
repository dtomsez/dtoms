import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format, subDays } from 'date-fns'
import type { Lang } from '../types/content'
import type { DailyStat, Grade, SrsCard, UnitProgress } from '../types/progress'
import { isDue, newCard, schedule } from '../lib/srs'
import { supabase } from '../lib/supabase'
import { sheetsPull, sheetsPush, type SheetsAuth } from '../lib/sheets'
import { useAuthStore } from './authStore'

interface StatDelta {
  xp?: number
  reviewsDone?: number
  newItems?: number
  minutes?: number
}

interface ProgressState {
  cards: Record<string, SrsCard>
  units: Record<string, UnitProgress>
  daily: Record<string, DailyStat>
  ensureCards: (items: { id: string; lang: Lang }[]) => number
  gradeCard: (itemId: string, lang: Lang, grade: Grade) => void
  startUnit: (unitId: string) => void
  completeUnit: (unitId: string, score: number) => void
  addStat: (delta: StatDelta) => void
  pullFromServer: () => Promise<void>
  resetAll: () => void
  importData: (data: Pick<ProgressState, 'cards' | 'units' | 'daily'>) => void
}

export function todayKey(now: Date = new Date()): string {
  return format(now, 'yyyy-MM-dd')
}

function userId(): string | null {
  const auth = useAuthStore.getState()
  return auth.status === 'authed' ? auth.userId : null
}

function sheetsAuth(): SheetsAuth | null {
  const auth = useAuthStore.getState()
  if (auth.provider === 'sheets' && auth.status === 'authed' && auth.userId && auth.token) {
    return { email: auth.userId, token: auth.token }
  }
  return null
}

// Google Sheets: sync ทั้งชุดแบบ debounced (รวมหลายการเปลี่ยนแปลงเป็นคำขอเดียว)
let syncTimer: ReturnType<typeof setTimeout> | undefined
let syncing = false
let syncAgain = false

async function flushSheetsSync(): Promise<void> {
  const auth = sheetsAuth()
  if (!auth) return
  if (syncing) {
    syncAgain = true
    return
  }
  syncing = true
  try {
    const { cards, units, daily } = useProgressStore.getState()
    await sheetsPush(auth, { cards, units, daily })
  } finally {
    syncing = false
    if (syncAgain) {
      syncAgain = false
      void flushSheetsSync()
    }
  }
}

function scheduleSync(): void {
  if (!sheetsAuth()) return
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => void flushSheetsSync(), 2500)
}

if (typeof window !== 'undefined') {
  // บันทึกทันทีก่อนปิด/สลับแท็บ กันข้อมูลรอบล่าสุดหาย
  const flushNow = () => {
    if (syncTimer) clearTimeout(syncTimer)
    void flushSheetsSync()
  }
  window.addEventListener('pagehide', flushNow)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushNow()
  })
}

function pushCard(card: SrsCard): void {
  const uid = userId()
  if (!supabase || !uid) return
  void supabase.from('srs_progress').upsert({
    user_id: uid,
    item_id: card.itemId,
    lang: card.lang,
    ease: card.ease,
    interval_days: card.intervalDays,
    repetitions: card.repetitions,
    lapses: card.lapses,
    due_at: card.dueAt,
    last_reviewed_at: card.lastReviewedAt,
  })
}

function pushUnit(unit: UnitProgress): void {
  const uid = userId()
  if (!supabase || !uid) return
  void supabase.from('unit_progress').upsert({
    user_id: uid,
    unit_id: unit.unitId,
    status: unit.status,
    best_score: unit.bestScore,
    completed_at: unit.completedAt,
  })
}

function pushDaily(stat: DailyStat): void {
  const uid = userId()
  if (!supabase || !uid) return
  void supabase.from('daily_stats').upsert({
    user_id: uid,
    date: stat.date,
    xp: stat.xp,
    reviews_done: stat.reviewsDone,
    new_items: stat.newItems,
    minutes: stat.minutes,
  })
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      cards: {},
      units: {},
      daily: {},

      ensureCards: (items) => {
        const { cards } = get()
        const fresh = items.filter((it) => !cards[it.id])
        if (fresh.length === 0) return 0
        const added: Record<string, SrsCard> = {}
        for (const it of fresh) {
          const card = newCard(it.id, it.lang)
          added[it.id] = card
          pushCard(card)
        }
        set({ cards: { ...cards, ...added } })
        scheduleSync()
        return fresh.length
      },

      gradeCard: (itemId, lang, grade) => {
        const { cards } = get()
        const card = cards[itemId] ?? newCard(itemId, lang)
        const next = schedule(card, grade)
        set({ cards: { ...cards, [itemId]: next } })
        pushCard(next)
        get().addStat({ reviewsDone: 1, xp: grade >= 3 ? 2 : 1 })
        scheduleSync()
      },

      startUnit: (unitId) => {
        const { units } = get()
        if (units[unitId]) return
        const unit: UnitProgress = { unitId, status: 'in_progress', bestScore: 0, completedAt: null }
        set({ units: { ...units, [unitId]: unit } })
        pushUnit(unit)
        scheduleSync()
      },

      completeUnit: (unitId, score) => {
        const { units } = get()
        const prev = units[unitId]
        const unit: UnitProgress = {
          unitId,
          status: 'completed',
          bestScore: Math.max(prev?.bestScore ?? 0, score),
          completedAt: prev?.completedAt ?? new Date().toISOString(),
        }
        set({ units: { ...units, [unitId]: unit } })
        pushUnit(unit)
        scheduleSync()
      },

      addStat: (delta) => {
        const key = todayKey()
        const { daily } = get()
        const prev = daily[key] ?? { date: key, xp: 0, reviewsDone: 0, newItems: 0, minutes: 0 }
        const stat: DailyStat = {
          date: key,
          xp: prev.xp + (delta.xp ?? 0),
          reviewsDone: prev.reviewsDone + (delta.reviewsDone ?? 0),
          newItems: prev.newItems + (delta.newItems ?? 0),
          minutes: prev.minutes + (delta.minutes ?? 0),
        }
        set({ daily: { ...daily, [key]: stat } })
        pushDaily(stat)
        scheduleSync()
      },

      pullFromServer: async () => {
        // Google Sheets backend: ดึงข้อมูลแล้ว merge แบบ recency-wins
        const sheets = sheetsAuth()
        if (sheets) {
          const remote = await sheetsPull(sheets)
          if (!remote) return
          const state = get()
          const cards = { ...state.cards }
          for (const [id, server] of Object.entries(remote.cards)) {
            const local = cards[id]
            const serverTime = server.lastReviewedAt ? Date.parse(server.lastReviewedAt) : 0
            const localTime = local?.lastReviewedAt ? Date.parse(local.lastReviewedAt) : -1
            if (!local || serverTime >= localTime) cards[id] = server
          }
          const units = { ...state.units }
          for (const [id, server] of Object.entries(remote.units)) {
            const local = units[id]
            if (!local || (server.status === 'completed' && local.status !== 'completed')) units[id] = server
          }
          const daily = { ...state.daily }
          for (const [date, server] of Object.entries(remote.daily)) {
            const local = daily[date]
            if (!local || server.xp >= local.xp) daily[date] = server
          }
          set({ cards, units, daily })
          // เขียนผลรวมที่ merge แล้วกลับขึ้น Sheets (กันข้อมูลฝั่ง local ที่ยังไม่ถูก sync)
          scheduleSync()
          return
        }

        const uid = userId()
        if (!supabase || !uid) return
        const [cardsRes, unitsRes, dailyRes] = await Promise.all([
          supabase.from('srs_progress').select('*').eq('user_id', uid),
          supabase.from('unit_progress').select('*').eq('user_id', uid),
          supabase.from('daily_stats').select('*').eq('user_id', uid),
        ])
        const state = get()
        const cards = { ...state.cards }
        for (const row of cardsRes.data ?? []) {
          const local = cards[row.item_id]
          const serverTime = row.last_reviewed_at ? Date.parse(row.last_reviewed_at) : 0
          const localTime = local?.lastReviewedAt ? Date.parse(local.lastReviewedAt) : -1
          if (!local || serverTime >= localTime) {
            cards[row.item_id] = {
              itemId: row.item_id,
              lang: row.lang,
              ease: row.ease,
              intervalDays: row.interval_days,
              repetitions: row.repetitions,
              lapses: row.lapses,
              dueAt: row.due_at,
              lastReviewedAt: row.last_reviewed_at,
            }
          }
        }
        const units = { ...state.units }
        for (const row of unitsRes.data ?? []) {
          const local = units[row.unit_id]
          if (!local || (row.status === 'completed' && local.status !== 'completed')) {
            units[row.unit_id] = {
              unitId: row.unit_id,
              status: row.status,
              bestScore: row.best_score,
              completedAt: row.completed_at,
            }
          }
        }
        const daily = { ...state.daily }
        for (const row of dailyRes.data ?? []) {
          const local = daily[row.date]
          const server: DailyStat = {
            date: row.date,
            xp: row.xp,
            reviewsDone: row.reviews_done,
            newItems: row.new_items,
            minutes: row.minutes,
          }
          if (!local || server.xp >= local.xp) daily[row.date] = server
        }
        set({ cards, units, daily })
      },

      resetAll: () => set({ cards: {}, units: {}, daily: {} }),

      importData: (data) => set({ cards: data.cards, units: data.units, daily: data.daily }),
    }),
    { name: 'lingodaily-progress' },
  ),
)

// ---------- selectors ----------

export function dueCards(cards: Record<string, SrsCard>, lang?: Lang, now: Date = new Date()): SrsCard[] {
  return Object.values(cards)
    .filter((c) => (!lang || c.lang === lang) && isDue(c, now))
    .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt))
}

export function totalXp(daily: Record<string, DailyStat>): number {
  return Object.values(daily).reduce((sum, d) => sum + d.xp, 0)
}

/** จำนวนวันติดต่อกันที่ฝึก (นับถึงวันนี้ หรือเมื่อวานถ้าวันนี้ยังไม่ได้ฝึก) */
export function currentStreak(daily: Record<string, DailyStat>, now: Date = new Date()): number {
  let streak = 0
  let day = now
  if (!daily[todayKey(now)]?.xp) {
    day = subDays(now, 1)
  }
  while (daily[todayKey(day)]?.xp) {
    streak++
    day = subDays(day, 1)
  }
  return streak
}

/** คำที่ถือว่า "จำได้แล้ว" = ทบทวนจนรอบเว้นยาว ≥ 21 วัน */
export function matureCount(cards: Record<string, SrsCard>, lang?: Lang): number {
  return Object.values(cards).filter((c) => (!lang || c.lang === lang) && c.intervalDays >= 21).length
}

export function learningCount(cards: Record<string, SrsCard>, lang?: Lang): number {
  return Object.values(cards).filter((c) => (!lang || c.lang === lang) && c.repetitions > 0 && c.intervalDays < 21)
    .length
}
