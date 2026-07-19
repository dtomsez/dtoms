export type Lang = 'en' | 'zh'

export interface ExampleSentence {
  text: string
  pinyin?: string
  translationTh: string
}

export interface VocabItem {
  id: string
  lang: Lang
  level: string
  unitId: string
  headword: string
  pinyin?: string
  pos: string
  meaningTh: string
  examples: ExampleSentence[]
}

export interface Unit {
  id: string
  lang: Lang
  level: string
  index: number
  title: string
  titleTh: string
  grammarNote?: string
  items: VocabItem[]
}

export interface LevelPack {
  lang: Lang
  level: string
  name: string
  description: string
  units: Unit[]
}

export interface ReadingQuestion {
  q: string
  choices: string[]
  answer: number
}

export interface ReadingPassage {
  id: string
  lang: Lang
  level: string
  title: string
  titleTh: string
  /** Each paragraph is a list of tokens (words for EN, segmented words for ZH). */
  paragraphs: string[][]
  glossary: Record<string, { pinyin?: string; meaningTh: string }>
  questions: ReadingQuestion[]
}
