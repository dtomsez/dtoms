import { useMemo, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { computeChart, ganzhiName } from '../lib/bazi'
import { computeDay, personalResonance, hourPillarsOf } from '../lib/tongshu'
import { STEMS, BRANCHES, ELEMENTS, DAY_OFFICERS, CONSTELLATIONS, BELT_SPIRITS } from '../lib/data'
import { Card, SectionTitle, ScoreRing, Modal } from './ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TH_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
const TH_DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

export default function TongShuModule() {
  const { birth } = useAppStore()
  const chart = useMemo(() => birth ? computeChart(birth) : null, [birth])
  const today = new Date()
  const [ym, setYm] = useState({ y: today.getFullYear(), m: today.getMonth() + 1 })
  const [sel, setSel] = useState({ y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() })
  const [showHours, setShowHours] = useState(false)

  const dayInfo = useMemo(() => computeDay(sel.y, sel.m, sel.d), [sel])
  const resonance = useMemo(() => chart ? personalResonance(dayInfo, chart) : null, [dayInfo, chart])
  const hours = useMemo(() => hourPillarsOf(dayInfo), [dayInfo])

  const monthGrid = useMemo(() => {
    const first = new Date(ym.y, ym.m - 1, 1)
    const daysInMonth = new Date(ym.y, ym.m, 0).getDate()
    const cells: ({ d: number; score: number; yellow: boolean } | null)[] = Array(first.getDay()).fill(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const info = computeDay(ym.y, ym.m, d)
      cells.push({ d, score: info.starScore, yellow: BELT_SPIRITS[info.belt].yellow })
    }
    return cells
  }, [ym])

  const prevM = () => setYm(s => s.m === 1 ? { y: s.y - 1, m: 12 } : { y: s.y, m: s.m - 1 })
  const nextM = () => setYm(s => s.m === 12 ? { y: s.y + 1, m: 1 } : { y: s.y, m: s.m + 1 })

  const officer = DAY_OFFICERS[dayInfo.officer]
  const cons = CONSTELLATIONS[dayInfo.constellation]
  const belt = BELT_SPIRITS[dayInfo.belt]
  const isToday = (d: number) => ym.y === today.getFullYear() && ym.m === today.getMonth() + 1 && d === today.getDate()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gold-100">ปฏิทินมงคล Tong Shu 通勝</h1>
        <p className="text-xs text-night-300 mt-0.5">เลือกวันดี เลี่ยงวันร้าย พร้อมวิเคราะห์ความเข้ากันกับดวงส่วนตัวของคุณ</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* calendar */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevM} className="p-1.5 rounded-lg hover:bg-night-700 text-night-300"><ChevronLeft size={16} /></button>
            <div className="text-sm font-semibold text-gold-200">{TH_MONTHS[ym.m - 1]} {ym.y + 543}</div>
            <button onClick={nextM} className="p-1.5 rounded-lg hover:bg-night-700 text-night-300"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-night-400 mb-1">
            {TH_DOW.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((c, i) => c === null ? <div key={i} /> : (
              <button key={i} onClick={() => setSel({ y: ym.y, m: ym.m, d: c.d })}
                className={`relative aspect-square rounded-lg text-xs flex flex-col items-center justify-center border transition
                  ${sel.d === c.d && sel.m === ym.m && sel.y === ym.y ? 'border-gold-400 bg-gold-500/15 text-gold-100 font-bold' : 'border-transparent hover:bg-night-700 text-night-200'}
                  ${isToday(c.d) ? 'ring-1 ring-purple-400/60' : ''}`}>
                {c.d}
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${c.score >= 65 ? 'bg-green-400' : c.score <= 38 ? 'bg-red-400' : 'bg-night-500'}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-3 text-[10px] text-night-400 justify-center">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" />วันดี (Yellow Belt)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-night-500" />กลาง</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />วันพึงระวัง</span>
          </div>
          <div className="mt-3 text-[11px] text-night-300 text-center border-t border-night-700 pt-2">
            เดือนนักษัตร: {ganzhiName(dayInfo.month)} (เดือน{BRANCHES[dayInfo.month.branch].th}) · ปี{BRANCHES[dayInfo.year.branch].th}
          </div>
        </Card>

        {/* day detail */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="text-[11px] text-night-300">วันที่เลือก</div>
                <div className="text-lg font-bold text-gold-100">{sel.d} {TH_MONTHS[sel.m - 1]} {sel.y + 543}</div>
                <div className="text-sm text-night-200 mt-1">
                  วัน <span className="font-bold" style={{ color: ELEMENTS[STEMS[dayInfo.day.stem].element].color }}>{ganzhiName(dayInfo.day)}</span>
                  {' '}(วัน{BRANCHES[dayInfo.day.branch].th} ธาตุ{ELEMENTS[STEMS[dayInfo.day.stem].element].th})
                </div>
              </div>
              <div className="text-center">
                <ScoreRing score={dayInfo.starScore} label="Star Power" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-2 mt-4">
              <div className={`rounded-xl p-3 border ${officer.quality === 'auspicious' ? 'border-gold-500/40 bg-gold-500/5' : officer.quality === 'inauspicious' ? 'border-red-500/40 bg-red-500/5' : 'border-night-600 bg-night-700/40'}`}>
                <div className="text-[10px] text-night-400">Day Officer 十二建除</div>
                <div className="text-sm font-bold text-gold-200 mt-0.5">{officer.cn} {officer.th}</div>
                <div className="text-[10px] mt-1 text-night-300">✅ {officer.good}</div>
                <div className="text-[10px] mt-0.5 text-night-400">⛔ {officer.bad}</div>
              </div>
              <div className={`rounded-xl p-3 border ${belt.yellow ? 'border-gold-500/40 bg-gold-500/5' : 'border-night-600 bg-night-800/60'}`}>
                <div className="text-[10px] text-night-400">Yellow & Black Belt</div>
                <div className="text-sm font-bold mt-0.5">
                  <span className={belt.yellow ? 'text-gold-300' : 'text-night-200'}>{belt.yellow ? '🟡' : '⚫'} {belt.cn} {belt.th}</span>
                </div>
                <div className="text-[10px] mt-1 text-night-300">{belt.note}</div>
              </div>
              <div className={`rounded-xl p-3 border ${cons.auspicious ? 'border-gold-500/40 bg-gold-500/5' : 'border-night-600 bg-night-700/40'}`}>
                <div className="text-[10px] text-night-400">28 Constellations 二十八宿</div>
                <div className="text-sm font-bold text-purple-200 mt-0.5">{cons.cn} {cons.th} ({cons.animal})</div>
                <div className="text-[10px] mt-1 text-night-300">{cons.note}</div>
              </div>
            </div>

            {/* day stars */}
            {dayInfo.stars.length > 0 && (
              <div className="mt-3">
                <div className="text-[11px] text-night-400 mb-1.5">Day Stars ดาวประจำวัน</div>
                <div className="flex flex-wrap gap-1.5">
                  {dayInfo.stars.map((s, i) => (
                    <span key={i} title={s.desc} className={`text-[11px] rounded-full px-2.5 py-1 border cursor-help ${s.auspicious ? 'border-gold-500/40 bg-gold-500/10 text-gold-200' : 'border-red-500/40 bg-red-500/10 text-red-200'}`}>
                      {s.auspicious ? '⭐' : '⚠️'} {s.name} {s.cn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 text-[11px] text-purple-200 bg-purple-500/10 border border-purple-400/25 rounded-xl px-3 py-2">
              ䷀ XKDG: {dayInfo.xkdgNote}
            </div>
          </Card>

          {/* personal resonance */}
          <Card className="!border-purple-400/25">
            <SectionTitle icon="💫" title="Personal Resonance" sub="ความเข้ากันระหว่างดวงของคุณกับวันนี้" />
            {resonance ? (
              <div>
                <div className="flex items-center gap-4">
                  <ScoreRing score={resonance.score} label="คะแนนส่วนตัว" />
                  <div>
                    <div className="text-base font-bold text-gold-100">{resonance.verdict}</div>
                    <div className={`text-xs mt-1 ${resonance.elementAligned ? 'text-green-300' : 'text-night-300'}`}>
                      ⚖️ Element Alignment: {resonance.elementNote}
                    </div>
                  </div>
                </div>
                {resonance.notes.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {resonance.notes.map((n, i) => (
                      <div key={i} className={`text-[11px] rounded-lg px-3 py-1.5 ${n.good ? 'bg-green-500/10 text-green-200' : 'bg-red-500/10 text-red-200'}`}>
                        {n.good ? '◆' : '◇'} {n.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-night-300">กรอกวันเกิดในโมดูล BaZi ก่อน เพื่อปลดล็อกการวิเคราะห์ความเข้ากันส่วนบุคคล</p>
            )}
          </Card>

          <button onClick={() => setShowHours(true)}
            className="w-full bg-night-800/80 border border-gold-500/25 rounded-2xl py-3 text-sm text-gold-200 hover:border-gold-400/50 transition">
            🕐 ดูเสาเวลาทั้ง 12 ช่วงของวันนี้ (Hour Pillars) →
          </button>
        </div>
      </div>

      <Modal open={showHours} onClose={() => setShowHours(false)} title={`เสาเวลา 12 ช่วง — วัน${ganzhiName(dayInfo.day)}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {hours.map(h => (
            <div key={h.branch} className={`rounded-xl p-3 border text-center ${h.yellow ? 'border-gold-500/40 bg-gold-500/5' : 'border-night-600 bg-night-800/50'}`}>
              <div className="text-[10px] text-night-400">{h.range}</div>
              <div className="text-lg font-bold text-gold-200 mt-0.5">{ganzhiName(h.pillar)}</div>
              <div className="text-[10px] text-night-300">ยาม{BRANCHES[h.branch].th}</div>
              <div className={`text-[10px] mt-1 font-medium ${h.yellow ? 'text-gold-300' : 'text-night-400'}`}>
                {h.yellow ? '🟡 ' : '⚫ '}{BELT_SPIRITS[h.belt].cn} {BELT_SPIRITS[h.belt].th}
              </div>
              <div className="h-1 bg-night-600 rounded-full mt-2 overflow-hidden">
                <div className={`h-full rounded-full ${h.score >= 65 ? 'bg-green-400' : h.score <= 38 ? 'bg-red-400' : 'bg-gold-400'}`} style={{ width: `${h.score}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-night-400 mt-3">🟡 ยามทางเหลือง (มงคล) · ⚫ ยามทางดำ (พึงระวัง) — คะแนนรวมการประสาน/ชงกับราศีวัน</p>
      </Modal>
    </div>
  )
}
