// ── Sesheta AI — on-device destiny advisor ──
// Deterministic reply engine: every answer is grounded in the user's real
// computed chart (zero-hallucination: pillar data is injected, transits are
// computed server-side-equivalent locally with the same engine).

import { ELEMENTS, STEMS, BRANCHES, TEN_GODS, DAY_MASTER_ARCHETYPES, STRENGTH_LEVELS, DAY_OFFICERS, BELT_SPIRITS } from './data'
import type { ChartAnalysis } from './bazi'
import { annualPillar, monthPillar, tenGodOf, elementRelation } from './bazi'
import { computeDay, personalResonance } from './tongshu'

export interface ChatMessage {
  role: 'user' | 'ai'
  text: string
  time: number
}

const CURRENT_YEAR = () => new Date().getFullYear()

function dmName(c: ChartAnalysis) {
  const s = STEMS[c.dayMaster]
  return `${s.cn} (${ELEMENTS[s.element].th}${s.yang ? 'หยาง' : 'ยิน'})`
}

function findGodElement(c: ChartAnalysis, keys: string[]): string {
  // which element plays the given ten-god roles for this day master
  for (let stem = 0; stem < 10; stem++) {
    const g = TEN_GODS[tenGodOf(c.dayMaster, stem)]
    if (keys.includes(g.key)) return ELEMENTS[STEMS[stem].element].th
  }
  return '—'
}

function currentLuck(c: ChartAnalysis) {
  const age = CURRENT_YEAR() - c.birth.year
  return c.luckPillars.find(lp => age >= lp.startAge && age < lp.endAge) ?? c.luckPillars[0]
}

function transitReading(c: ChartAnalysis, year: number, month?: number): string {
  const ap = annualPillar(year)
  const god = TEN_GODS[tenGodOf(c.dayMaster, ap.stem)]
  const rel = elementRelation(STEMS[ap.stem].element, STEMS[c.dayMaster].element)
  const el = ELEMENTS[STEMS[ap.stem].element]
  let base = `ปี ${year} เป็นปี ${STEMS[ap.stem].cn}${BRANCHES[ap.branch].cn} (ธาตุ${el.th} ${el.cn} / ปี${BRANCHES[ap.branch].th}) เดินเข้าตำแหน่ง "${god.th}" (${god.cn}) ต่อดวงคุณ — ${god.meaning}`
  if (STEMS[ap.stem].element === c.usefulGod) base += `\n\n✨ ธาตุปีตรงกับ "เทพประโยชน์" ของคุณพอดี นี่คือปีที่กระแสฟ้าหนุนหลัง เหมาะเดินเกมรุกเรื่องที่วางแผนมานาน`
  else if (STEMS[ap.stem].element === c.avoidElement) base += `\n\n⚠️ ธาตุปีเป็นธาตุที่ดวงคุณควรเลี่ยง ปีนี้เหมาะตั้งรับ เก็บกระแสเงินสด และลับคมทักษะมากกว่าขยายตัวแรงๆ`
  else if (rel === 'producedBy') base += `\n\nธาตุปีหล่อเลี้ยงเจ้าวันของคุณ — พลังกายใจถูกเติม เหมาะเริ่มสิ่งที่ต้องใช้ความอึด`
  if (month) {
    const mp = monthPillar(year, month, 15)
    const mgod = TEN_GODS[tenGodOf(c.dayMaster, mp.stem)]
    base += `\n\nเจาะเดือน ${month}/${year}: เสาเดือนคือ ${STEMS[mp.stem].cn}${BRANCHES[mp.branch].cn} เดินตำแหน่ง "${mgod.th}" — ${mgod.meaning} จังหวะเดือนนี้จึงเด่นด้านนี้เป็นพิเศษ`
  }
  const lp = currentLuck(c)
  base += `\n\nภาพใหญ่: ตอนนี้คุณอยู่ในเสาโชค ${STEMS[lp.pillar.stem].cn}${BRANCHES[lp.pillar.branch].cn} (อายุ ${lp.startAge}–${lp.endAge} ปี) ตำแหน่ง "${TEN_GODS[lp.tenGod].th}" — ใช้ทศวรรษนี้ให้ตรงจุดแข็งของตำแหน่งนี้ครับ`
  return base
}

function goodDaysReading(c: ChartAnalysis): string {
  const now = new Date()
  const results: { d: Date; score: number; officer: string }[] = []
  for (let i = 1; i <= 30; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const info = computeDay(d.getFullYear(), d.getMonth() + 1, d.getDate())
    const res = personalResonance(info, c)
    results.push({ d, score: res.score, officer: DAY_OFFICERS[info.officer].th })
  }
  const top = results.sort((a, b) => b.score - a.score).slice(0, 3)
  const fmt = (x: { d: Date; score: number; officer: string }) =>
    `• ${x.d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })} — คะแนนส่วนบุคคล ${x.score}/100, ธาตุวัน${x.officer}`
  return `ผมสแกนฤกษ์ 30 วันข้างหน้าเทียบกับดวง BaZi ของคุณแบบรายวันแล้ว วันที่กระแสหนุนคุณแรงที่สุด 3 อันดับคือ:\n\n${top.map(fmt).join('\n')}\n\nสามวันนี้ราศีวันเข้าประสานกับเสาในดวงคุณและธาตุวันหนุนเทพประโยชน์ (${ELEMENTS[c.usefulGod].th}) — เหมาะวางนัดเซ็นสัญญา เปิดตัว หรือเจรจาดีลสำคัญครับ อยากให้เจาะฤกษ์ยามรายชั่วโมงของวันไหน บอกได้เลย`
}

export function generateReply(c: ChartAnalysis, question: string): string {
  const q = question.toLowerCase()
  const arch = DAY_MASTER_ARCHETYPES[c.dayMaster]
  const u = ELEMENTS[c.usefulGod]

  // year/month transit questions
  const yearMatch = q.match(/(20\d{2}|25\d{2})/)
  if (yearMatch || q.includes('ปีหน้า') || q.includes('ปีนี้') || q.includes('เดือนหน้า') || q.includes('เดือนนี้')) {
    let year = CURRENT_YEAR()
    let month: number | undefined
    if (yearMatch) {
      year = Number(yearMatch[1])
      if (year > 2400) year -= 543 // พ.ศ. → ค.ศ.
    } else if (q.includes('ปีหน้า')) year += 1
    const now = new Date()
    if (q.includes('เดือนหน้า')) { month = now.getMonth() + 2; if (month > 12) { month = 1; year += 1 } }
    if (q.includes('เดือนนี้')) month = now.getMonth() + 1
    return transitReading(c, year, month)
  }

  if (q.includes('วันไหนดี') || q.includes('ฤกษ์') || q.includes('วันดี') || q.includes('วันมงคล')) {
    return goodDaysReading(c)
  }

  if (q.includes('เงิน') || q.includes('การเงิน') || q.includes('ลงทุน') || q.includes('รวย') || q.includes('ทรัพย์')) {
    const wealthEl = findGodElement(c, ['DW', 'IW'])
    const iw = c.tenGodProfile['IW'] ?? 0
    const dw = c.tenGodProfile['DW'] ?? 0
    const style = iw > dw
      ? 'ดวงคุณเด่น "ทรัพย์จร" (偏財) — เงินก้อนใหญ่มักมาจากจังหวะ การลงทุน และดีลพิเศษ มากกว่าเงินเดือนประจำ จุดชี้ขาดคือวินัยในการล็อกกำไร'
      : 'ดวงคุณเด่น "ทรัพย์ตรง" (正財) — ความมั่งคั่งของคุณโตแบบทบต้นจากความสม่ำเสมอ ระบบและวินัยคือเครื่องปั๊มเงินที่แท้จริง'
    return `วิเคราะห์การเงินจากดวงจริงของคุณ:\n\nธาตุทรัพย์ของเจ้าวัน ${dmName(c)} คือธาตุ${wealthEl} — สังเกตว่าจังหวะเงินของคุณจะขยับตามกระแสธาตุนี้ในแต่ละปี\n\n${style}\n\nเจ้าวันคุณ${STRENGTH_LEVELS[c.strength].th} ${c.strength >= 2 ? 'จึง "แบกทรัพย์ไหว" — รับดีลใหญ่และถือสินทรัพย์หนักได้โดยดวงไม่แตก' : 'จึงควรเสริมกำลังตัวเอง (ทีม พันธมิตร ความรู้) ก่อนขยายพอร์ตใหญ่ ไม่งั้นทรัพย์จะกลายเป็นภาระ'}\n\nธาตุนำโชคของคุณคือ${u.th} (${u.cn}) — เข้าหาธุรกิจ ผู้คน และทิศทางที่สังกัดธาตุนี้ แล้วกระแสเงินจะไหลเข้าง่ายขึ้นครับ`
  }

  if (q.includes('รัก') || q.includes('แฟน') || q.includes('คู่') || q.includes('แต่งงาน') || q.includes('ความสัมพันธ์')) {
    const spouseGod = c.birth.gender === 'male' ? findGodElement(c, ['DW', 'IW']) : findGodElement(c, ['DO', 'SK'])
    const peach = c.stars.some(s => s.cn === '桃花')
    return `เรื่องความสัมพันธ์ ผมอ่านจากตำแหน่งคู่ครองในดวงคุณโดยตรง:\n\nเสาวันของคุณคือ ${STEMS[c.pillars.day.stem].cn}${BRANCHES[c.pillars.day.branch].cn} — "บ้านคู่ครอง" อยู่ที่ราศี${BRANCHES[c.pillars.day.branch].th} ธาตุคู่ครองของคุณคือธาตุ${spouseGod}\n\n${peach ? '💮 ดวงคุณมีดาวดอกท้อ (桃花) — เสน่ห์เป็นทุนติดตัว คนเข้าหาไม่ขาด โจทย์ของคุณไม่ใช่ "หา" แต่คือ "เลือกและรักษา"' : 'ดวงคุณไม่เน้นดาวเสน่ห์ฉาบฉวย — ความสัมพันธ์ของคุณโตจากความไว้วางใจระยะยาว แบบเดียวกับที่คุณสร้างทุกอย่างในชีวิต'}\n\nสไตล์ ${arch.codename} อย่างคุณ ${c.strength >= 2 ? 'มักเผลอเป็นฝ่าย "ให้ความมั่นคง" จนลืมแสดงความอ่อนโยน — เปิดพื้นที่ให้อีกฝ่ายดูแลคุณบ้าง สมดุลจะกลับมา' : 'ต้องการคู่ที่เป็นพลังหนุน ไม่ใช่ภาระเพิ่ม — เลือกคนที่เติมธาตุ' + u.th + 'ให้ชีวิตคุณ แล้วดวงจะยกทั้งกระดาน'}\n\nอยากรู้ปีที่ดาวคู่ครองเข้าจังหวะ ลองถามผมว่า "ความรักปีหน้าเป็นยังไง" ได้เลยครับ`
  }

  if (q.includes('งาน') || q.includes('อาชีพ') || q.includes('เจ้านาย') || q.includes('ธุรกิจ') || q.includes('เปลี่ยนงาน')) {
    const topGod = Object.entries(c.tenGodProfile).sort((a, b) => b[1] - a[1])[0]
    const g = TEN_GODS.find(x => x.key === topGod[0])!
    return `วิเคราะห์เส้นทางการงานจากโครงสร้างดวงคุณ:\n\nพลังเด่นสุดในดวงคือ "${g.th}" (${g.cn}) — ${g.meaning}\n\nเจ้าวัน ${dmName(c)} + โครงสร้าง${['ปกติ', 'ตามกระแส', 'เอกฉันท์', 'พิเศษ'][c.structure]} ทำให้คุณเหมาะกับบทบาทแบบ ${arch.codename}\n\nจุดแข็งที่ตลาดยอมจ่ายแพง:\n${arch.strengths.map(s => `• ${s}`).join('\n')}\n\nทิศทางที่หนุนดวง: งาน/อุตสาหกรรมสังกัดธาตุ${u.th} (${u.cn}) ${u.emoji} — เมื่อสภาพแวดล้อมเป็นธาตุนำโชค ความพยายามเท่าเดิมแต่ผลตอบแทนคูณสองครับ\n\n${arch.caution}`
  }

  if (q.includes('สุขภาพ') || q.includes('ป่วย') || q.includes('ร่างกาย') || q.includes('นอน')) {
    const dmEl = STEMS[c.dayMaster].element
    const organ: Record<string, string> = { wood: 'ตับ ถุงน้ำดี เส้นเอ็น และดวงตา', fire: 'หัวใจ ระบบไหลเวียนเลือด และการนอน', earth: 'กระเพาะ ม้าม ระบบย่อย และกล้ามเนื้อ', metal: 'ปอด ลำไส้ใหญ่ ผิวหนัง และทางเดินหายใจ', water: 'ไต กระเพาะปัสสาวะ กระดูก และฮอร์โมน' }
    const weak = c.avoidElement
    return `เช็คสุขภาพตามแผนที่ธาตุในดวงคุณ:\n\nเจ้าวันธาตุ${ELEMENTS[dmEl].th} — อวัยวะประจำธาตุคือ ${organ[dmEl]} นี่คือ "ฐานทัพสุขภาพ" ที่ต้องดูแลเป็นอันดับแรก\n\nสัดส่วนธาตุในดวง: ${(['wood', 'fire', 'earth', 'metal', 'water'] as const).map(k => `${ELEMENTS[k].th} ${c.elementPercent[k]}%`).join(' · ')}\n\nธาตุ${ELEMENTS[weak].th}ในดวงคุณ${c.elementPercent[weak] > 25 ? 'ล้นเกิน — ระวังอาการที่เกี่ยวกับ' : 'ต้องจับตา — จุดเปราะคือ'} ${organ[weak]}\n\nคำแนะนำเชิงธาตุ: เพิ่มกิจกรรม อาหาร และสีสังกัดธาตุ${u.th} (${u.cn}) เพื่อปรับสมดุลทั้งระบบ ${c.strength <= 1 ? 'ดวงเจ้าวันอ่อน อย่าอดนอนสะสม — พลังชีวิตคุณคือทุนที่ต้องรักษาที่สุด' : 'ดวงเจ้าวันแข็ง ออกกำลังหนักได้ แต่ต้องมีทางระบายพลัง ไม่งั้นจะกลายเป็นความเครียด'}ครับ`
  }

  // default: full personality reading
  return `ผมคือ Sesheta ที่ปรึกษาดวงชะตาส่วนตัวของคุณ — คำตอบทุกคำอ้างอิงจากดวงจริง ไม่ใช่คำตอบทั่วไป\n\nดวงของคุณโดยสรุป:\n• เจ้าวัน: ${dmName(c)} — "${arch.title}"\n• ความแข็งแรง: ${STRENGTH_LEVELS[c.strength].th} (${c.strengthScore}%)\n• เทพประโยชน์: ธาตุ${u.th} (${u.cn}) ${u.emoji}\n• ดาวเด่น: ${c.stars.filter(s => s.auspicious).slice(0, 3).map(s => s.name).join(', ') || 'ดวงสายทำเอง ไม่พึ่งดาว'}\n\n${arch.essence}\n\nลองถามผมเจาะลึกได้ทุกด้าน เช่น:\n💰 "การเงินปีนี้เป็นยังไง"\n❤️ "ความรักของฉันล่ะ"\n💼 "ควรเปลี่ยนงานไหม"\n🏥 "สุขภาพต้องระวังอะไร"\n📅 "เดือนหน้าวันไหนดีสำหรับเซ็นสัญญา"`
}

export const QUICK_PROMPTS = [
  '💰 การเงินปีนี้เป็นยังไง',
  '❤️ ความรักของฉันล่ะ',
  '💼 ควรเปลี่ยนงานไหม',
  '📅 วันไหนดีสำหรับเริ่มเรื่องสำคัญ',
  '🏥 สุขภาพต้องระวังอะไร',
  '🔮 ปีหน้าดวงเป็นยังไง',
]

// ── Auspicious-time chat mode (โหมดวิเคราะห์ฤกษ์ยาม) ──
export function generateTimingReply(question: string): string {
  const q = question.toLowerCase()
  const now = new Date()
  const dateMatch = q.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/)
  let y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate()
  if (dateMatch) {
    d = Number(dateMatch[1]); m = Number(dateMatch[2])
    if (dateMatch[3]) { y = Number(dateMatch[3]); if (y < 100) y += 2000; if (y > 2400) y -= 543 }
  } else if (q.includes('พรุ่งนี้')) {
    const t = new Date(now); t.setDate(t.getDate() + 1)
    y = t.getFullYear(); m = t.getMonth() + 1; d = t.getDate()
  }
  const info = computeDay(y, m, d)
  const officer = DAY_OFFICERS[info.officer]
  const belt = BELT_SPIRITS[info.belt]
  return `ฤกษ์วันที่ ${d}/${m}/${y} ตามหลักถงซู (通勝):\n\n• เสาวัน: ${STEMS[info.day.stem].cn}${BRANCHES[info.day.branch].cn} (วัน${BRANCHES[info.day.branch].th})\n• เทพประจำวัน (十二建除): ${officer.th} — ${officer.quality === 'auspicious' ? '✅ วันเทพมงคล' : officer.quality === 'inauspicious' ? '⛔ วันเทพร้าย' : '➖ วันกลาง'}\n  เหมาะ: ${officer.good}\n  เลี่ยง: ${officer.bad}\n• เข็มขัดฟ้า: ${belt.cn} ${belt.th} — ${belt.yellow ? '🟡 ทางเหลือง (มงคล)' : '⚫ ทางดำ (พึงระวัง)'} ${belt.note}\n• คะแนนพลังดาวรวมของวัน: ${info.starScore}/100\n${info.stars.length ? info.stars.map(s => `  ${s.auspicious ? '⭐' : '⚠️'} ${s.name} (${s.cn}) — ${s.desc}`).join('\n') : ''}\n\n${info.xkdgNote}\n\nอยากได้ฤกษ์ยามรายชั่วโมงของวันนี้ หรือเทียบกับดวงส่วนตัวของคุณ (Personal Resonance) เปิดดูได้ในโมดูลปฏิทินมงคลครับ`
}
