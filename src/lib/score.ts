import type { Lang } from '../types/content'

/** ตัดเครื่องหมายวรรคตอน/ช่องว่างและแปลงเป็นตัวพิมพ์เล็ก เพื่อเทียบคำตอบ */
export function normalize(text: string, lang: Lang): string {
  const stripped = text
    .toLowerCase()
    .replace(/[.,!?;:'"“”‘’`´\-–—()[\]{}。，！？；：、「」『』…·]/g, ' ')
    .trim()
  if (lang === 'zh') return stripped.replace(/\s+/g, '')
  return stripped.replace(/\s+/g, ' ')
}

export function levenshtein(a: string[], b: string[]): number {
  const m = a.length
  const n = b.length
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = tmp
    }
  }
  return dp[n]
}

function toUnits(text: string, lang: Lang): string[] {
  return lang === 'zh' ? Array.from(text) : text.split(' ').filter(Boolean)
}

/** คะแนนความใกล้เคียง 0–100 (EN เทียบเป็นคำ, ZH เทียบเป็นตัวอักษร) */
export function similarity(target: string, attempt: string, lang: Lang): number {
  const t = toUnits(normalize(target, lang), lang)
  const a = toUnits(normalize(attempt, lang), lang)
  if (t.length === 0) return 0
  const dist = levenshtein(t, a)
  return Math.max(0, Math.round((1 - dist / Math.max(t.length, a.length)) * 100))
}

/** ตัดวรรณยุกต์พินอิน (nǐ hǎo → ni hao) เพื่อเทียบแบบยืดหยุ่น */
export function stripTones(pinyin: string): string {
  return pinyin
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ü/g, 'u')
    .replace(/’/g, "'")
}

export interface DiffUnit {
  text: string
  hit: boolean
}

/** ไล่หน่วยของประโยคเป้าหมาย ระบุว่าหน่วยไหนผู้เรียนพูด/พิมพ์ได้ตรง (LCS alignment) */
export function diffTarget(target: string, attempt: string, lang: Lang): DiffUnit[] {
  const t = toUnits(normalize(target, lang), lang)
  const a = toUnits(normalize(attempt, lang), lang)
  const m = t.length
  const n = a.length
  const lcs: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] = t[i] === a[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }
  const hits = new Set<number>()
  let i = 0
  let j = 0
  while (i < m && j < n) {
    if (t[i] === a[j]) {
      hits.add(i)
      i++
      j++
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      i++
    } else {
      j++
    }
  }
  return t.map((text, idx) => ({ text, hit: hits.has(idx) }))
}
