import { useMemo, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { computeQimen, computeDestiny, QM_STARS, QM_DOORS, QM_DEITIES, PALACE_INFO } from '../lib/qimen'
import type { ChartType, PalaceState } from '../lib/qimen'
import { STEMS, ELEMENTS } from '../lib/data'
import { ganzhiName } from '../lib/bazi'
import { Card, SectionTitle, Modal } from './ui'
import { ChevronLeft, ChevronRight, Compass, Sparkles } from 'lucide-react'

// grid layout: luoshu palaces arranged geographically (south top, per tradition)
const GRID: number[] = [4, 9, 2, 3, 5, 7, 8, 1, 6]

const TYPE_LABEL: Record<ChartType, string> = { hour: 'รายชั่วโมง 時盤', day: 'รายวัน 日盤', month: 'รายเดือน 月盤', year: 'รายปี 年盤' }

export default function QiMenModule() {
  const { birth } = useAppStore()
  const now = new Date()
  const [dt, setDt] = useState({ y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate(), h: now.getHours() })
  const [type, setType] = useState<ChartType>('hour')
  const [view, setView] = useState<'chart' | 'destiny'>('chart')
  const [palaceSel, setPalaceSel] = useState<PalaceState | null>(null)

  const chart = useMemo(() => computeQimen(dt.y, dt.m, dt.d, dt.h, type), [dt, type])
  const destiny = useMemo(() => birth ? computeDestiny(birth.year, birth.month, birth.day, birth.hour) : null, [birth])

  const shiftHour = (n: number) => {
    const cur = new Date(dt.y, dt.m - 1, dt.d, dt.h)
    cur.setHours(cur.getHours() + n)
    setDt({ y: cur.getFullYear(), m: cur.getMonth() + 1, d: cur.getDate(), h: cur.getHours() })
  }
  const setNow = () => {
    const n2 = new Date()
    setDt({ y: n2.getFullYear(), m: n2.getMonth() + 1, d: n2.getDate(), h: n2.getHours() })
  }

  const activeChart = view === 'destiny' && destiny ? destiny.chart : chart
  const highlightPalace = view === 'destiny' && destiny ? destiny.destinyPalace : null

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gold-100">ฉีเหมินตุ้นเจี่ย 奇門遁甲</h1>
          <p className="text-xs text-night-300 mt-0.5">ผัง 9 วัง — ดาว ประตู เทพ และราศีฟ้า-ดิน สำหรับการทำนายและเลือกทิศ</p>
        </div>
        <div className="flex rounded-xl border border-night-600 overflow-hidden">
          <button onClick={() => setView('chart')} className={`px-3 py-1.5 text-xs ${view === 'chart' ? 'bg-gold-500/20 text-gold-200' : 'text-night-300'}`}>
            <Compass size={12} className="inline mr-1" />ผังเวลา
          </button>
          <button onClick={() => setView('destiny')} className={`px-3 py-1.5 text-xs ${view === 'destiny' ? 'bg-purple-500/20 text-purple-200' : 'text-night-300'}`}>
            <Sparkles size={12} className="inline mr-1" />Destiny View
          </button>
        </div>
      </div>

      {view === 'chart' && (
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            {/* 4 chart types */}
            <div className="flex rounded-xl border border-night-600 overflow-hidden">
              {(Object.keys(TYPE_LABEL) as ChartType[]).map(t => (
                <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 text-xs ${type === t ? 'bg-gold-500/20 text-gold-200' : 'text-night-300 hover:bg-night-700'}`}>
                  {TYPE_LABEL[t]}
                </button>
              ))}
            </div>
            {/* date/time picker */}
            <input type="date" value={`${dt.y}-${String(dt.m).padStart(2, '0')}-${String(dt.d).padStart(2, '0')}`}
              onChange={e => { const [y, m, d] = e.target.value.split('-').map(Number); if (y) setDt(s => ({ ...s, y, m, d })) }}
              className="bg-night-700/70 border border-night-600 rounded-lg px-2 py-1.5 text-xs [color-scheme:dark]" />
            <select value={dt.h} onChange={e => setDt(s => ({ ...s, h: Number(e.target.value) }))}
              className="bg-night-700/70 border border-night-600 rounded-lg px-2 py-1.5 text-xs">
              {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00 น.</option>)}
            </select>
            {/* quick navigation */}
            <div className="flex items-center gap-1 ml-auto">
              <button onClick={() => shiftHour(-2)} className="p-1.5 rounded-lg border border-night-600 text-night-300 hover:text-gold-300" title="ถอยหนึ่งยาม"><ChevronLeft size={14} /></button>
              <button onClick={setNow} className="text-xs px-2.5 py-1.5 rounded-lg border border-gold-500/40 text-gold-300 hover:bg-gold-500/10">ตอนนี้</button>
              <button onClick={() => shiftHour(2)} className="p-1.5 rounded-lg border border-night-600 text-night-300 hover:text-gold-300" title="เดินหน้าหนึ่งยาม"><ChevronRight size={14} /></button>
            </div>
          </div>
        </Card>
      )}

      {view === 'destiny' && !birth && (
        <Card><p className="text-sm text-night-300">กรอกวันเกิดในโมดูล BaZi ก่อน เพื่อเปิดผังดวงชะตาฉีเหมินส่วนตัว</p></Card>
      )}

      {/* summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-night-800/70 border border-night-600 rounded-xl p-3">
          <div className="text-[10px] text-night-400">สารท/ตุ้น</div>
          <div className="text-sm font-bold text-gold-200">{activeChart.term.name} {activeChart.term.th}</div>
          <div className="text-[10px] text-night-300 mt-0.5">{activeChart.yang ? '陽遁 หยางตุ้น' : '陰遁 ยินตุ้น'} จวี {activeChart.ju}</div>
        </div>
        <div className="bg-night-800/70 border border-night-600 rounded-xl p-3">
          <div className="text-[10px] text-night-400">เสาอ้างอิง ({TYPE_LABEL[activeChart.type]})</div>
          <div className="text-sm font-bold text-gold-200">{ganzhiName(activeChart.refPillar)}</div>
          <div className="text-[10px] text-night-300 mt-0.5">วัน {ganzhiName(activeChart.dayP)} · ยาม {ganzhiName(activeChart.hourP)}</div>
        </div>
        <div className="bg-night-800/70 border border-night-600 rounded-xl p-3">
          <div className="text-[10px] text-night-400">ดาวประธาน 值符</div>
          <div className="text-sm font-bold text-purple-200">{QM_STARS[activeChart.dutyStar].cn} {QM_STARS[activeChart.dutyStar].th}</div>
          <div className="text-[10px] text-night-300 mt-0.5">วังหน้าที่: วัง {activeChart.dutyPalace} ({PALACE_INFO[activeChart.dutyPalace]?.dir})</div>
        </div>
        <div className="bg-night-800/70 border border-night-600 rounded-xl p-3">
          <div className="text-[10px] text-night-400">ประตูประธาน 值使</div>
          <div className="text-sm font-bold text-gold-200">{QM_DOORS[activeChart.dutyDoor].cn} {QM_DOORS[activeChart.dutyDoor].th}</div>
          <div className="text-[10px] text-night-300 mt-0.5">{QM_DOORS[activeChart.dutyDoor].nature === 'ดี' ? '✅ ประตูมงคล' : QM_DOORS[activeChart.dutyDoor].nature === 'ร้าย' ? '⚠️ ประตูพึงระวัง' : '➖ ประตูกลาง'}</div>
        </div>
      </div>

      {/* 9-palace grid */}
      <Card>
        <SectionTitle icon="🧭" title="ผังเก้าวัง 9-Palace Grid" sub="ทิศใต้อยู่ด้านบนตามธรรมเนียม · แตะวังเพื่อดูคำอธิบาย" />
        <div className="grid grid-cols-3 gap-1.5 max-w-xl mx-auto">
          {GRID.map(pn => {
            const st = activeChart.palaces[pn]
            const info = PALACE_INFO[pn]!
            const isHl = highlightPalace === pn
            return (
              <button key={pn} onClick={() => setPalaceSel(st)}
                className={`aspect-square rounded-xl border p-1.5 sm:p-2 flex flex-col justify-between text-left transition
                  ${isHl ? 'border-purple-400 bg-purple-500/15 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : st.isDuty ? 'border-gold-400/70 bg-gold-500/10' : 'border-night-600 bg-night-800/60 hover:border-gold-500/40'}`}>
                <div className="flex justify-between items-start">
                  <span className="text-[8px] sm:text-[9px] text-night-400">{info.dir} · วัง{pn}</span>
                  {st.deity !== null && <span className="text-[9px] sm:text-[10px] text-purple-300 font-medium">{QM_DEITIES[st.deity].cn}</span>}
                </div>
                <div className="text-center">
                  <div className="text-[10px] sm:text-xs text-red-300">{QM_STARS[st.star].cn}</div>
                  {st.door !== null
                    ? <div className={`text-sm sm:text-lg font-bold ${QM_DOORS[st.door].nature === 'ดี' ? 'text-gold-300' : QM_DOORS[st.door].nature === 'ร้าย' ? 'text-red-300' : 'text-night-200'}`}>{QM_DOORS[st.door].cn}</div>
                    : <div className="text-sm sm:text-lg font-bold text-night-500">中宮</div>}
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs sm:text-base font-bold" style={{ color: ELEMENTS[STEMS[st.skyStem].element].color }}>{STEMS[st.skyStem].cn}</span>
                  <span className="text-[10px] sm:text-sm" style={{ color: ELEMENTS[STEMS[st.earthStem].element].color, opacity: 0.75 }}>{STEMS[st.earthStem].cn}</span>
                </div>
                {isHl && <div className="text-[8px] text-purple-300 text-center -mt-1">★ วังชะตาของคุณ</div>}
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-3 text-[10px] text-night-400">
          <span><span className="text-purple-300">เทพ</span> (มุมขวาบน)</span>
          <span><span className="text-red-300">ดาว</span> (กลางบน)</span>
          <span><span className="text-gold-300">ประตู</span> (กลาง)</span>
          <span>ราศีฟ้า (ซ้ายล่าง) / ราศีดิน (ขวาล่าง)</span>
        </div>
      </Card>

      {/* destiny summary */}
      {view === 'destiny' && destiny && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="!border-purple-400/30">
            <SectionTitle icon="🔮" title="วังชะตาของคุณ Destiny Palace" sub={`คำนวณจากเวลาเกิด ${birth!.day}/${birth!.month}/${birth!.year} ${String(birth!.hour).padStart(2, '0')}:00`} />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-night-700 pb-2">
                <span className="text-night-300 text-xs">วังชะตา</span>
                <span className="font-bold text-purple-200">วัง {destiny.destinyPalace} — ทิศ{PALACE_INFO[destiny.destinyPalace]?.dir}</span>
              </div>
              <div className="flex justify-between border-b border-night-700 pb-2">
                <span className="text-night-300 text-xs">ดาวชะตา</span>
                <span className="font-bold text-red-300">{QM_STARS[destiny.star].cn} {QM_STARS[destiny.star].th}</span>
              </div>
              <div className="flex justify-between border-b border-night-700 pb-2">
                <span className="text-night-300 text-xs">ประตูชะตา</span>
                <span className="font-bold text-gold-300">{destiny.door !== null ? `${QM_DOORS[destiny.door].cn} ${QM_DOORS[destiny.door].th}` : 'วังกลาง'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night-300 text-xs">จิตเทพประจำดวง</span>
                <span className="font-bold text-purple-200">{destiny.deity !== null ? `${QM_DEITIES[destiny.deity].cn} ${QM_DEITIES[destiny.deity].th}` : QM_DEITIES[0].cn}</span>
              </div>
            </div>
            <p className="text-xs text-night-200 mt-3 leading-relaxed">{QM_STARS[destiny.star].note}{destiny.door !== null ? ` · ${QM_DOORS[destiny.door].note}` : ''}</p>
          </Card>

          <Card className="!border-purple-400/30">
            <SectionTitle icon="𓁟" title="Deity Insight จิตเทพประจำดวง" sub="พลังเทพผู้พิทักษ์เบื้องหลังการตัดสินใจของคุณ" />
            {(() => {
              const deity = QM_DEITIES[destiny.deity ?? 0]
              return (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600/50 to-night-800 border border-purple-400/50 flex items-center justify-center text-2xl">𓁟</div>
                    <div>
                      <div className="text-lg font-bold text-purple-200">{deity.cn}</div>
                      <div className="text-xs text-night-300">{deity.th} · {deity.en}</div>
                    </div>
                  </div>
                  <div className="text-xs text-night-300 mb-2">คุณสมบัติ: {deity.note}</div>
                  <p className="text-sm text-gold-100 leading-relaxed bg-night-800/60 border border-gold-500/20 rounded-xl p-3">"{deity.insight}"</p>
                </div>
              )
            })()}
          </Card>
        </div>
      )}

      {/* palace detail modal */}
      <Modal open={!!palaceSel} onClose={() => setPalaceSel(null)} title={palaceSel ? `วัง ${palaceSel.palace} — ทิศ${PALACE_INFO[palaceSel.palace]?.dir}` : ''}>
        {palaceSel && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-night-800/60 rounded-xl p-3 border border-red-500/25">
                <div className="text-[10px] text-night-400">ดาว Star</div>
                <div className="font-bold text-red-300">{QM_STARS[palaceSel.star].cn} {QM_STARS[palaceSel.star].th}</div>
                <p className="text-night-200 mt-1">{QM_STARS[palaceSel.star].note}</p>
              </div>
              <div className="bg-night-800/60 rounded-xl p-3 border border-gold-500/25">
                <div className="text-[10px] text-night-400">ประตู Door</div>
                {palaceSel.door !== null ? (
                  <>
                    <div className="font-bold text-gold-300">{QM_DOORS[palaceSel.door].cn} {QM_DOORS[palaceSel.door].th}</div>
                    <p className="text-night-200 mt-1">{QM_DOORS[palaceSel.door].note}</p>
                  </>
                ) : <div className="text-night-300 mt-1">วังกลาง — ไม่มีประตูประจำ</div>}
              </div>
              <div className="bg-night-800/60 rounded-xl p-3 border border-purple-400/25">
                <div className="text-[10px] text-night-400">เทพ Deity</div>
                {palaceSel.deity !== null ? (
                  <>
                    <div className="font-bold text-purple-200">{QM_DEITIES[palaceSel.deity].cn} {QM_DEITIES[palaceSel.deity].th}</div>
                    <p className="text-night-200 mt-1">{QM_DEITIES[palaceSel.deity].note}</p>
                  </>
                ) : <div className="text-night-300 mt-1">วังกลาง — เทพฝากไว้ที่วัง 2</div>}
              </div>
              <div className="bg-night-800/60 rounded-xl p-3 border border-night-600">
                <div className="text-[10px] text-night-400">ราศี Stems</div>
                <div className="font-bold">
                  <span style={{ color: ELEMENTS[STEMS[palaceSel.skyStem].element].color }}>ฟ้า {STEMS[palaceSel.skyStem].cn}</span>
                  <span className="text-night-400 mx-1">/</span>
                  <span style={{ color: ELEMENTS[STEMS[palaceSel.earthStem].element].color }}>ดิน {STEMS[palaceSel.earthStem].cn}</span>
                </div>
                <p className="text-night-200 mt-1">ธาตุวัง: {ELEMENTS[PALACE_INFO[palaceSel.palace]!.element].th} {ELEMENTS[PALACE_INFO[palaceSel.palace]!.element].cn}</p>
              </div>
            </div>
            {palaceSel.isDuty && <div className="text-xs text-gold-300 bg-gold-500/10 border border-gold-500/30 rounded-xl px-3 py-2">★ วังนี้คือวังหน้าที่ (值符宮) ของผังนี้ — จุดพลังสูงสุดของกระดาน</div>}
          </div>
        )}
      </Modal>
    </div>
  )
}
