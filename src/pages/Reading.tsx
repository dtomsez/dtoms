import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookText, CheckCircle2 } from 'lucide-react'
import type { Lang, ReadingPassage } from '../types/content'
import { LANG_META, readingsFor } from '../data/content'
import { useProgressStore } from '../store/progressStore'
import SkillHeader from '../components/layout/SkillHeader'
import SpeakButton from '../components/common/SpeakButton'
import MultipleChoice from '../components/exercises/MultipleChoice'

export default function Reading() {
  const { lang } = useParams<{ lang: Lang }>()
  const [openId, setOpenId] = useState<string | null>(null)
  const passages = useMemo(() => (lang === 'en' || lang === 'zh' ? readingsFor(lang) : []), [lang])

  if (lang !== 'en' && lang !== 'zh') return <div>ไม่พบภาษา</div>

  const open = passages.find((p) => p.id === openId)
  if (open) return <PassageView passage={open} onBack={() => setOpenId(null)} />

  return (
    <div>
      <SkillHeader title={`ฝึกอ่าน ${LANG_META[lang].nameTh}`} subtitle="เลือกบทความตามระดับ แตะคำเพื่อดูคำแปล" />
      <div className="grid gap-2">
        {passages.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpenId(p.id)}
            className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-left hover:border-indigo-300 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <BookText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-slate-800 ${lang === 'zh' ? 'font-zh' : ''}`}>{p.title}</div>
              <div className="text-sm text-slate-500">
                {p.titleTh} · ระดับ {p.level}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function PassageView({ passage, onBack }: { passage: ReadingPassage; onBack: () => void }) {
  const addStat = useProgressStore((s) => s.addStat)
  const [active, setActive] = useState<{ word: string; pinyin?: string; meaningTh: string } | null>(null)
  const [quizMode, setQuizMode] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  const fullText = passage.paragraphs.map((p) => p.join(passage.lang === 'zh' ? '' : ' ')).join(' ')

  const lookup = (token: string) => {
    const entry = passage.glossary[token]
    if (entry) setActive({ word: token, ...entry })
    else setActive({ word: token, meaningTh: '— ไม่มีคำแปล —' })
  }

  if (quizMode && !finished) {
    const q = passage.questions[qIndex]
    return (
      <div>
        <SkillHeader title="คำถามความเข้าใจ" subtitle={passage.titleTh} step={qIndex} total={passage.questions.length} />
        <MultipleChoice
          key={qIndex}
          prompt={<div className="font-semibold text-slate-800">{q.q}</div>}
          choices={q.choices}
          answerIndex={q.answer}
          onDone={(ok) => {
            const nc = correct + (ok ? 1 : 0)
            setCorrect(nc)
            if (qIndex + 1 < passage.questions.length) {
              setQIndex((i) => i + 1)
            } else {
              addStat({ xp: 5 + nc * 3, minutes: 2 })
              setFinished(true)
            }
          }}
        />
      </div>
    )
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
        <div className="text-6xl">📖</div>
        <h1 className="text-2xl font-extrabold text-slate-800">อ่านจบแล้ว!</h1>
        <div className="text-slate-500">
          ตอบถูก {correct} / {passage.questions.length} ข้อ
        </div>
        <button type="button" onClick={onBack} className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold">
          กลับไปเลือกบทความ
        </button>
      </div>
    )
  }

  return (
    <div>
      <SkillHeader title={passage.title} subtitle={`${passage.titleTh} · ระดับ ${passage.level}`} />

      <div className="flex justify-end mb-2">
        <SpeakButton text={fullText} lang={passage.lang} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        {passage.paragraphs.map((para, pi) => (
          <p key={pi} className={`leading-loose ${passage.lang === 'zh' ? 'font-zh text-lg' : 'text-[17px]'}`}>
            {para.map((token, ti) => {
              const hasGloss = Boolean(passage.glossary[token])
              return (
                <span key={ti}>
                  <button
                    type="button"
                    onClick={() => lookup(token)}
                    className={`${
                      hasGloss ? 'border-b border-dashed border-indigo-300 hover:bg-indigo-50' : ''
                    } rounded px-0.5`}
                  >
                    {token}
                  </button>
                  {passage.lang === 'en' ? ' ' : ''}
                </span>
              )
            })}
          </p>
        ))}
      </div>

      {active && (
        <div className="mt-3 bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className={`font-bold text-indigo-800 ${passage.lang === 'zh' ? 'font-zh text-lg' : ''}`}>
              {active.word}
            </div>
            {active.pinyin && <div className="text-sm text-indigo-500">{active.pinyin}</div>}
            <div className="text-slate-600">{active.meaningTh}</div>
          </div>
          <SpeakButton text={active.word} lang={passage.lang} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setQuizMode(true)}
        className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
      >
        <CheckCircle2 size={18} /> ทำแบบทดสอบความเข้าใจ ({passage.questions.length} ข้อ)
      </button>
    </div>
  )
}
