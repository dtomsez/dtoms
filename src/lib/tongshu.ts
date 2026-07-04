// ── Tong Shu (通勝) daily almanac engine ──

import {
  STEMS, DAY_OFFICERS, CONSTELLATIONS, BELT_SPIRITS, BELT_START, BRANCHES,
} from './data'
import {
  dayPillar, monthPillar, yearPillar, hourPillar, jdn, ganzhiName,
  isSixCombine, isClash, isTrine, isHarm, elementRelation, annualPillar,
} from './bazi'
import type { Pillar, ChartAnalysis } from './bazi'
import { STEM_TRIGRAM, BRANCH_TRIGRAM, KING_WEN, HEXAGRAM_NAMES } from './data'

export interface DayStar {
  name: string
  cn: string
  auspicious: boolean
  power: number
  desc: string
}

export interface DayInfo {
  date: { y: number; m: number; d: number }
  day: Pillar
  month: Pillar
  year: Pillar
  officer: number
  constellation: number
  belt: number
  stars: DayStar[]
  starScore: number // 0-100
  hexNum: number
  xkdgNote: string
}

export function computeDay(y: number, m: number, d: number): DayInfo {
  const dp = dayPillar(y, m, d)
  const mp = monthPillar(y, m, d)
  const yp = yearPillar(y, m, d)

  const officer = ((dp.branch - mp.branch) % 12 + 12) % 12
  const constellation = ((jdn(y, m, d) + 15) % 28 + 28) % 28
  const beltStart = BELT_START[mp.branch]
  const belt = ((dp.branch - beltStart) % 12 + 12) % 12

  const stars: DayStar[] = []
  // 月德 Moon Virtue: month trine group → day stem
  const mdMap: Record<number, number> = { 2: 2, 6: 2, 10: 2, 8: 8, 0: 8, 4: 8, 11: 0, 3: 0, 7: 0, 5: 6, 9: 6, 1: 6 }
  if (dp.stem === mdMap[mp.branch]) stars.push({ name: 'จันทราคุณธรรม', cn: '月德', auspicious: true, power: 18, desc: 'ดาวเมตตาใหญ่ประจำเดือน ทำการมงคลราบรื่น มีผู้ช่วยเหลือ' })
  // 天醫 Sky Doctor: month branch - 1
  if (dp.branch === ((mp.branch + 11) % 12)) stars.push({ name: 'หมอสวรรค์', cn: '天醫', auspicious: true, power: 12, desc: 'เหมาะรักษาโรค พบแพทย์ เริ่มดูแลสุขภาพ' })
  // 天喜 Sky Happiness by season
  const season = [2, 3, 4].includes(mp.branch) ? 0 : [5, 6, 7].includes(mp.branch) ? 1 : [8, 9, 10].includes(mp.branch) ? 2 : 3
  const skyHappy = [10, 1, 4, 7][season]
  if (dp.branch === skyHappy) stars.push({ name: 'สวรรค์ยินดี', cn: '天喜', auspicious: true, power: 12, desc: 'ข่าวดี งานเฉลิมฉลอง ความรัก งานหมั้น-แต่ง' })
  // 驛馬 Sky Horse (month trine → day)
  const trineOf = (b: number) => [8, 0, 4].includes(b) ? 0 : [2, 6, 10].includes(b) ? 1 : [5, 9, 1].includes(b) ? 2 : 3
  const horse = [2, 8, 11, 5][trineOf(mp.branch)]
  if (dp.branch === horse) stars.push({ name: 'ม้าสวรรค์', cn: '驛馬', auspicious: true, power: 8, desc: 'เหมาะเดินทาง ย้ายที่ ส่งของ เริ่มงานต่างถิ่น' })
  // 桃花 Peach Blossom
  const peach = [9, 3, 6, 0][trineOf(mp.branch)]
  if (dp.branch === peach) stars.push({ name: 'ดอกท้อ', cn: '桃花', auspicious: true, power: 6, desc: 'เสน่ห์ งานสังคม ออกสื่อ นัดพบลูกค้า' })
  // 劫煞 Robbery Sha
  const rob = [5, 11, 2, 8][trineOf(mp.branch)]
  if (dp.branch === rob) stars.push({ name: 'จอมโจรฟ้า', cn: '劫煞', auspicious: false, power: -10, desc: 'ระวังสูญทรัพย์ ถูกแย่งชิง อย่าโชว์ของมีค่า' })
  // 災煞 Disaster Sha
  const dis = [6, 0, 3, 9][trineOf(mp.branch)]
  if (dp.branch === dis) stars.push({ name: 'เคราะห์ฟ้า', cn: '災煞', auspicious: false, power: -12, desc: 'ระวังอุบัติเหตุ เจ็บป่วยกะทันหัน งดเสี่ยงภัย' })
  // 月破 Month Break
  if (isClash(dp.branch, mp.branch)) stars.push({ name: 'เดือนแตก', cn: '月破', auspicious: false, power: -18, desc: 'วันปะทะเดือน ทุกอย่างเปราะ งดงานมงคลทั้งปวง' })
  // 歲破 Year Break
  if (isClash(dp.branch, yp.branch)) stars.push({ name: 'ปีแตก', cn: '歲破', auspicious: false, power: -15, desc: 'วันปะทะปี พลังปั่นป่วน เลี่ยงตัดสินใจใหญ่' })
  // officer & belt & constellation adjust
  const officerAdj = DAY_OFFICERS[officer].quality === 'auspicious' ? 10 : DAY_OFFICERS[officer].quality === 'inauspicious' ? -10 : 0
  const beltAdj = BELT_SPIRITS[belt].yellow ? 12 : -12
  const consAdj = CONSTELLATIONS[constellation].auspicious ? 8 : -8

  let score = 50 + officerAdj + beltAdj + consAdj + stars.reduce((s, st) => s + st.power, 0)
  score = Math.max(2, Math.min(98, score))

  // XKDG hexagram of the day
  const lower = STEM_TRIGRAM[dp.stem]
  const upper = BRANCH_TRIGRAM[dp.branch]
  const hexNum = KING_WEN[lower][upper]
  const special = [1, 2, 11, 63, 14, 34].includes(hexNum)
  const xkdgNote = special
    ? `โครงสร้างพิเศษ! ฉักลักษณ์ ${HEXAGRAM_NAMES[hexNum].cn} (${HEXAGRAM_NAMES[hexNum].th}) เป็นโครงสร้างกำลังสูงของวัน เหมาะวางฤกษ์เรื่องใหญ่`
    : `ฉักลักษณ์ประจำวัน: ${HEXAGRAM_NAMES[hexNum].cn} (${HEXAGRAM_NAMES[hexNum].th})`

  return {
    date: { y, m, d },
    day: dp, month: mp, year: yp,
    officer, constellation, belt,
    stars, starScore: score, hexNum, xkdgNote,
  }
}

// ── personal resonance vs natal chart ──

export interface Resonance {
  score: number // 0-100
  verdict: string
  notes: { text: string; good: boolean }[]
  elementAligned: boolean
  elementNote: string
}

export function personalResonance(day: DayInfo, chart: ChartAnalysis): Resonance {
  const notes: Resonance['notes'] = []
  let score = 50
  const natal = [chart.pillars.year, chart.pillars.month, chart.pillars.day, chart.pillars.hour]
  const names = ['เสาปี', 'เสาเดือน', 'เสาวัน', 'เสาชั่วโมง']

  natal.forEach((p, i) => {
    if (isSixCombine(day.day.branch, p.branch)) { score += 8; notes.push({ text: `ราศีวันรวมกับ${names[i]}ของคุณ (六合) — พลังสนับสนุน ความร่วมมือไหลลื่น`, good: true }) }
    if (isTrine(day.day.branch, p.branch)) { score += 5; notes.push({ text: `ราศีวันเข้าตรีโกณกับ${names[i]} (三合) — จังหวะส่งเสริมเป้าหมายระยะยาว`, good: true }) }
    if (isClash(day.day.branch, p.branch)) { score -= 12; notes.push({ text: `ราศีวันชงกับ${names[i]} (六沖) — ระวังการปะทะ เปลี่ยนแปลงกะทันหัน`, good: false }) }
    if (isHarm(day.day.branch, p.branch)) { score -= 6; notes.push({ text: `ราศีวันแทรกทำลาย${names[i]} (六害) — ระวังคนใกล้ตัวหักหลังเรื่องเล็ก`, good: false }) }
  })

  const dayEl = STEMS[day.day.stem].element
  const rel = elementRelation(dayEl, STEMS[chart.dayMaster].element)
  if (dayEl === chart.usefulGod) { score += 15 }
  else if (dayEl === chart.secondaryGod) { score += 8 }
  else if (dayEl === chart.avoidElement) { score -= 12 }
  if (rel === 'producedBy') { score += 4; notes.push({ text: 'ธาตุวันหล่อเลี้ยงเจ้าวันของคุณ — พลังกายใจถูกเติมเต็ม', good: true }) }
  if (rel === 'controls' && STEMS[chart.dayMaster].element !== chart.usefulGod) { notes.push({ text: 'ธาตุวันกดดันเจ้าวัน — งานหนักแต่ฝึกวินัยได้ดี', good: false }) }

  const elementAligned = dayEl === chart.usefulGod || dayEl === chart.secondaryGod
  const elementNote = elementAligned
    ? `ธาตุประจำวัน (${STEMS[day.day.stem].cn} ${dayEl === chart.usefulGod ? 'ตรงกับเทพประโยชน์' : 'ตรงกับธาตุเสริม'}) — วันนี้กระแสธาตุหนุนดวงคุณโดยตรง`
    : dayEl === chart.avoidElement
      ? `ธาตุประจำวันเป็นธาตุที่ควรเลี่ยงของดวงคุณ — ผ่อนคันเร่ง เก็บพลังไว้วันถัดไป`
      : `ธาตุประจำวันเป็นกลางต่อดวงคุณ — เดินเกมตามแผนปกติ`

  score += Math.round((day.starScore - 50) / 4)
  score = Math.max(2, Math.min(98, score))

  const verdict = score >= 80 ? 'วันมงคลยอดเยี่ยมสำหรับคุณ' :
    score >= 65 ? 'วันดี เหมาะเดินหน้าเรื่องสำคัญ' :
    score >= 45 ? 'วันกลางๆ ทำงานตามปกติ' :
    score >= 30 ? 'วันควรระวัง เลี่ยงการตัดสินใจใหญ่' : 'วันชงแรงสำหรับคุณ งดเรื่องมงคลทั้งปวง'

  return { score, verdict, notes, elementAligned, elementNote }
}

// ── hour pillars of a day ──

export interface HourSlot {
  branch: number
  pillar: Pillar
  range: string
  belt: number
  yellow: boolean
  score: number
}

export function hourPillarsOf(day: DayInfo): HourSlot[] {
  const startBelt = BELT_START[day.day.branch]
  return BRANCHES.map((_b, i) => {
    const p = hourPillar(day.day.stem, i === 0 ? 23 : i * 2 - 1)
    const belt = ((i - startBelt) % 12 + 12) % 12
    const yellow = BELT_SPIRITS[belt].yellow
    let score = yellow ? 70 : 40
    if (isSixCombine(i, day.day.branch)) score += 15
    if (isClash(i, day.day.branch)) score -= 20
    return { branch: i, pillar: p, range: BRANCHES[i].hourRange, belt, yellow, score: Math.max(5, Math.min(95, score)) }
  })
}

export { annualPillar, ganzhiName }
export type { Pillar }
