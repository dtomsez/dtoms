import type { BadgeDef, DailyStat, SrsCard } from '../types/progress'
import { currentStreak, matureCount } from '../store/progressStore'

export const BADGES: BadgeDef[] = [
  { id: 'streak7', title: '7 วันติด', description: 'ฝึกต่อเนื่อง 7 วัน', icon: '🔥' },
  { id: 'streak30', title: '30 วันติด', description: 'ฝึกต่อเนื่อง 30 วัน', icon: '⚡' },
  { id: 'streak100', title: '100 วันติด', description: 'ฝึกต่อเนื่อง 100 วัน', icon: '👑' },
  { id: 'words100', title: '100 คำ', description: 'จำคำศัพท์ได้ 100 คำ', icon: '📘' },
  { id: 'words500', title: '500 คำ', description: 'จำคำศัพท์ได้ 500 คำ', icon: '📚' },
  { id: 'words1000', title: '1000 คำ', description: 'จำคำศัพท์ได้ 1000 คำ', icon: '🎓' },
]

export function earnedBadges(
  cards: Record<string, SrsCard>,
  daily: Record<string, DailyStat>,
): Set<string> {
  const streak = currentStreak(daily)
  const words = matureCount(cards)
  const earned = new Set<string>()
  if (streak >= 7) earned.add('streak7')
  if (streak >= 30) earned.add('streak30')
  if (streak >= 100) earned.add('streak100')
  if (words >= 100) earned.add('words100')
  if (words >= 500) earned.add('words500')
  if (words >= 1000) earned.add('words1000')
  return earned
}
