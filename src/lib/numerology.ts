// ── เลขศาสตร์ (Numerology) engine — phone number & personal number analysis ──

import { DIGIT_ELEMENT, DIGIT_MEANING, LIFE_NUMBERS, PAIR_SCORES, ELEMENTS, ELEMENT_KEYS } from './data'
import type { ElementKey } from './data'
import type { ChartAnalysis } from './bazi'
import { STEMS } from './data'

export interface PairAnalysis {
  pair: string
  score: number // 1-5
  meaning: string
}

export interface PhoneAnalysis {
  digits: string
  sum: number
  lifeNumber: number
  lifeInfo: { th: string; desc: string }
  pairs: PairAnalysis[]
  pairScore: number       // 0-100 from pair table
  elementDist: Record<ElementKey, number>
  elementScore: number    // 0-100 vs useful god
  elementNote: string
  totalScore: number
  verdict: string
  recommendation: string
}

function reduceToDigit(n: number): number {
  while (n > 9) n = String(n).split('').reduce((s, c) => s + Number(c), 0)
  return n === 0 ? 9 : n
}

export function analyzePhone(raw: string, chart: ChartAnalysis | null): PhoneAnalysis | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 9 || digits.length > 10) return null

  const sum = digits.split('').reduce((s, c) => s + Number(c), 0)
  const lifeNumber = reduceToDigit(sum)

  // sequential pairs (skip leading 0X operator prefix for scoring weight but still show)
  const pairs: PairAnalysis[] = []
  for (let i = 0; i < digits.length - 1; i++) {
    const pair = digits[i] + digits[i + 1]
    const known = PAIR_SCORES[pair]
    pairs.push(known
      ? { pair, score: known.score, meaning: known.meaning }
      : { pair, score: 3, meaning: `${DIGIT_MEANING[pair[0]]} ผสาน ${DIGIT_MEANING[pair[1]]}`.slice(0, 60) })
  }
  // weight: last 4 digits count double (Thai convention: ท้ายเบอร์สำคัญสุด)
  let wSum = 0, wTotal = 0
  pairs.forEach((p, i) => {
    const w = i >= pairs.length - 4 ? 2 : 1
    wSum += p.score * w
    wTotal += 5 * w
  })
  const pairScore = Math.round((wSum / wTotal) * 100)

  // element distribution (Ho Tu mapping)
  const elementDist: Record<ElementKey, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  digits.split('').forEach(c => { elementDist[DIGIT_ELEMENT[c]]++ })

  let elementScore = 50
  let elementNote = 'ยังไม่ได้ผูกดวง BaZi — คะแนนธาตุคิดจากความสมดุลของเบอร์ล้วนๆ'
  if (chart) {
    const usefulCount = elementDist[chart.usefulGod] + elementDist[chart.secondaryGod] * 0.6
    const avoidCount = elementDist[chart.avoidElement]
    elementScore = Math.round(Math.max(5, Math.min(95, 50 + usefulCount * 8 - avoidCount * 7)))
    const u = ELEMENTS[chart.usefulGod]
    elementNote = elementScore >= 65
      ? `เบอร์นี้อุดมด้วยธาตุ${u.th} (${u.cn}) ซึ่งเป็นเทพประโยชน์ของดวงคุณ — ยิ่งใช้ยิ่งดึงจังหวะดีเข้ามา`
      : elementScore <= 40
        ? `เบอร์นี้หนักไปทางธาตุ${ELEMENTS[chart.avoidElement].th}ที่ดวงคุณควรเลี่ยง — พลังเบอร์ต้านกระแสดวง`
        : `สัดส่วนธาตุของเบอร์เป็นกลางต่อดวงคุณ — ใช้ได้ ไม่หนุนแรงแต่ไม่ฉุด`
  } else {
    const spread = ELEMENT_KEYS.filter(k => elementDist[k] > 0).length
    elementScore = 30 + spread * 10
  }

  const totalScore = Math.round(pairScore * 0.6 + elementScore * 0.4)
  const verdict = totalScore >= 80 ? 'เบอร์มงคลระดับแพลตตินัม' :
    totalScore >= 65 ? 'เบอร์ดี เกื้อหนุนดวง' :
    totalScore >= 50 ? 'เบอร์กลางๆ ใช้ได้' :
    totalScore >= 35 ? 'เบอร์มีจุดต้องระวัง' : 'เบอร์ฉุดดวง ควรพิจารณาเปลี่ยน'

  const worst = [...pairs].sort((a, b) => a.score - b.score)[0]
  const best = [...pairs].sort((a, b) => b.score - a.score)[0]
  const recommendation = totalScore >= 65
    ? `จุดแข็งของเบอร์คือคู่เลข ${best.pair} (${best.meaning}) — เหมาะใช้เป็นเบอร์ติดต่องานและการเงิน`
    : `คู่เลขที่ฉุดพลังคือ ${worst.pair} (${worst.meaning}) — หากเปลี่ยนเบอร์ ให้เลี่ยงคู่นี้และเพิ่มเลขธาตุ${chart ? ELEMENTS[chart.usefulGod].th : 'ที่สมดุล'}ในสี่ตัวท้าย`

  return { digits, sum, lifeNumber, lifeInfo: LIFE_NUMBERS[lifeNumber], pairs, pairScore, elementDist, elementScore, elementNote, totalScore, verdict, recommendation }
}

export function personalNumber(chart: ChartAnalysis): { num: number; info: { th: string; desc: string }; note: string } {
  // derive personal number from day pillar ganzhi (1-9 cycle)
  const num = (chart.pillars.day.ganzhi % 9) + 1
  const dmEl = STEMS[chart.dayMaster].element
  return {
    num,
    info: LIFE_NUMBERS[num],
    note: `คำนวณจากเสาวันเกิด ${STEMS[chart.pillars.day.stem].cn} ผสานธาตุ${ELEMENTS[dmEl].th}ประจำตัวคุณ`,
  }
}
