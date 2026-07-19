import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Languages, PenTool } from 'lucide-react'
import type { Lang, VocabItem } from '../types/content'
import { LANG_META, unitsFor } from '../data/content'
import { useProgressStore } from '../store/progressStore'
import { similarity, stripTones } from '../lib/score'
import SkillHeader from '../components/layout/SkillHeader'
import ListenType from '../components/exercises/ListenType'
import HanziQuiz from '../components/exercises/HanziQuiz'
import SpeakButton from '../components/common/SpeakButton'

type Tab = 'dictation' | 'translate' | 'hanzi'

export default function Writing() {
  const { lang } = useParams<{ lang: Lang }>()
  const addStat = useProgressStore((s) => s.addStat)
  const [tab, setTab] = useState<Tab>('dictation')

  const items = useMemo<VocabItem[]>(() => {
    if (lang !== 'en' && lang !== 'zh') return []
    return unitsFor(lang).flatMap((u) => u.items)
  }, [lang])

  if (lang !== 'en' && lang !== 'zh') return <div>ไม่พบภาษา</div>
  if (items.length === 0) return <div>ยังไม่มีเนื้อหา</div>

  const tabs: { key: Tab; label: string; icon: typeof PenTool }[] = [
    { key: 'dictation', label: 'ฟัง-พิมพ์', icon: PenTool },
    { key: 'translate', label: 'แปลประโยค', icon: Languages },
    ...(lang === 'zh' ? [{ key: 'hanzi' as Tab, label: 'เขียนอักษร', icon: PenTool }] : []),
  ]

  return (
    <div>
      <SkillHeader title={`ฝึกเขียน ${LANG_META[lang].nameTh}`} />

      <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? 'bg-white shadow text-indigo-700' : 'text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dictation' && <Dictation lang={lang} items={items} onXp={(xp) => addStat({ xp, minutes: 1 })} />}
      {tab === 'translate' && <Translate lang={lang} items={items} onXp={(xp) => addStat({ xp, minutes: 1 })} />}
      {tab === 'hanzi' && <HanziPractice items={items} onXp={(xp) => addStat({ xp, minutes: 1 })} />}
    </div>
  )
}

function Dictation({ lang, items, onXp }: { lang: Lang; items: VocabItem[]; onXp: (xp: number) => void }) {
  const [index, setIndex] = useState(0)
  const withEx = items.filter((it) => it.examples[0])
  const item = withEx[index % withEx.length]
  const ex = item.examples[0]
  return (
    <div>
      <div className="text-sm text-slate-400 text-center mb-2">
        ประโยคที่ {index + 1} / {withEx.length}
      </div>
      <ListenType
        key={index}
        target={ex.text}
        lang={lang}
        targetPinyin={ex.pinyin}
        hintTh={ex.translationTh}
        onDone={(ok) => {
          onXp(ok ? 4 : 1)
          setIndex((i) => (i + 1) % withEx.length)
        }}
      />
    </div>
  )
}

function Translate({ lang, items, onXp }: { lang: Lang; items: VocabItem[]; onXp: (xp: number) => void }) {
  const withEx = items.filter((it) => it.examples[0])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const item = withEx[index % withEx.length]
  const ex = item.examples[0]

  const typedPinyin = lang === 'zh' && ex.pinyin && /[a-z]/i.test(answer)
  const score = !checked
    ? 0
    : typedPinyin
      ? similarity(stripTones(ex.pinyin!), stripTones(answer.toLowerCase()), 'en')
      : similarity(ex.text, answer, lang)
  const passed = score >= 70

  const next = () => {
    onXp(passed ? 5 : 1)
    setAnswer('')
    setChecked(false)
    setIndex((i) => (i + 1) % withEx.length)
  }

  return (
    <div>
      <div className="text-sm text-slate-400 text-center mb-2">
        ประโยคที่ {index + 1} / {withEx.length}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4 text-center">
        <div className="text-sm text-slate-500 mb-2">แปลประโยคนี้เป็น{LANG_META[lang].nameTh}</div>
        <div className="text-xl font-semibold text-slate-800">{ex.translationTh}</div>
      </div>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={checked}
        rows={2}
        placeholder={lang === 'zh' ? 'พิมพ์อักษรจีนหรือพินอิน...' : 'Type in English...'}
        className={`w-full rounded-xl border-2 border-slate-200 p-3 focus:border-indigo-400 focus:outline-none ${
          lang === 'zh' && !typedPinyin ? 'font-zh text-lg' : ''
        }`}
      />
      {checked && (
        <div className={`mt-3 rounded-xl p-4 ${passed ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          <div className={`font-bold ${passed ? 'text-emerald-700' : 'text-amber-700'}`}>
            {passed ? `ดีมาก! (${score}%)` : `ใกล้เคียง (${score}%)`}
          </div>
          <div className="mt-1 text-sm text-slate-600 flex items-center gap-2">
            <span>
              ตัวอย่างเฉลย: <span className={`font-semibold ${lang === 'zh' ? 'font-zh text-base' : ''}`}>{ex.text}</span>
            </span>
            <SpeakButton text={ex.text} lang={lang} size="sm" />
          </div>
          {ex.pinyin && <div className="text-xs text-slate-400 mt-1">{ex.pinyin}</div>}
          <div className="text-xs text-slate-400 mt-1">
            การแปลมีได้หลายแบบ — ถ้าความหมายตรงก็ถือว่าใช้ได้ แม้คะแนนไม่เต็ม
          </div>
        </div>
      )}
      {checked ? (
        <button type="button" onClick={next} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
          ต่อไป
        </button>
      ) : (
        <button
          type="button"
          disabled={answer.trim() === ''}
          onClick={() => setChecked(true)}
          className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40"
        >
          ตรวจคำตอบ
        </button>
      )}
    </div>
  )
}

function HanziPractice({ items, onXp }: { items: VocabItem[]; onXp: (xp: number) => void }) {
  // อักษรเดี่ยว (headword ยาว 1 ตัว) เหมาะกับการฝึกเขียนตามลำดับขีด
  const chars = useMemo(() => {
    const seen = new Set<string>()
    const list: VocabItem[] = []
    for (const it of items) {
      const single = Array.from(it.headword)
      if (single.length === 1 && !seen.has(it.headword)) {
        seen.add(it.headword)
        list.push(it)
      }
    }
    return list
  }, [items])
  const [index, setIndex] = useState(0)

  if (chars.length === 0) return <div className="text-slate-500 text-center">ยังไม่มีอักษรเดี่ยวให้ฝึก</div>
  const item = chars[index]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-center">
        <div className="text-slate-500">{item.pinyin}</div>
        <div className="text-sm text-slate-400">{item.meaningTh}</div>
      </div>
      <HanziQuiz key={item.headword} char={item.headword} onComplete={(m) => onXp(m === 0 ? 5 : 3)} />
      <div className="flex justify-between w-full max-w-[240px]">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-slate-400 self-center">
          {index + 1} / {chars.length}
        </span>
        <button
          type="button"
          disabled={index === chars.length - 1}
          onClick={() => setIndex((i) => Math.min(chars.length - 1, i + 1))}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
