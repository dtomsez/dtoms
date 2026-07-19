import type { Lang } from '../types/content'
import type { Grade, SrsCard } from '../types/progress'

export const INITIAL_EASE = 2.5
const MIN_EASE = 1.3
/** ตอบผิด → เจอการ์ดใหม่อีกครั้งใน 10 นาที (ภายใน session เดียวกัน) */
const RELEARN_MINUTES = 10

export function newCard(itemId: string, lang: Lang, now: Date = new Date()): SrsCard {
  return {
    itemId,
    lang,
    ease: INITIAL_EASE,
    intervalDays: 0,
    repetitions: 0,
    lapses: 0,
    dueAt: now.toISOString(),
    lastReviewedAt: null,
  }
}

/**
 * SM-2 scheduling: คืนการ์ดใหม่หลังให้คะแนนคำตอบ
 * grade 0 = ลืม (เริ่มนับใหม่), 3/4/5 = ตอบได้ในระดับ ยาก/พอได้/ง่าย
 */
export function schedule(card: SrsCard, grade: Grade, now: Date = new Date()): SrsCard {
  const next = { ...card, lastReviewedAt: now.toISOString() }

  if (grade < 3) {
    next.repetitions = 0
    next.intervalDays = 0
    next.lapses = card.lapses + 1
    next.ease = Math.max(MIN_EASE, card.ease - 0.2)
    next.dueAt = new Date(now.getTime() + RELEARN_MINUTES * 60_000).toISOString()
    return next
  }

  const q = grade
  next.ease = Math.max(
    MIN_EASE,
    card.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  )
  next.repetitions = card.repetitions + 1

  if (next.repetitions === 1) {
    next.intervalDays = 1
  } else if (next.repetitions === 2) {
    next.intervalDays = 6
  } else {
    next.intervalDays = Math.round(card.intervalDays * next.ease)
  }
  next.dueAt = new Date(now.getTime() + next.intervalDays * 86_400_000).toISOString()
  return next
}

export function isDue(card: SrsCard, now: Date = new Date()): boolean {
  return new Date(card.dueAt).getTime() <= now.getTime()
}
