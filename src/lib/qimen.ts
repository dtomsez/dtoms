// ── Qi Men Dun Jia (奇門遁甲) rotating-plate engine (時家 method, simplified) ──

import { STEMS, BRANCHES, QM_STARS, QM_DOORS, QM_DEITIES, PALACE_INFO } from './data'
import { dayPillar, monthPillar, yearPillar, hourPillar, jdn, ganzhiIndex } from './bazi'
import type { Pillar } from './bazi'

export type ChartType = 'hour' | 'day' | 'month' | 'year'

// 24 solar terms with approximate dates and [upper, middle, lower] ju numbers
// yang dun: winter solstice → before summer solstice
interface TermDef { name: string; th: string; m: number; d: number; yang: boolean; ju: [number, number, number] }
export const SOLAR_TERMS: TermDef[] = [
  { name: '冬至', th: 'เหมายัน',        m: 12, d: 22, yang: true,  ju: [1, 7, 4] },
  { name: '小寒', th: 'หนาวน้อย',       m: 1,  d: 6,  yang: true,  ju: [2, 8, 5] },
  { name: '大寒', th: 'หนาวใหญ่',       m: 1,  d: 20, yang: true,  ju: [3, 9, 6] },
  { name: '立春', th: 'เริ่มวสันต์',      m: 2,  d: 4,  yang: true,  ju: [8, 5, 2] },
  { name: '雨水', th: 'ฝนชุ่มฟ้า',       m: 2,  d: 19, yang: true,  ju: [9, 6, 3] },
  { name: '驚蟄', th: 'แมลงตื่น',        m: 3,  d: 6,  yang: true,  ju: [1, 7, 4] },
  { name: '春分', th: 'วสันตวิษุวัต',     m: 3,  d: 21, yang: true,  ju: [3, 9, 6] },
  { name: '清明', th: 'เช็งเม้ง',         m: 4,  d: 5,  yang: true,  ju: [4, 1, 7] },
  { name: '穀雨', th: 'ฝนเมล็ดข้าว',     m: 4,  d: 20, yang: true,  ju: [5, 2, 8] },
  { name: '立夏', th: 'เริ่มคิมหันต์',     m: 5,  d: 6,  yang: true,  ju: [4, 1, 7] },
  { name: '小滿', th: 'เมล็ดเริ่มเต็ม',    m: 5,  d: 21, yang: true,  ju: [5, 2, 8] },
  { name: '芒種', th: 'เมล็ดแหลม',       m: 6,  d: 6,  yang: true,  ju: [6, 3, 9] },
  { name: '夏至', th: 'ครีษมายัน',       m: 6,  d: 21, yang: false, ju: [9, 3, 6] },
  { name: '小暑', th: 'ร้อนน้อย',        m: 7,  d: 7,  yang: false, ju: [8, 2, 5] },
  { name: '大暑', th: 'ร้อนใหญ่',        m: 7,  d: 23, yang: false, ju: [7, 1, 4] },
  { name: '立秋', th: 'เริ่มสารท',        m: 8,  d: 8,  yang: false, ju: [2, 5, 8] },
  { name: '處暑', th: 'สิ้นร้อน',         m: 8,  d: 23, yang: false, ju: [1, 4, 7] },
  { name: '白露', th: 'น้ำค้างขาว',      m: 9,  d: 8,  yang: false, ju: [9, 3, 6] },
  { name: '秋分', th: 'ศารทวิษุวัต',      m: 9,  d: 23, yang: false, ju: [7, 1, 4] },
  { name: '寒露', th: 'น้ำค้างเย็น',      m: 10, d: 8,  yang: false, ju: [6, 9, 3] },
  { name: '霜降', th: 'น้ำค้างแข็ง',      m: 10, d: 23, yang: false, ju: [5, 8, 2] },
  { name: '立冬', th: 'เริ่มเหมันต์',      m: 11, d: 7,  yang: false, ju: [6, 9, 3] },
  { name: '小雪', th: 'หิมะน้อย',        m: 11, d: 22, yang: false, ju: [5, 8, 2] },
  { name: '大雪', th: 'หิมะใหญ่',        m: 12, d: 7,  yang: false, ju: [4, 7, 1] },
]

export function currentTerm(y: number, m: number, d: number): TermDef {
  const j = jdn(y, m, d)
  let best: TermDef = SOLAR_TERMS[0]
  let bestDiff = -Infinity
  for (let dy = -1; dy <= 0; dy++) {
    for (const t of SOLAR_TERMS) {
      const tj = jdn(y + dy, t.m, t.d)
      const diff = j - tj
      if (diff >= 0 && (bestDiff < 0 || diff < bestDiff)) { best = t; bestDiff = diff }
    }
  }
  return best
}

// stems arrangement order on earth plate: 戊己庚辛壬癸丁丙乙 (six yi + three qi)
const EARTH_ORDER = [4, 5, 6, 7, 8, 9, 3, 2, 1] // stem indices
// luoshu ring clockwise (geographic): 1 8 3 4 9 2 7 6
const RING = [1, 8, 3, 4, 9, 2, 7, 6]
// native star / door of each luoshu palace
const PALACE_STAR = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8] // palace n → QM_STARS idx: 1→天蓬(0), 2→天芮(1), 3→天沖(2), 4→天輔(3), 5→天禽(4), 6→天心(5), 7→天柱(6), 8→天任(7), 9→天英(8)
const PALACE_DOOR: Record<number, number> = { 1: 0, 8: 1, 3: 2, 4: 3, 9: 4, 2: 5, 7: 6, 6: 7 } // palace → QM_DOORS idx

// xun heads: 甲子→戊, 甲戌→己, 甲申→庚, 甲午→辛, 甲辰→壬, 甲寅→癸
const XUN_LEAD_STEM = [4, 5, 6, 7, 8, 9]

export interface PalaceState {
  palace: number // luoshu 1-9
  earthStem: number
  skyStem: number
  star: number
  door: number | null
  deity: number | null
  isDuty: boolean
  isHourPalace: boolean
}

export interface QimenChart {
  type: ChartType
  refPillar: Pillar
  dayP: Pillar
  hourP: Pillar
  term: TermDef
  yang: boolean
  ju: number
  yuan: number
  dutyStar: number
  dutyDoor: number
  dutyPalace: number
  palaces: PalaceState[] // 9 entries, index = luoshu palace
  xunHead: string
  leadStem: number
}

export function computeQimen(y: number, m: number, d: number, hour: number, type: ChartType): QimenChart {
  const dp = dayPillar(y, m, d)
  const hp = hourPillar(dp.stem, hour)
  const mp = monthPillar(y, m, d)
  const yp = yearPillar(y, m, d)
  const term = currentTerm(y, m, d)
  const yang = term.yang

  // reference pillar per chart type
  const refPillar = type === 'hour' ? hp : type === 'day' ? dp : type === 'month' ? mp : yp

  // yuan (元) from day ganzhi: blocks of 5 within 15
  const yuan = Math.floor((dp.ganzhi % 15) / 5)
  let ju: number
  if (type === 'hour') ju = term.ju[yuan]
  else if (type === 'day') ju = term.ju[0]
  else if (type === 'month') ju = ((mp.ganzhi % 9) + 1)
  else ju = ((yp.ganzhi % 9) + 1)

  // ── earth plate: place 戊 at palace `ju`, others follow ──
  const earth: Record<number, number> = {}
  for (let i = 0; i < 9; i++) {
    const palace = yang ? ((ju - 1 + i) % 9) + 1 : ((ju - 1 - i) % 9 + 9) % 9 + 1
    earth[palace] = EARTH_ORDER[i]
  }

  // ── xun head of reference pillar ──
  const xunIdx = Math.floor(refPillar.ganzhi / 10) // 0=甲子旬 …
  const leadStem = XUN_LEAD_STEM[xunIdx]

  // duty palace = where lead stem sits on earth plate
  let dutyPalace = 1
  for (let p = 1; p <= 9; p++) if (earth[p] === leadStem) dutyPalace = p
  const dutyStar = PALACE_STAR[dutyPalace]
  const dutyDoorPalace = dutyPalace === 5 ? 2 : dutyPalace
  const dutyDoor = PALACE_DOOR[dutyDoorPalace]

  // hour stem palace (值符 star flies here). 甲 hides → use lead stem
  const refStem = refPillar.stem === 0 ? leadStem : refPillar.stem
  let hourStemPalace = dutyPalace
  for (let p = 1; p <= 9; p++) if (earth[p] === refStem) hourStemPalace = p
  const hourStemRingPalace = hourStemPalace === 5 ? 2 : hourStemPalace

  // ── sky plate stars: duty star flies to hour-stem palace, rest follow ring ──
  const skyStar: Record<number, number> = {}
  const skyStem: Record<number, number> = {}
  const dutyRingPalace = dutyPalace === 5 ? 2 : dutyPalace
  const startRingIdx = RING.indexOf(hourStemRingPalace)
  const dutyRingIdx = RING.indexOf(dutyRingPalace)
  for (let i = 0; i < 8; i++) {
    const from = RING[(dutyRingIdx + i) % 8]
    const to = RING[(startRingIdx + i) % 8]
    skyStar[to] = PALACE_STAR[from]
    skyStem[to] = earth[from === 2 && dutyPalace === 5 ? 5 : from]
  }
  skyStar[5] = 4 // 天禽 stays center conceptually
  skyStem[5] = earth[5]

  // ── doors: duty door flies to palace advanced by hour offset from xun head ──
  const offset = ((refPillar.ganzhi - xunIdx * 10) % 60 + 60) % 60
  let doorPalaceNum = dutyPalace
  for (let i = 0; i < offset; i++) {
    doorPalaceNum = yang ? (doorPalaceNum % 9) + 1 : ((doorPalaceNum - 2 + 9) % 9) + 1
  }
  const doorAnchor = doorPalaceNum === 5 ? 2 : doorPalaceNum
  const doors: Record<number, number> = {}
  const doorStartIdx = RING.indexOf(doorAnchor)
  const doorNativeIdx = RING.indexOf(dutyDoorPalace)
  for (let i = 0; i < 8; i++) {
    const from = RING[(doorNativeIdx + i) % 8]
    const to = RING[(doorStartIdx + i) % 8]
    doors[to] = PALACE_DOOR[from]
  }

  // ── deities: chief at sky-duty-star palace, rotate 8 (yang cw / yin ccw) ──
  const deities: Record<number, number> = {}
  const chiefPalace = hourStemRingPalace
  const chiefIdx = RING.indexOf(chiefPalace)
  for (let i = 0; i < 8; i++) {
    const to = yang ? RING[(chiefIdx + i) % 8] : RING[(chiefIdx - i + 16) % 8]
    deities[to] = i
  }

  const palaces: PalaceState[] = []
  for (let p = 1; p <= 9; p++) {
    palaces[p] = {
      palace: p,
      earthStem: earth[p],
      skyStem: skyStem[p] ?? earth[p],
      star: skyStar[p] ?? PALACE_STAR[p],
      door: p === 5 ? null : doors[p] ?? null,
      deity: p === 5 ? null : deities[p] ?? null,
      isDuty: p === dutyPalace,
      isHourPalace: p === hourStemPalace,
    }
  }

  return {
    type, refPillar, dayP: dp, hourP: hp, term, yang, ju, yuan,
    dutyStar, dutyDoor, dutyPalace, palaces,
    xunHead: `${STEMS[0].cn}${BRANCHES[((0 - (xunIdx * 10)) % 12 + 12) % 12].cn}旬`,
    leadStem,
  }
}

// ── destiny (命盤) view: birth hour chart + destiny palace ──

export interface DestinyResult {
  chart: QimenChart
  destinyPalace: number
  star: number
  door: number | null
  deity: number | null
}

export function computeDestiny(y: number, m: number, d: number, hour: number): DestinyResult {
  const chart = computeQimen(y, m, d, hour, 'hour')
  // destiny palace = palace containing the hour stem on earth plate
  const hp = chart.hourP
  const stemToFind = hp.stem === 0 ? chart.leadStem : hp.stem
  let palace = chart.dutyPalace
  for (let p = 1; p <= 9; p++) if (chart.palaces[p].earthStem === stemToFind) palace = p
  const st = chart.palaces[palace]
  return { chart, destinyPalace: palace, star: st.star, door: st.door, deity: st.deity }
}

export { QM_STARS, QM_DOORS, QM_DEITIES, PALACE_INFO, ganzhiIndex }
