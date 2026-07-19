import type { LevelPack, Unit, VocabItem } from '../../types/content'

/** [headword, pos, meaningTh, example, exampleTh] */
export type EnRow = [string, string, string, string, string]
/** [hanzi, pinyin, pos, meaningTh, example, examplePinyin, exampleTh] */
export type ZhRow = [string, string, string, string, string, string, string]

export interface UnitSpec<Row> {
  title: string
  titleTh: string
  grammarNote?: string
  rows: Row[]
}

export function buildEnPack(
  level: string,
  name: string,
  description: string,
  unitSpecs: UnitSpec<EnRow>[],
): LevelPack {
  const units: Unit[] = unitSpecs.map((spec, i) => {
    const unitId = `en-${level.toLowerCase()}-u${i + 1}`
    const items: VocabItem[] = spec.rows.map(([headword, pos, meaningTh, ex, exTh], j) => ({
      id: `${unitId}-${j + 1}`,
      lang: 'en',
      level,
      unitId,
      headword,
      pos,
      meaningTh,
      examples: [{ text: ex, translationTh: exTh }],
    }))
    return {
      id: unitId,
      lang: 'en',
      level,
      index: i + 1,
      title: spec.title,
      titleTh: spec.titleTh,
      grammarNote: spec.grammarNote,
      items,
    }
  })
  return { lang: 'en', level, name, description, units }
}

export function buildZhPack(
  level: string,
  name: string,
  description: string,
  unitSpecs: UnitSpec<ZhRow>[],
): LevelPack {
  const units: Unit[] = unitSpecs.map((spec, i) => {
    const unitId = `zh-${level.toLowerCase()}-u${i + 1}`
    const items: VocabItem[] = spec.rows.map(
      ([headword, pinyin, pos, meaningTh, ex, exPinyin, exTh], j) => ({
        id: `${unitId}-${j + 1}`,
        lang: 'zh',
        level,
        unitId,
        headword,
        pinyin,
        pos,
        meaningTh,
        examples: [{ text: ex, pinyin: exPinyin, translationTh: exTh }],
      }),
    )
    return {
      id: unitId,
      lang: 'zh',
      level,
      index: i + 1,
      title: spec.title,
      titleTh: spec.titleTh,
      grammarNote: spec.grammarNote,
      items,
    }
  })
  return { lang: 'zh', level, name, description, units }
}
