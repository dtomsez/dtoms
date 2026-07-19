import type { Lang, VocabItem } from '../types/content'
import type { SrsCard } from '../types/progress'
import { getItem, unitsFor } from '../data/content'

/** คำที่ยังไม่เคยเรียน (ไม่มีการ์ด SRS) ตามลำดับหลักสูตร — สำหรับ "คำใหม่วันนี้" */
export function newItemsFor(lang: Lang, cards: Record<string, SrsCard>, limit: number): VocabItem[] {
  const result: VocabItem[] = []
  for (const unit of unitsFor(lang)) {
    for (const item of unit.items) {
      if (!cards[item.id]) {
        result.push(item)
        if (result.length >= limit) return result
      }
    }
  }
  return result
}

/** แปลง SRS card เป็น VocabItem (ข้ามคำที่หาไม่เจอในเนื้อหา) */
export function cardsToItems(cards: SrsCard[]): VocabItem[] {
  return cards.map((c) => getItem(c.itemId)).filter((it): it is VocabItem => Boolean(it))
}
