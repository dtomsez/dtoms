// ── BaZi (八字) calculation engine ──
// Solar-term boundaries use standard approximate dates; exact times vary ±1 day by year.

import {
  STEMS, BRANCHES, ELEMENTS, ELEMENT_KEYS, PRODUCES, CONTROLS,
  TEN_GODS, NOBLEMAN, ACADEMIC_STAR, STEM_TRIGRAM, BRANCH_TRIGRAM, KING_WEN, HEXAGRAM_NAMES,
} from './data'
import type { ElementKey } from './data'

export interface Pillar {
  stem: number
  branch: number
  ganzhi: number // 0-59
}

export interface BirthInfo {
  year: number
  month: number // 1-12
  day: number
  hour: number  // 0-23
  minute: number
  gender: 'male' | 'female'
  name: string
}

// ── calendar helpers ──

export function jdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12)
  const yy = y + 4800 - a
  const mm = m + 12 * a - 3
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045
}

export function dayPillar(y: number, m: number, d: number): Pillar {
  const idx = ((jdn(y, m, d) + 49) % 60 + 60) % 60
  return { stem: idx % 10, branch: idx % 12, ganzhi: idx }
}

// jie (节) boundary dates: index 0 = month of 寅 starting ~Feb 4
export const JIE_DATES: [number, number][] = [
  [2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7],
  [8, 8], [9, 8], [10, 8], [11, 7], [12, 7], [1, 6],
]

export function solarYear(y: number, m: number, d: number): number {
  return (m > 2 || (m === 2 && d >= 4)) ? y : y - 1
}

export function yearPillar(y: number, m: number, d: number): Pillar {
  const ey = solarYear(y, m, d)
  const stem = ((ey - 4) % 10 + 10) % 10
  const branch = ((ey - 4) % 12 + 12) % 12
  return { stem, branch, ganzhi: ganzhiIndex(stem, branch) }
}

// month index 0-11 where 0 = 寅 month
export function solarMonthIndex(_y: number, m: number, d: number): number {
  for (let i = 11; i >= 0; i--) {
    const [jm, jd] = JIE_DATES[i]
    // month i starts at jm/jd; handle year wrap for index 11 (丑month starts Jan 6)
    if (jm === m && d >= jd) return i
  }
  // before this month's jie → previous solar month
  const prev: Record<number, number> = { 1: 10, 2: 11, 3: 0, 4: 1, 5: 2, 6: 3, 7: 4, 8: 5, 9: 6, 10: 7, 11: 8, 12: 9 }
  return prev[m]
}

export function monthPillar(y: number, m: number, d: number): Pillar {
  const mi = solarMonthIndex(y, m, d)
  const ys = yearPillar(y, m, d).stem
  const branch = (mi + 2) % 12 // 0→寅(2)
  const stem = ((ys % 5) * 2 + 2 + mi) % 10 // five tigers
  return { stem, branch, ganzhi: ganzhiIndex(stem, branch) }
}

export function hourBranchIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2)
}

export function hourPillar(dayStem: number, hour: number): Pillar {
  const branch = hourBranchIndex(hour)
  const stem = ((dayStem % 5) * 2 + branch) % 10 // five rats
  return { stem, branch, ganzhi: ganzhiIndex(stem, branch) }
}

export function ganzhiIndex(stem: number, branch: number): number {
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === branch) return i
  return 0
}

export function ganzhiName(p: Pillar): string {
  return STEMS[p.stem].cn + BRANCHES[p.branch].cn
}

// ── ten gods ──

export function tenGodOf(dayStem: number, otherStem: number): number {
  const dm = STEMS[dayStem]
  const o = STEMS[otherStem]
  const same = dm.yang === o.yang
  if (o.element === dm.element) return same ? 0 : 1                    // 比肩/劫財
  if (PRODUCES[dm.element] === o.element) return same ? 2 : 3          // 食神/傷官
  if (CONTROLS[dm.element] === o.element) return same ? 4 : 5          // 偏財/正財
  if (CONTROLS[o.element] === dm.element) return same ? 6 : 7          // 七殺/正官
  return same ? 8 : 9                                                  // 偏印/正印
}

// ── full chart ──

export interface FourPillars {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar
}

export interface ChartAnalysis {
  birth: BirthInfo
  pillars: FourPillars
  dayMaster: number
  elementCount: Record<ElementKey, number>
  elementPercent: Record<ElementKey, number>
  strength: 0 | 1 | 2 | 3
  strengthScore: number
  structure: 0 | 1 | 2 | 3
  usefulGod: ElementKey
  secondaryGod: ElementKey
  avoidElement: ElementKey
  stars: { name: string; cn: string; pillar: string; desc: string; auspicious: boolean }[]
  hexagrams: { pillarName: string; pillar: Pillar; hexNum: number; cn: string; th: string; upper: number; lower: number }[]
  luckPillars: LuckPillar[]
  tenGodProfile: Record<string, number>
}

export interface LuckPillar {
  pillar: Pillar
  startAge: number
  endAge: number
  startYear: number
  tenGod: number
}

const PILLAR_NAMES = ['ปี', 'เดือน', 'วัน', 'ชั่วโมง']

export function computeChart(b: BirthInfo): ChartAnalysis {
  const yp = yearPillar(b.year, b.month, b.day)
  const mp = monthPillar(b.year, b.month, b.day)
  let dp = dayPillar(b.year, b.month, b.day)
  // 23:00+ counts as next day's 子 hour
  if (b.hour === 23) {
    const dt = new Date(Date.UTC(b.year, b.month - 1, b.day))
    dt.setUTCDate(dt.getUTCDate() + 1)
    dp = dayPillar(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate())
  }
  const hp = hourPillar(dp.stem, b.hour)
  const pillars: FourPillars = { year: yp, month: mp, day: dp, hour: hp }
  const dm = dp.stem

  // element counting: stems ×10, branch main qi ×10 (month main ×20), minor hidden ×5
  const count: Record<ElementKey, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  const plist = [yp, mp, dp, hp]
  plist.forEach((p, i) => {
    count[STEMS[p.stem].element] += 10
    BRANCHES[p.branch].hiddenStems.forEach((hs, j) => {
      const w = j === 0 ? (i === 1 ? 20 : 10) : 5
      count[STEMS[hs].element] += w
    })
  })
  const total = ELEMENT_KEYS.reduce((s, k) => s + count[k], 0)
  const percent = {} as Record<ElementKey, number>
  ELEMENT_KEYS.forEach(k => { percent[k] = Math.round((count[k] / total) * 100) })

  // strength: support = same element + resource element (weighted by season)
  const dmEl = STEMS[dm].element
  const resourceEl = ELEMENT_KEYS.find(k => PRODUCES[k] === dmEl)!
  let support = count[dmEl] + count[resourceEl] * 0.8
  // season bonus: month branch main qi
  const seasonEl = STEMS[BRANCHES[mp.branch].hiddenStems[0]].element
  if (seasonEl === dmEl) support += 15
  else if (seasonEl === resourceEl) support += 8
  const ratio = support / total
  let strength: 0 | 1 | 2 | 3
  if (ratio < 0.22) strength = 0
  else if (ratio < 0.42) strength = 1
  else if (ratio < 0.62) strength = 2
  else strength = 3

  // structure
  const dominant = ELEMENT_KEYS.reduce((a, k) => count[k] > count[a] ? k : a, 'wood' as ElementKey)
  let structure: 0 | 1 | 2 | 3 = 0
  if (strength === 0 && percent[dominant] >= 40 && dominant !== dmEl) structure = 1
  else if (strength === 3 && percent[dmEl] >= 45) structure = 2
  else if (percent[dominant] >= 45) structure = 3

  // useful god
  const outputEl = PRODUCES[dmEl]
  const wealthEl = CONTROLS[dmEl]
  const officerEl = ELEMENT_KEYS.find(k => CONTROLS[k] === dmEl)!
  let useful: ElementKey, secondary: ElementKey, avoid: ElementKey
  if (structure === 1) {
    useful = dominant; secondary = PRODUCES[dominant] === dmEl ? wealthEl : PRODUCES[dominant]; avoid = dmEl
  } else if (structure === 2) {
    useful = dmEl; secondary = resourceEl; avoid = officerEl
  } else if (strength >= 2) {
    // strong → drain/control
    const cands: ElementKey[] = [outputEl, wealthEl, officerEl]
    useful = cands.reduce((a, k) => count[k] > count[a] ? k : a, cands[0])
    secondary = cands.find(k => k !== useful) ?? wealthEl
    avoid = resourceEl
  } else {
    useful = resourceEl; secondary = dmEl; avoid = wealthEl
  }

  // symbolic stars
  const stars: ChartAnalysis['stars'] = []
  const branchAt = (p: Pillar, name: string) => ({ p, name })
  const spots = [branchAt(yp, 'ปี'), branchAt(mp, 'เดือน'), branchAt(dp, 'วัน'), branchAt(hp, 'ชั่วโมง')]
  const nb = NOBLEMAN[dm] ?? []
  spots.forEach(({ p, name }) => {
    if (nb.includes(p.branch)) stars.push({ name: 'เทพขุนนางฟ้า', cn: '天乙貴人', pillar: name, desc: 'ผู้ใหญ่เกื้อหนุน มีคนช่วยยามคับขัน แคล้วคลาดจากภัย', auspicious: true })
  })
  const trineStar = (base: number, map: [number, number, number, number]) => {
    const g = [8, 0, 4].includes(base) ? 0 : [2, 6, 10].includes(base) ? 1 : [5, 9, 1].includes(base) ? 2 : 3
    return map[g]
  }
  const dayTrinePeach = trineStar(dp.branch, [9, 3, 6, 0])
  const dayTrineHorse = trineStar(dp.branch, [2, 8, 11, 5])
  const dayTrineHuaGai = trineStar(dp.branch, [4, 10, 1, 7])
  spots.forEach(({ p, name }) => {
    if (p.branch === dayTrinePeach && name !== 'วัน') stars.push({ name: 'ดาวดอกท้อ', cn: '桃花', pillar: name, desc: 'เสน่ห์แรง เป็นที่รักใคร่ เหมาะงานที่ใช้ภาพลักษณ์', auspicious: true })
    if (p.branch === dayTrineHorse && name !== 'วัน') stars.push({ name: 'ม้าสวรรค์', cn: '驛馬', pillar: name, desc: 'ดวงเคลื่อนไหว เดินทาง ย้ายถิ่น โอกาสจากต่างแดน', auspicious: true })
    if (p.branch === dayTrineHuaGai && name !== 'วัน') stars.push({ name: 'ฉัตรทอง', cn: '華蓋', pillar: name, desc: 'ปัญญาเชิงศาสตร์ลึกลับ ศิลปะ ชอบสันโดษอย่างมีระดับ', auspicious: true })
  })
  const acad = ACADEMIC_STAR[dm]
  spots.forEach(({ p, name }) => {
    if (p.branch === acad) stars.push({ name: 'ดาวปัญญา', cn: '文昌', pillar: name, desc: 'สติปัญญาเฉียบแหลม การเรียน การสอบ งานเขียนโดดเด่น', auspicious: true })
  })
  // goat blade 羊刃 (yang stems): 甲卯 丙午 戊午 庚酉 壬子
  const blade: Record<number, number> = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 }
  if (blade[dm] !== undefined) {
    spots.forEach(({ p, name }) => {
      if (p.branch === blade[dm]) stars.push({ name: 'คมดาบหยาง', cn: '羊刃', pillar: name, desc: 'พลังดิบรุนแรง กล้าตัดสินใจ แต่ต้องคุมอารมณ์ให้อยู่', auspicious: false })
    })
  }
  // void 空亡 from day pillar
  const v1 = (dp.branch - dp.stem + 10 + 24) % 12
  const v2 = (v1 + 1) % 12
  spots.forEach(({ p, name }) => {
    if (name !== 'วัน' && (p.branch === v1 || p.branch === v2)) {
      stars.push({ name: 'สุญตา', cn: '空亡', pillar: name, desc: 'พลังเสาเบาบางลง สิ่งที่เกี่ยวข้องต้องใช้ความพยายามเป็นพิเศษ', auspicious: false })
    }
  })

  // hexagrams per pillar
  const hexagrams = plist.map((p, i) => {
    const lower = STEM_TRIGRAM[p.stem]
    const upper = BRANCH_TRIGRAM[p.branch]
    const hexNum = KING_WEN[lower][upper]
    return { pillarName: PILLAR_NAMES[i], pillar: p, hexNum, cn: HEXAGRAM_NAMES[hexNum].cn, th: HEXAGRAM_NAMES[hexNum].th, upper, lower }
  })

  // luck pillars
  const yangYear = STEMS[yp.stem].yang
  const forward = (yangYear && b.gender === 'male') || (!yangYear && b.gender === 'female')
  const startAge = luckStartAge(b, forward)
  const luckPillars: LuckPillar[] = []
  for (let i = 1; i <= 10; i++) {
    const gz = ((mp.ganzhi + (forward ? i : -i)) % 60 + 60) % 60
    const p: Pillar = { stem: gz % 10, branch: gz % 12, ganzhi: gz }
    const sa = Math.round((startAge + (i - 1) * 10) * 10) / 10
    luckPillars.push({
      pillar: p,
      startAge: sa,
      endAge: sa + 10,
      startYear: b.year + Math.floor(sa),
      tenGod: tenGodOf(dm, p.stem),
    })
  }

  // ten-god profile (count occurrences incl hidden main qi)
  const profile: Record<string, number> = {}
  TEN_GODS.forEach(g => { profile[g.key] = 0 })
  plist.forEach((p, i) => {
    if (i !== 2) profile[TEN_GODS[tenGodOf(dm, p.stem)].key] += 2
    BRANCHES[p.branch].hiddenStems.forEach((hs, j) => {
      profile[TEN_GODS[tenGodOf(dm, hs)].key] += j === 0 ? 2 : 1
    })
  })

  return {
    birth: b, pillars, dayMaster: dm,
    elementCount: count, elementPercent: percent,
    strength, strengthScore: Math.round(ratio * 100),
    structure, usefulGod: useful, secondaryGod: secondary, avoidElement: avoid,
    stars, hexagrams, luckPillars, tenGodProfile: profile,
  }
}

function luckStartAge(b: BirthInfo, forward: boolean): number {
  const birthJdn = jdn(b.year, b.month, b.day)
  // find next / previous jie boundary
  let best = Infinity
  for (let dy = -1; dy <= 1; dy++) {
    for (const [jm, jd] of JIE_DATES) {
      const j = jdn(b.year + dy, jm, jd)
      const diff = forward ? j - birthJdn : birthJdn - j
      if (diff > 0 && diff < best) best = diff
    }
  }
  if (!isFinite(best)) best = 15
  return Math.max(0.3, Math.round((best / 3) * 10) / 10)
}

// annual pillar for a given western year (solar year basis)
export function annualPillar(westernYear: number): Pillar {
  const stem = ((westernYear - 4) % 10 + 10) % 10
  const branch = ((westernYear - 4) % 12 + 12) % 12
  return { stem, branch, ganzhi: ganzhiIndex(stem, branch) }
}

// branch relations for resonance scoring
export const SIX_COMBINE: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]]
export function isSixCombine(a: number, b: number) { return SIX_COMBINE.some(([x, y]) => (x === a && y === b) || (x === b && y === a)) }
export function isClash(a: number, b: number) { return (a + 6) % 12 === b }
export function isTrine(a: number, b: number) { return a !== b && (a % 4) === (b % 4) }
export function isHarm(a: number, b: number) {
  const pairs: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]]
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
}

export function elementRelation(a: ElementKey, b: ElementKey): 'same' | 'produces' | 'producedBy' | 'controls' | 'controlledBy' {
  if (a === b) return 'same'
  if (PRODUCES[a] === b) return 'produces'
  if (PRODUCES[b] === a) return 'producedBy'
  if (CONTROLS[a] === b) return 'controls'
  return 'controlledBy'
}

export { STEMS, BRANCHES, ELEMENTS, ELEMENT_KEYS, TEN_GODS }
