import { useMemo, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { computeChart, ganzhiName, tenGodOf } from '../lib/bazi'
import type { LuckPillar } from '../lib/bazi'
import {
  STEMS, BRANCHES, ELEMENTS, TEN_GODS, DAY_MASTER_ARCHETYPES,
  STRENGTH_LEVELS, STRUCTURES, TRIGRAMS, HEXAGRAM_NAMES,
} from '../lib/data'
import { annualPillar } from '../lib/bazi'
import { Card, SectionTitle, Modal, ElementBadge, ElementBar, PillarBox, ScoreRing, HexagramFigure } from './ui'
import { Pencil } from 'lucide-react'

export default function BaZiModule() {
  const { birth, setBirth } = useAppStore()
  const chart = useMemo(() => birth ? computeChart(birth) : null, [birth])
  const [detail, setDetail] = useState<null | 'strength' | 'structure' | 'useful' | 'dm'>(null)
  const [luckSel, setLuckSel] = useState<LuckPillar | null>(null)

  if (!birth || !chart) return null
  const arch = DAY_MASTER_ARCHETYPES[chart.dayMaster]
  const dmStem = STEMS[chart.dayMaster]
  const p = chart.pillars
  const pillarList = [
    { label: 'เสาชั่วโมง 時柱', pl: p.hour, note: 'ผลงาน · ลูกหลาน · บั้นปลาย' },
    { label: 'เสาวัน 日柱', pl: p.day, note: 'ตัวตน · คู่ครอง', dm: true },
    { label: 'เสาเดือน 月柱', pl: p.month, note: 'การงาน · พ่อแม่ · วัยทำงาน' },
    { label: 'เสาปี 年柱', pl: p.year, note: 'รากตระกูล · สังคม · วัยเด็ก' },
  ]
  const currentAge = new Date().getFullYear() - birth.year
  const nowLuck = chart.luckPillars.find(lp => currentAge >= lp.startAge && currentAge < lp.endAge)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gold-100">ดวงจีน BaZi 八字</h1>
          <p className="text-xs text-night-300 mt-0.5">
            {birth.name} · เกิด {birth.day}/{birth.month}/{birth.year} เวลา {String(birth.hour).padStart(2, '0')}:{String(birth.minute).padStart(2, '0')} น. · {birth.gender === 'male' ? 'ชาย' : 'หญิง'}
          </p>
        </div>
        <button onClick={() => setBirth(null as never)} className="flex items-center gap-1.5 text-xs text-night-300 hover:text-gold-300 border border-night-600 rounded-lg px-2.5 py-1.5">
          <Pencil size={12} /> แก้ไขวันเกิด
        </button>
      </div>

      {/* Day Master hero card */}
      <Card className="relative overflow-hidden !border-gold-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,80,220,0.15),transparent_60%)]" />
        <div className="relative flex items-center gap-5 flex-wrap">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-night-700 to-night-900 border border-gold-500/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(227,165,75,0.2)]">
            <span className="text-5xl leading-none">{arch.emoji}</span>
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="text-[11px] text-night-300 mb-1">ธาตุประจำตัว (Day Master)</div>
            <div className="text-2xl font-bold text-gold-100">
              {dmStem.cn} {ELEMENTS[dmStem.element].th}{dmStem.yang ? 'หยาง' : 'ยิน'} <span className="text-sm font-normal text-night-300">({dmStem.th} · {dmStem.pinyin})</span>
            </div>
            <div className="mt-1.5 text-sm text-gold-300 italic">"{arch.title}"</div>
            <div className="text-xs text-purple-300 mt-1">{arch.codename}</div>
            <button onClick={() => setDetail('dm')} className="mt-3 text-xs bg-gold-500/15 border border-gold-500/40 text-gold-200 rounded-full px-3 py-1 hover:bg-gold-500/25">
              อ่านคำวิเคราะห์เจ้าวันฉบับเต็ม →
            </button>
          </div>
        </div>
      </Card>

      {/* Natal chart */}
      <Card>
        <SectionTitle icon="☯️" title="Natal Chart ผังดวงสี่เสา" sub="Heavenly Stems (ราศีบน) & Earthly Branches (ราศีล่าง) พร้อมเทพซ่อน" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pillarList.map(({ label, pl, note, dm }) => (
            <div key={label}>
              <PillarBox
                label={label}
                highlight={dm}
                stemCn={STEMS[pl.stem].cn}
                stemSub={`${dm ? 'เจ้าวัน' : TEN_GODS[tenGodOf(chart.dayMaster, pl.stem)].th} · ${ELEMENTS[STEMS[pl.stem].element].th}${STEMS[pl.stem].yang ? '+' : '−'}`}
                stemColor={ELEMENTS[STEMS[pl.stem].element].color}
                branchCn={BRANCHES[pl.branch].cn}
                branchSub={`${BRANCHES[pl.branch].th} · ${ELEMENTS[BRANCHES[pl.branch].element].th}`}
                branchColor={ELEMENTS[BRANCHES[pl.branch].element].color}
                footer={
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {BRANCHES[pl.branch].hiddenStems.map(hs => (
                      <span key={hs} className="text-[9px] rounded px-1 py-px border" style={{ color: ELEMENTS[STEMS[hs].element].color, borderColor: ELEMENTS[STEMS[hs].element].color + '55' }}>
                        {STEMS[hs].cn} {TEN_GODS[tenGodOf(chart.dayMaster, hs)].short}
                      </span>
                    ))}
                  </div>
                }
              />
              <div className="text-[9px] text-center text-night-400 mt-1">{note}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Destiny Matrix: strength + structure + useful god + elements */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card onClick={() => setDetail('strength')}>
          <SectionTitle icon="💪" title="กำลังเจ้าวัน" sub="Strength of Day Master · แตะเพื่อดูรายละเอียด" />
          <div className="flex items-center gap-4">
            <ScoreRing score={chart.strengthScore} label="กำลังหนุน" />
            <div>
              <div className="text-xl font-bold text-gold-200">{STRENGTH_LEVELS[chart.strength].th}</div>
              <div className="text-xs text-night-300">{STRENGTH_LEVELS[chart.strength].en}</div>
              <div className="flex gap-1 mt-2">
                {STRENGTH_LEVELS.map((lv, i) => (
                  <div key={lv.key} className={`h-1.5 w-8 rounded-full ${i === chart.strength ? 'bg-gold-400' : 'bg-night-600'}`} />
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card onClick={() => setDetail('structure')}>
          <SectionTitle icon="🏛️" title="โครงสร้างชะตา" sub="Structure Analysis · แตะเพื่อดูรายละเอียด" />
          <div className="text-xl font-bold text-purple-200">{STRUCTURES[chart.structure].th}</div>
          <div className="text-xs text-night-300 mt-0.5">{STRUCTURES[chart.structure].cn} · {STRUCTURES[chart.structure].en}</div>
          <p className="text-xs text-night-200 mt-2 line-clamp-2">{STRUCTURES[chart.structure].desc}</p>
        </Card>

        <Card onClick={() => setDetail('useful')}>
          <SectionTitle icon="🧧" title="เทพประโยชน์" sub="Useful God 用神 · แตะเพื่อดูรายละเอียด" />
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl border" style={{ backgroundColor: ELEMENTS[chart.usefulGod].color + '18', borderColor: ELEMENTS[chart.usefulGod].color + '66' }}>
              {ELEMENTS[chart.usefulGod].emoji}
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: ELEMENTS[chart.usefulGod].color }}>
                ธาตุ{ELEMENTS[chart.usefulGod].th} {ELEMENTS[chart.usefulGod].cn}
              </div>
              <div className="text-xs text-night-300 mt-1 space-x-1.5">
                <span>ธาตุเสริม: <ElementBadge el={chart.secondaryGod} size="sm" /></span>
                <span>ควรเลี่ยง: <ElementBadge el={chart.avoidElement} size="sm" /></span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle icon="🌈" title="สัดส่วนธาตุทั้งห้า" sub="Destiny Matrix · Five Elements Distribution" />
          <ElementBar percent={chart.elementPercent} />
        </Card>
      </div>

      {/* Ten gods profile */}
      <Card>
        <SectionTitle icon="👥" title="แผนที่สิบเทพ (Archetypes)" sub="十神 กำลังของเทพแต่ละองค์ในดวงคุณ" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TEN_GODS.map(g => {
            const v = chart.tenGodProfile[g.key] ?? 0
            const max = Math.max(...Object.values(chart.tenGodProfile), 1)
            return (
              <div key={g.key} className="bg-night-700/50 rounded-xl p-2.5 text-center border border-night-600">
                <div className="text-sm font-semibold text-gold-200">{g.cn}</div>
                <div className="text-[10px] text-night-300">{g.th}</div>
                <div className="h-1.5 bg-night-600 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-gold-400 rounded-full" style={{ width: `${(v / max) * 100}%` }} />
                </div>
                <div className="text-[10px] text-night-300 mt-1">{v} แต้ม</div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Luck pillars */}
      <Card>
        <SectionTitle icon="🍀" title="เสาโชค Luck Pillars 大運" sub={`รอบทศวรรษของชีวิต · ตอนนี้อายุ ${currentAge} ปี ${nowLuck ? `อยู่ในเสา ${ganzhiName(nowLuck.pillar)}` : ''}`} />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {chart.luckPillars.map((lp, i) => {
            const active = nowLuck === lp
            return (
              <button key={i} onClick={() => setLuckSel(lp)}
                className={`shrink-0 w-[86px] rounded-xl border p-2.5 text-center ${active ? 'border-gold-400/80 bg-gold-500/10 shadow-[0_0_15px_rgba(227,165,75,0.2)]' : 'border-night-600 bg-night-700/40 hover:border-gold-500/40'}`}>
                <div className="text-[10px] text-night-300">อายุ {lp.startAge}</div>
                <div className="text-xl font-bold" style={{ color: ELEMENTS[STEMS[lp.pillar.stem].element].color }}>{STEMS[lp.pillar.stem].cn}</div>
                <div className="text-xl font-bold" style={{ color: ELEMENTS[BRANCHES[lp.pillar.branch].element].color }}>{BRANCHES[lp.pillar.branch].cn}</div>
                <div className="text-[9px] text-purple-300 mt-1">{TEN_GODS[lp.tenGod].th}</div>
                <div className="text-[9px] text-night-400">{lp.startYear + 543}−{lp.startYear + 553}</div>
              </button>
            )
          })}
        </div>
        {/* transit: this year & next */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[0, 1].map(off => {
            const yr = new Date().getFullYear() + off
            const ap = annualPillar(yr)
            const g = TEN_GODS[tenGodOf(chart.dayMaster, ap.stem)]
            return (
              <div key={off} className="bg-night-700/40 rounded-xl border border-night-600 p-3 flex items-center gap-3">
                <div className="text-lg font-bold text-gold-200">{STEMS[ap.stem].cn}{BRANCHES[ap.branch].cn}</div>
                <div className="text-[11px] text-night-300">
                  <div>Transit ปี {yr + 543} ({yr})</div>
                  <div className="text-purple-300">{g.th} ({g.cn}) — {g.meaning}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Stars */}
      <Card>
        <SectionTitle icon="⭐" title="ดาวในดวง Stars 神煞" sub="ดาวมงคลและดาวพึงระวังประจำชะตา" />
        {chart.stars.length === 0 ? (
          <p className="text-sm text-night-300">ดวงของคุณเป็นสายกำลังภายใน — ไม่พึ่งดาวจร ทุกความสำเร็จสร้างจากโครงสร้างธาตุล้วนๆ</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {chart.stars.map((s, i) => (
              <div key={i} className={`rounded-xl border p-3 ${s.auspicious ? 'border-gold-500/30 bg-gold-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                <div className="flex items-center gap-2">
                  <span>{s.auspicious ? '⭐' : '⚠️'}</span>
                  <span className="text-sm font-semibold text-gold-100">{s.name} {s.cn}</span>
                  <span className="text-[10px] text-night-400 ml-auto">เสา{s.pillar}</span>
                </div>
                <p className="text-xs text-night-200 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 64 Hexagrams */}
      <Card>
        <SectionTitle icon="䷀" title="ฉักลักษณ์ 64 Hexagrams" sub="Xuan Kong Da Gua ประจำแต่ละเสา (คำนวณจากนาเจี่ย)" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {chart.hexagrams.map((h, i) => (
            <div key={i} className="bg-night-700/40 rounded-xl border border-night-600 p-3 text-center">
              <div className="text-[10px] text-night-300 mb-2">เสา{h.pillarName} · {ganzhiName(h.pillar)}</div>
              <HexagramFigure upper={TRIGRAMS[h.upper].lines} lower={TRIGRAMS[h.lower].lines} />
              <div className="mt-2 text-sm font-semibold text-gold-200">#{h.hexNum} {h.cn}</div>
              <div className="text-[10px] text-night-300">{HEXAGRAM_NAMES[h.hexNum].th}</div>
              <div className="text-[9px] text-night-400 mt-1">{TRIGRAMS[h.upper].th}เหนือ{TRIGRAMS[h.lower].th}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── modals ── */}
      <Modal open={detail === 'dm'} onClose={() => setDetail(null)} title={`เจ้าวัน ${dmStem.cn} — Day Master Insight`}>
        <div className="space-y-4 text-sm text-night-100">
          <div className="text-center py-3">
            <div className="text-6xl">{arch.emoji}</div>
            <div className="text-lg font-bold text-gold-200 mt-2">"{arch.title}"</div>
            <div className="text-xs text-purple-300 mt-1">{arch.codename}</div>
          </div>
          <p className="text-night-200 leading-relaxed">{arch.essence}</p>
          <div>
            <div className="text-gold-300 font-semibold mb-2">จุดแข็งระดับแพลตตินัม</div>
            <div className="space-y-2">
              {arch.strengths.map((s, i) => (
                <div key={i} className="flex gap-2 bg-night-800/60 rounded-xl p-3 border border-gold-500/15">
                  <span className="shrink-0">{arch.emoji}</span>
                  <p className="text-xs leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-xs text-red-200">⚠️ {arch.caution}</div>
        </div>
      </Modal>

      <Modal open={detail === 'strength'} onClose={() => setDetail(null)} title="กำลังเจ้าวัน — Strength Detail">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-4">
            <ScoreRing score={chart.strengthScore} size={100} label="กำลังหนุน" />
            <div>
              <div className="text-2xl font-bold text-gold-200">{STRENGTH_LEVELS[chart.strength].th}</div>
              <div className="text-xs text-night-300">{STRENGTH_LEVELS[chart.strength].en}</div>
            </div>
          </div>
          <p className="text-night-200 text-xs leading-relaxed">{STRENGTH_LEVELS[chart.strength].desc}</p>
          <div className="text-xs text-night-300 bg-night-800/60 rounded-xl p-3 border border-night-600">
            วิธีคำนวณ: รวมกำลังธาตุเดียวกับเจ้าวัน ({ELEMENTS[STEMS[chart.dayMaster].element].th}) + ธาตุพี่เลี้ยง โดยถ่วงน้ำหนักฤดูกาลจากเสาเดือน ({STEMS[chart.pillars.month.stem].cn}{BRANCHES[chart.pillars.month.branch].cn}) เทียบกับกำลังรวมทั้งดวง ได้ {chart.strengthScore}%
          </div>
          <div className="space-y-1.5">
            {STRENGTH_LEVELS.map((lv, i) => (
              <div key={lv.key} className={`rounded-lg px-3 py-2 text-xs border ${i === chart.strength ? 'border-gold-400/60 bg-gold-500/10 text-gold-200' : 'border-night-600 text-night-300'}`}>
                {i === chart.strength ? '● ' : '○ '}{lv.th} ({lv.en})
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={detail === 'structure'} onClose={() => setDetail(null)} title="โครงสร้างชะตา — Structure Detail">
        <div className="space-y-3 text-sm">
          <div className="text-xl font-bold text-purple-200">{STRUCTURES[chart.structure].th} {STRUCTURES[chart.structure].cn}</div>
          <p className="text-night-200 text-xs leading-relaxed">{STRUCTURES[chart.structure].desc}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {STRUCTURES.map((st, i) => (
              <div key={st.key} className={`rounded-xl p-3 border ${i === chart.structure ? 'border-purple-400/60 bg-purple-500/10' : 'border-night-600'}`}>
                <div className={`font-semibold ${i === chart.structure ? 'text-purple-200' : 'text-night-300'}`}>{st.th}</div>
                <div className="text-[10px] text-night-400 mt-1">{st.cn} · {st.en}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={detail === 'useful'} onClose={() => setDetail(null)} title="เทพประโยชน์ 用神 — Useful God Detail">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl border" style={{ backgroundColor: ELEMENTS[chart.usefulGod].color + '18', borderColor: ELEMENTS[chart.usefulGod].color + '66' }}>
              {ELEMENTS[chart.usefulGod].emoji}
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: ELEMENTS[chart.usefulGod].color }}>ธาตุ{ELEMENTS[chart.usefulGod].th} {ELEMENTS[chart.usefulGod].cn}</div>
              <div className="text-xs text-night-300">ธาตุที่ช่วยเสริมดวงของคุณมากที่สุด</div>
            </div>
          </div>
          <p className="text-xs text-night-200 leading-relaxed">
            เจ้าวันของคุณ{STRENGTH_LEVELS[chart.strength].th} ระบบจึงเลือกธาตุ{ELEMENTS[chart.usefulGod].th}เป็นเทพประโยชน์
            {chart.strength >= 2 ? ' เพื่อระบายพลังส่วนเกินให้ไหลเป็นผลงานและทรัพย์' : ' เพื่อเติมกำลังให้เจ้าวันแบกรับโอกาสใหญ่ได้'} —
            เลือกสี ทิศ อาชีพ และผู้คนที่สังกัดธาตุนี้ แล้วแรงเสียดทานในชีวิตจะลดลงทันตา
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-night-800/60 rounded-xl p-3 border border-gold-500/25">
              <div className="text-[10px] text-night-400">เทพประโยชน์</div>
              <div className="mt-1"><ElementBadge el={chart.usefulGod} /></div>
            </div>
            <div className="bg-night-800/60 rounded-xl p-3 border border-night-600">
              <div className="text-[10px] text-night-400">ธาตุเสริม</div>
              <div className="mt-1"><ElementBadge el={chart.secondaryGod} /></div>
            </div>
            <div className="bg-night-800/60 rounded-xl p-3 border border-red-500/25">
              <div className="text-[10px] text-night-400">ควรเลี่ยง</div>
              <div className="mt-1"><ElementBadge el={chart.avoidElement} /></div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={!!luckSel} onClose={() => setLuckSel(null)} title={luckSel ? `เสาโชค ${ganzhiName(luckSel.pillar)} (อายุ ${luckSel.startAge}–${luckSel.endAge})` : ''}>
        {luckSel && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-6 py-2">
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: ELEMENTS[STEMS[luckSel.pillar.stem].element].color }}>{STEMS[luckSel.pillar.stem].cn}</div>
                <div className="text-[10px] text-night-300 mt-1">{ELEMENTS[STEMS[luckSel.pillar.stem].element].th}{STEMS[luckSel.pillar.stem].yang ? 'หยาง' : 'ยิน'}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: ELEMENTS[BRANCHES[luckSel.pillar.branch].element].color }}>{BRANCHES[luckSel.pillar.branch].cn}</div>
                <div className="text-[10px] text-night-300 mt-1">ราศี{BRANCHES[luckSel.pillar.branch].th}</div>
              </div>
            </div>
            <div className="bg-night-800/60 rounded-xl p-3 border border-purple-400/25 text-xs">
              <span className="text-purple-300 font-semibold">ตำแหน่ง: {TEN_GODS[luckSel.tenGod].th} ({TEN_GODS[luckSel.tenGod].cn})</span>
              <p className="text-night-200 mt-1">{TEN_GODS[luckSel.tenGod].meaning}</p>
            </div>
            <p className="text-xs text-night-200 leading-relaxed">
              ช่วงปี พ.ศ. {luckSel.startYear + 543}–{luckSel.startYear + 553} ธาตุ{ELEMENTS[STEMS[luckSel.pillar.stem].element].th}เดินเข้าดวง
              {STEMS[luckSel.pillar.stem].element === chart.usefulGod
                ? ' — ตรงเทพประโยชน์! นี่คือทศวรรษทอง วางเป้าหมายใหญ่สุดของชีวิตไว้ในรอบนี้'
                : STEMS[luckSel.pillar.stem].element === chart.avoidElement
                  ? ' — เป็นธาตุที่ควรเลี่ยง ทศวรรษนี้เน้นตั้งรับ สะสมทุนและทักษะ รอรอบถัดไปค่อยบุก'
                  : ' — พลังกลางๆ เดินเกมสม่ำเสมอ เก็บชัยชนะเล็กให้ต่อเนื่อง'}
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
