import { useMemo, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { computeChart } from '../lib/bazi'
import { analyzePhone, personalNumber } from '../lib/numerology'
import { ELEMENTS, ELEMENT_KEYS, DIGIT_ELEMENT, DIGIT_MEANING } from '../lib/data'
import { Card, SectionTitle, ScoreRing, ElementBadge } from './ui'
import { Phone, Sparkles } from 'lucide-react'

export default function NumerologyModule() {
  const { birth } = useAppStore()
  const chart = useMemo(() => birth ? computeChart(birth) : null, [birth])
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState('')

  const analysis = useMemo(() => submitted ? analyzePhone(submitted, chart) : null, [submitted, chart])
  const personal = useMemo(() => chart ? personalNumber(chart) : null, [chart])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gold-100 flex items-center gap-2">
          เลขศาสตร์ 數字 <span className="text-[10px] bg-red-500/90 text-white rounded-full px-2 py-0.5">ใหม่ล่าสุด!!</span>
        </h1>
        <p className="text-xs text-night-300 mt-0.5">
          ถอดรหัสตัวเลขประจำตัว และวิเคราะห์ความสมดุลของเบอร์มือถือว่าเกื้อหนุนดวงคุณแค่ไหน —
          ปฏิวัติวงการเลขศาสตร์ เพราะไม่ใช่คู่เลขฮิตๆ จะเหมาะกับคุณเสมอไป
        </p>
      </div>

      {/* personal number */}
      {personal && (
        <Card className="!border-gold-500/30">
          <SectionTitle icon="🔢" title="ตัวเลขประจำตัวคุณ" sub={personal.note} />
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400/30 to-purple-600/30 border border-gold-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(227,165,75,0.25)]">
              <span className="text-4xl font-bold text-gold-200">{personal.num}</span>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="text-lg font-bold text-gold-100">"{personal.info.th}"</div>
              <p className="text-xs text-night-200 mt-1 leading-relaxed">{personal.info.desc}</p>
            </div>
          </div>
        </Card>
      )}

      {/* phone analyzer */}
      <Card>
        <SectionTitle icon={<Phone size={18} />} title="วิเคราะห์เบอร์มือถือ" sub={chart ? 'คะแนนธาตุคำนวณเทียบกับเทพประโยชน์ในดวง BaZi ของคุณโดยตรง' : 'กรอกวันเกิดในโมดูล BaZi เพื่อปลดล็อกการวิเคราะห์แบบผูกดวง'} />
        <div className="flex gap-2">
          <input
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/[^\d\s-]/g, ''))}
            onKeyDown={e => e.key === 'Enter' && setSubmitted(phone)}
            placeholder="เช่น 081-234-5678"
            className="flex-1 bg-night-700/70 border border-night-600 focus:border-gold-500/60 rounded-xl px-4 py-3 text-sm outline-none tracking-widest"
          />
          <button onClick={() => setSubmitted(phone)}
            className="px-5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-night-950 font-semibold text-sm">
            <Sparkles size={14} className="inline mr-1" />ถอดรหัส
          </button>
        </div>
        {submitted && !analysis && (
          <p className="text-xs text-red-300 mt-2">กรุณากรอกเบอร์ 9–10 หลัก</p>
        )}
      </Card>

      {analysis && (
        <>
          {/* verdict */}
          <Card className="!border-gold-500/30">
            <div className="flex items-center gap-5 flex-wrap">
              <ScoreRing score={analysis.totalScore} size={110} label="คะแนนรวม" />
              <div className="flex-1 min-w-[220px]">
                <div className="text-xl font-bold text-gold-100">{analysis.verdict}</div>
                <div className="text-xs text-night-300 mt-1">เบอร์ {analysis.digits.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3')} · ผลรวม {analysis.sum} · เลขชีวิต {analysis.lifeNumber} "{analysis.lifeInfo.th}"</div>
                <p className="text-xs text-night-200 mt-2 leading-relaxed">💡 {analysis.recommendation}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-night-700/50 rounded-xl p-3 border border-night-600">
                  <div className="text-lg font-bold text-gold-300">{analysis.pairScore}</div>
                  <div className="text-[9px] text-night-400">คะแนนคู่เลข<br />(ท้ายเบอร์ ×2)</div>
                </div>
                <div className="bg-night-700/50 rounded-xl p-3 border border-night-600">
                  <div className="text-lg font-bold text-purple-300">{analysis.elementScore}</div>
                  <div className="text-[9px] text-night-400">คะแนนสมดุลธาตุ<br />เทียบดวงคุณ</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {/* pairs */}
            <Card>
              <SectionTitle icon="🔗" title="คู่เลขในเบอร์" sub="ไล่ทีละคู่จากซ้ายไปขวา — สี่ตัวท้ายน้ำหนักเป็นสองเท่า" />
              <div className="space-y-1.5">
                {analysis.pairs.map((p, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${p.score >= 4 ? 'border-gold-500/30 bg-gold-500/5' : p.score <= 2 ? 'border-red-500/30 bg-red-500/5' : 'border-night-600 bg-night-800/40'}`}>
                    <span className="text-lg font-bold font-mono text-gold-200 w-9">{p.pair}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => <span key={s} className={`text-[10px] ${s <= p.score ? 'text-gold-400' : 'text-night-600'}`}>★</span>)}
                    </div>
                    <span className="text-[11px] text-night-200 flex-1">{p.meaning}</span>
                    {i >= analysis.pairs.length - 4 && <span className="text-[8px] text-purple-300 border border-purple-400/40 rounded px-1">×2</span>}
                  </div>
                ))}
              </div>
            </Card>

            {/* element balance */}
            <Card>
              <SectionTitle icon="⚖️" title="สมดุลธาตุของเบอร์" sub="เลข→ธาตุตามผังเหอถู: 1,6 น้ำ · 2,7 ไฟ · 3,8 ไม้ · 4,9 ทอง · 5,0 ดิน" />
              <div className="space-y-2">
                {ELEMENT_KEYS.map(k => {
                  const n = analysis.elementDist[k]
                  const max = Math.max(...ELEMENT_KEYS.map(x => analysis.elementDist[x]), 1)
                  return (
                    <div key={k} className="flex items-center gap-2">
                      <span className="w-14 text-xs text-night-200">{ELEMENTS[k].emoji} {ELEMENTS[k].th}</span>
                      <div className="flex-1 h-2.5 bg-night-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(n / max) * 100}%`, backgroundColor: ELEMENTS[k].color }} />
                      </div>
                      <span className="w-14 text-right text-xs font-mono text-night-200">{n} หลัก</span>
                      {chart && k === chart.usefulGod && <span className="text-[9px] text-green-300 border border-green-400/40 rounded px-1">เทพประโยชน์</span>}
                      {chart && k === chart.avoidElement && <span className="text-[9px] text-red-300 border border-red-400/40 rounded px-1">ควรเลี่ยง</span>}
                    </div>
                  )
                })}
              </div>
              <div className={`mt-3 text-xs rounded-xl px-3 py-2.5 border ${analysis.elementScore >= 65 ? 'bg-green-500/10 border-green-400/30 text-green-200' : analysis.elementScore <= 40 ? 'bg-red-500/10 border-red-400/30 text-red-200' : 'bg-night-800/60 border-night-600 text-night-200'}`}>
                {analysis.elementNote}
              </div>
              {chart && (
                <div className="mt-2 text-[11px] text-night-300">
                  ธาตุที่ควรมีในเบอร์: <ElementBadge el={chart.usefulGod} size="sm" /> <ElementBadge el={chart.secondaryGod} size="sm" />
                  {' '}— เลข {Object.entries(DIGIT_ELEMENT).filter(([, el]) => el === chart.usefulGod || el === chart.secondaryGod).map(([d]) => d).sort().join(', ')}
                </div>
              )}
            </Card>
          </div>

          {/* digit legend */}
          <Card>
            <SectionTitle icon="📖" title="ความหมายเลข 0–9" sub="พลังพื้นฐานของแต่ละหลัก" />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.entries(DIGIT_MEANING).map(([d, m]) => (
                <div key={d} className="bg-night-700/40 border border-night-600 rounded-xl p-2.5 text-center">
                  <div className="text-xl font-bold text-gold-300">{d}</div>
                  <div className="mt-1"><ElementBadge el={DIGIT_ELEMENT[d]} size="sm" /></div>
                  <div className="text-[9px] text-night-300 mt-1 leading-relaxed">{m}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
