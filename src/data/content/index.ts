import type { Lang, LevelPack, ReadingPassage, Unit, VocabItem } from '../../types/content'
import { enA1 } from './en-a1'
import { enA2 } from './en-a2'
import { zhHsk1 } from './zh-hsk1'
import { zhHsk2 } from './zh-hsk2'
import { readings } from './readings'

export const packs: LevelPack[] = [enA1, enA2, zhHsk1, zhHsk2]

export function packsFor(lang: Lang): LevelPack[] {
  return packs.filter((p) => p.lang === lang)
}

/** unit เรียงตามลำดับหลักสูตรของภาษานั้น (ปลดล็อกทีละบท) */
export function unitsFor(lang: Lang): Unit[] {
  return packsFor(lang).flatMap((p) => p.units)
}

const unitIndex = new Map<string, Unit>()
const itemIndex = new Map<string, VocabItem>()
for (const pack of packs) {
  for (const unit of pack.units) {
    unitIndex.set(unit.id, unit)
    for (const item of unit.items) itemIndex.set(item.id, item)
  }
}

export function getUnit(unitId: string): Unit | undefined {
  return unitIndex.get(unitId)
}

export function getItem(itemId: string): VocabItem | undefined {
  return itemIndex.get(itemId)
}

export function readingsFor(lang: Lang): ReadingPassage[] {
  return readings.filter((r) => r.lang === lang)
}

export function getReading(id: string): ReadingPassage | undefined {
  return readings.find((r) => r.id === id)
}

export const LANG_META: Record<Lang, { nameTh: string; flag: string; framework: string }> = {
  en: { nameTh: 'ภาษาอังกฤษ', flag: '🇬🇧', framework: 'CEFR' },
  zh: { nameTh: 'ภาษาจีน', flag: '🇨🇳', framework: 'HSK' },
}

export { readings }
