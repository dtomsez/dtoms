import type { Lang } from './content'

/** SM-2 quality grade: 0 = ลืม, 3 = ยาก, 4 = พอได้, 5 = ง่าย */
export type Grade = 0 | 3 | 4 | 5

export interface SrsCard {
  itemId: string
  lang: Lang
  ease: number
  intervalDays: number
  repetitions: number
  lapses: number
  dueAt: string
  lastReviewedAt: string | null
}

export type UnitStatus = 'in_progress' | 'completed'

export interface UnitProgress {
  unitId: string
  status: UnitStatus
  bestScore: number
  completedAt: string | null
}

export interface DailyStat {
  date: string
  xp: number
  reviewsDone: number
  newItems: number
  minutes: number
}

export interface BadgeDef {
  id: string
  title: string
  description: string
  icon: string
}
