import type { DailyStat, SrsCard, UnitProgress } from '../types/progress'
import type { Lang } from '../types/content'

const OVERRIDE_KEY = 'lingodaily-sheets-url'

// URL ของ Apps Script Web App มาได้ 2 ทาง:
//  1) build-time env (VITE_SHEETS_API_URL) — สำหรับ dev หรือ self-host
//  2) runtime override ใน localStorage — ให้ผู้ใช้วาง URL เองบนเว็บที่ deploy แล้ว (ไม่ต้อง build ใหม่)
function readUrl(): string {
  const envUrl = (import.meta.env.VITE_SHEETS_API_URL as string | undefined)?.trim() ?? ''
  try {
    return (localStorage.getItem(OVERRIDE_KEY)?.trim() || envUrl) ?? ''
  } catch {
    return envUrl
  }
}

const url = readUrl()

/** ตั้งค่า Google Sheets เป็นฐานข้อมูลแล้วหรือยัง (มี URL ของ Apps Script Web App) */
export const sheetsConfigured = Boolean(url)

export function getSheetsUrl(): string {
  return url
}

/** บันทึก URL ที่ผู้ใช้วางเอง (ต้อง reload หน้าเพื่อให้มีผล) */
export function saveSheetsUrl(value: string): void {
  const v = value.trim()
  if (v) localStorage.setItem(OVERRIDE_KEY, v)
  else localStorage.removeItem(OVERRIDE_KEY)
}

export interface SheetsAuth {
  email: string
  token: string
}

interface ApiOk {
  ok: true
  [key: string]: unknown
}
interface ApiErr {
  ok: false
  error: string
}
type ApiResult = ApiOk | ApiErr

async function get(params: Record<string, string>): Promise<ApiResult> {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${url}?${qs}`, { method: 'GET', redirect: 'follow' })
  return (await res.json()) as ApiResult
}

async function post(body: Record<string, unknown>): Promise<ApiResult> {
  // ใช้ content-type text/plain เพื่อเลี่ยง CORS preflight ของ Apps Script
  const res = await fetch(url as string, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  })
  return (await res.json()) as ApiResult
}

const AUTH_ERR: Record<string, string> = {
  'invalid-input': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง (รหัสผ่านอย่างน้อย 6 ตัว)',
  'email-exists': 'อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน',
  'bad-credentials': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  unauthorized: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
}

function friendly(error: string): string {
  return AUTH_ERR[error] ?? `เกิดข้อผิดพลาด: ${error}`
}

export interface AuthOutcome {
  auth?: SheetsAuth
  error?: string
}

export async function sheetsRegister(email: string, password: string): Promise<AuthOutcome> {
  try {
    const r = await post({ action: 'register', email, password })
    if (r.ok) return { auth: { email: r.email as string, token: r.token as string } }
    return { error: friendly(r.error) }
  } catch {
    return { error: 'เชื่อมต่อ Google Sheets ไม่ได้ ตรวจสอบ URL และการเชื่อมต่ออินเทอร์เน็ต' }
  }
}

export async function sheetsLogin(email: string, password: string): Promise<AuthOutcome> {
  try {
    const r = await get({ action: 'login', email, password })
    if (r.ok) return { auth: { email: r.email as string, token: r.token as string } }
    return { error: friendly(r.error) }
  } catch {
    return { error: 'เชื่อมต่อ Google Sheets ไม่ได้ ตรวจสอบ URL และการเชื่อมต่ออินเทอร์เน็ต' }
  }
}

export interface SheetsSnapshot {
  cards: Record<string, SrsCard>
  units: Record<string, UnitProgress>
  daily: Record<string, DailyStat>
}

export async function sheetsPull(auth: SheetsAuth): Promise<SheetsSnapshot | null> {
  const r = await get({ action: 'pull', email: auth.email, token: auth.token })
  if (!r.ok) return null

  const cards: Record<string, SrsCard> = {}
  for (const row of (r.cards as Record<string, unknown>[]) ?? []) {
    const itemId = String(row.itemId)
    if (!itemId) continue
    cards[itemId] = {
      itemId,
      lang: row.lang as Lang,
      ease: Number(row.ease),
      intervalDays: Number(row.intervalDays),
      repetitions: Number(row.repetitions),
      lapses: Number(row.lapses),
      dueAt: String(row.dueAt),
      lastReviewedAt: row.lastReviewedAt ? String(row.lastReviewedAt) : null,
    }
  }
  const units: Record<string, UnitProgress> = {}
  for (const row of (r.units as Record<string, unknown>[]) ?? []) {
    const unitId = String(row.unitId)
    if (!unitId) continue
    units[unitId] = {
      unitId,
      status: row.status as UnitProgress['status'],
      bestScore: Number(row.bestScore),
      completedAt: row.completedAt ? String(row.completedAt) : null,
    }
  }
  const daily: Record<string, DailyStat> = {}
  for (const row of (r.daily as Record<string, unknown>[]) ?? []) {
    const date = String(row.date)
    if (!date) continue
    daily[date] = {
      date,
      xp: Number(row.xp),
      reviewsDone: Number(row.reviewsDone),
      newItems: Number(row.newItems),
      minutes: Number(row.minutes),
    }
  }
  return { cards, units, daily }
}

export async function sheetsPush(auth: SheetsAuth, snapshot: SheetsSnapshot): Promise<boolean> {
  try {
    const r = await post({
      action: 'push',
      email: auth.email,
      token: auth.token,
      cards: Object.values(snapshot.cards),
      units: Object.values(snapshot.units),
      daily: Object.values(snapshot.daily),
    })
    return r.ok
  } catch {
    return false
  }
}
