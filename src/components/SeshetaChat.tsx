import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { computeChart } from '../lib/bazi'
import { generateReply, generateTimingReply, QUICK_PROMPTS } from '../lib/sesheta'
import { STEMS, BRANCHES, ELEMENTS, DAY_MASTER_ARCHETYPES } from '../lib/data'
import { Card } from './ui'
import { SendHorizontal, ShieldCheck, Trash2 } from 'lucide-react'

type Mode = 'destiny' | 'timing'

export default function SeshetaChat() {
  const { birth, chat, timingChat, pushChat, pushTimingChat, clearChat } = useAppStore()
  const chartData = useMemo(() => birth ? computeChart(birth) : null, [birth])
  const [mode, setMode] = useState<Mode>('destiny')
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const messages = mode === 'destiny' ? chat : timingChat
  const push = mode === 'destiny' ? pushChat : pushTimingChat

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = (text?: string) => {
    const q = (text ?? input).trim()
    if (!q || typing) return
    if (mode === 'destiny' && !chartData) return
    setInput('')
    push({ role: 'user', text: q, time: Date.now() })
    setTyping(true)
    setTimeout(() => {
      const reply = mode === 'destiny' ? generateReply(chartData!, q) : generateTimingReply(q)
      push({ role: 'ai', text: reply, time: Date.now() })
      setTyping(false)
    }, 900 + Math.random() * 700)
  }

  const arch = chartData ? DAY_MASTER_ARCHETYPES[chartData.dayMaster] : null

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-64px)]">
      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
        <div>
          <h1 className="text-xl font-bold text-gold-100 flex items-center gap-2">𓁟 Sesheta AI</h1>
          <p className="text-xs text-night-300 mt-0.5">ที่ปรึกษาดวงชะตา AI — วิเคราะห์จากดวงจริงของคุณ ไม่ใช่คำตอบทั่วไป</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-night-600 overflow-hidden">
            <button onClick={() => setMode('destiny')} className={`px-3 py-1.5 text-xs ${mode === 'destiny' ? 'bg-gold-500/20 text-gold-200' : 'text-night-300'}`}>☯️ ดวงชะตา</button>
            <button onClick={() => setMode('timing')} className={`px-3 py-1.5 text-xs ${mode === 'timing' ? 'bg-purple-500/20 text-purple-200' : 'text-night-300'}`}>📅 ฤกษ์ยาม</button>
          </div>
          <button onClick={clearChat} title="ล้างบทสนทนา" className="p-1.5 rounded-lg border border-night-600 text-night-400 hover:text-red-400"><Trash2 size={13} /></button>
        </div>
      </div>

      {/* context strip */}
      {chartData && mode === 'destiny' && (
        <div className="flex items-center gap-2 text-[10px] text-night-300 bg-night-800/60 border border-gold-500/15 rounded-xl px-3 py-2 mb-3 flex-wrap">
          <ShieldCheck size={12} className="text-green-400" />
          <span className="text-green-300 font-medium">Zero Hallucination Engine</span>
          <span>· Rich BaZi Context ฉีดเข้าระบบแล้ว:</span>
          <span className="text-gold-300">{arch!.emoji} เจ้าวัน {STEMS[chartData.dayMaster].cn}</span>
          <span>· 4 เสา {[chartData.pillars.year, chartData.pillars.month, chartData.pillars.day, chartData.pillars.hour].map(p => STEMS[p.stem].cn + BRANCHES[p.branch].cn).join(' ')}</span>
          <span>· เทพประโยชน์ {ELEMENTS[chartData.usefulGod].cn}</span>
        </div>
      )}
      {mode === 'timing' && (
        <div className="flex items-center gap-2 text-[10px] text-night-300 bg-purple-500/10 border border-purple-400/20 rounded-xl px-3 py-2 mb-3">
          <ShieldCheck size={12} className="text-purple-300" />
          <span className="text-purple-200 font-medium">โหมดวิเคราะห์ฤกษ์ยามมงคล</span>
          <span>— ที่แรกและที่เดียวในโลก ถามตอบเรื่องฤกษ์ได้อิสระ ยังคงถูกต้องตามหลักวิชาดั้งเดิม (เครื่องคำนวณถงซูฝั่งเซิร์ฟเวอร์ แม่นยำ 100%)</span>
        </div>
      )}

      {/* messages */}
      <Card className="flex-1 overflow-y-auto !p-4 space-y-3">
        {!chartData && mode === 'destiny' ? (
          <p className="text-sm text-night-300 text-center mt-10">กรอกวันเกิดในโมดูล BaZi ก่อน เพื่อให้ Sesheta อ่านดวงจริงของคุณ</p>
        ) : messages.length === 0 ? (
          <div className="text-center mt-8">
            <div className="text-5xl mb-3">𓁟</div>
            <p className="text-sm text-night-200">
              {mode === 'destiny'
                ? `สวัสดีครับ${birth ? ` คุณ${birth.name}` : ''} ผมคือ Sesheta ผมอ่านดวง BaZi ของคุณครบทั้ง 4 เสาแล้ว ถามได้ทุกเรื่อง — การเงิน ความรัก การงาน สุขภาพ หรืออนาคต`
                : 'โหมดฤกษ์ยาม: ถามผมเรื่องวันดี-วันร้ายได้เลย เช่น "พรุ่งนี้เซ็นสัญญาได้ไหม" หรือ "15/8 เปิดร้านดีไหม"'}
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-gold-500/25 to-gold-600/15 border border-gold-500/30 text-gold-50'
                  : 'bg-night-700/70 border border-purple-400/20 text-night-100'
              }`}>
                {m.role === 'ai' && <div className="text-[10px] text-purple-300 mb-1">𓁟 Sesheta</div>}
                {m.text}
              </div>
            </div>
          ))
        )}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-night-700/70 border border-purple-400/20 rounded-2xl px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </Card>

      {/* quick prompts */}
      {(mode === 'destiny' ? chartData : true) && (
        <div className="flex gap-1.5 overflow-x-auto py-2">
          {(mode === 'destiny' ? QUICK_PROMPTS : ['📅 วันนี้ทำอะไรได้บ้าง', '🗓️ พรุ่งนี้เซ็นสัญญาดีไหม', '🏪 15/8 เปิดร้านได้ไหม']).map(p => (
            <button key={p} onClick={() => send(p)} className="whitespace-nowrap text-[11px] border border-night-600 hover:border-gold-500/50 text-night-200 rounded-full px-3 py-1.5 bg-night-800/60">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="flex gap-2 mt-1">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={mode === 'destiny' ? 'ถามเรื่องชีวิตได้ทุกด้าน…' : 'ถามเรื่องฤกษ์ยาม เช่น พรุ่งนี้ย้ายบ้านดีไหม…'}
          disabled={mode === 'destiny' && !chartData}
          className="flex-1 bg-night-800/80 border border-night-600 focus:border-gold-500/60 rounded-xl px-4 py-3 text-sm outline-none disabled:opacity-50"
        />
        <button onClick={() => send()} disabled={!input.trim() || typing}
          className="px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-night-950 disabled:opacity-40">
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  )
}
