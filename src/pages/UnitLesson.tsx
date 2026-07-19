import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { getUnit, unitsFor } from '../data/content'
import type { VocabItem } from '../types/content'
import { useProgressStore } from '../store/progressStore'
import ProgressBar from '../components/common/ProgressBar'
import SpeakButton from '../components/common/SpeakButton'
import MatchPairs from '../components/exercises/MatchPairs'
import MultipleChoice from '../components/exercises/MultipleChoice'

type Phase =
  | { kind: 'intro'; index: number }
  | { kind: 'match' }
  | { kind: 'quiz'; index: number }
  | { kind: 'done' }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function UnitLesson() {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()
  const unit = unitId ? getUnit(unitId) : undefined
  const { ensureCards, gradeCard, startUnit, completeUnit, addStat } = useProgressStore()

  const [phase, setPhase] = useState<Phase>({ kind: 'intro', index: 0 })
  const [correct, setCorrect] = useState(0)

  // ตัวเลือกผิดสำหรับ quiz: สุ่มความหมายจากคำอื่นในภาษาเดียวกัน
  const distractorPool = useMemo(() => {
    if (!unit) return []
    return unitsFor(unit.lang)
      .flatMap((u) => u.items)
      .filter((it) => it.unitId !== unit.id)
  }, [unit])

  useEffect(() => {
    if (unitId) startUnit(unitId)
  }, [unitId, startUnit])

  if (!unit || !unitId) {
    return (
      <div>
        ไม่พบบทเรียน <Link to="/learn/en" className="text-indigo-600">กลับ</Link>
      </div>
    )
  }

  const items = unit.items
  const isZh = unit.lang === 'zh'

  const buildChoices = (item: VocabItem): { choices: string[]; answerIndex: number } => {
    const wrong = shuffle(distractorPool).slice(0, 3).map((it) => it.meaningTh)
    const all = shuffle([item.meaningTh, ...wrong])
    return { choices: all, answerIndex: all.indexOf(item.meaningTh) }
  }

  // ----- render phases -----
  if (phase.kind === 'intro') {
    const item = items[phase.index]
    const example = item.examples[0]
    const total = items.length
    return (
      <LessonFrame
        title={unit.titleTh}
        step={phase.index}
        total={total + 1}
        onBack={() => navigate(-1)}
      >
        <div className="text-sm text-slate-400 text-center mb-2">
          คำใหม่ {phase.index + 1} / {total}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className={`text-4xl font-bold text-slate-800 ${isZh ? 'font-zh' : ''}`}>{item.headword}</div>
          {item.pinyin && <div className="text-slate-500 mt-1">{item.pinyin}</div>}
          <div className="text-xs text-slate-400 mt-1">({item.pos})</div>
          <div className="my-3 flex justify-center">
            <SpeakButton text={item.headword} lang={item.lang} size="lg" />
          </div>
          <div className="text-xl font-semibold text-indigo-700">{item.meaningTh}</div>
          {example && (
            <div className="mt-4 border-t border-slate-100 pt-3 text-sm">
              <div className="flex items-center justify-center gap-2">
                <span className={isZh ? 'font-zh text-base' : ''}>{example.text}</span>
                <SpeakButton text={example.text} lang={item.lang} size="sm" />
              </div>
              {example.pinyin && <div className="text-slate-400">{example.pinyin}</div>}
              <div className="text-slate-500 mt-1">{example.translationTh}</div>
            </div>
          )}
        </div>
        <NavButtons
          onNext={() =>
            setPhase(
              phase.index + 1 < total
                ? { kind: 'intro', index: phase.index + 1 }
                : { kind: 'match' },
            )
          }
          nextLabel={phase.index + 1 < total ? 'ถัดไป' : 'เริ่มฝึก'}
        />
      </LessonFrame>
    )
  }

  if (phase.kind === 'match') {
    return (
      <LessonFrame title={unit.titleTh} step={items.length} total={items.length + 1} onBack={() => navigate(-1)}>
        <MatchPairs items={items} onDone={() => setPhase({ kind: 'quiz', index: 0 })} />
      </LessonFrame>
    )
  }

  if (phase.kind === 'quiz') {
    const item = items[phase.index]
    const { choices, answerIndex } = buildChoices(item)
    return (
      <LessonFrame title="แบบทดสอบท้ายบท" step={items.length + 1} total={items.length + 1} onBack={() => navigate(-1)}>
        <div className="text-sm text-slate-400 text-center mb-2">
          ข้อ {phase.index + 1} / {items.length}
        </div>
        <MultipleChoice
          key={item.id}
          prompt={
            <div className="text-center">
              <div className="text-sm text-slate-500 mb-2">คำนี้แปลว่าอะไร</div>
              <div className={`text-3xl font-bold text-slate-800 ${isZh ? 'font-zh' : ''}`}>{item.headword}</div>
              {item.pinyin && <div className="text-slate-500 mt-1">{item.pinyin}</div>}
              <div className="mt-2 flex justify-center">
                <SpeakButton text={item.headword} lang={item.lang} />
              </div>
            </div>
          }
          choices={choices}
          answerIndex={answerIndex}
          onDone={(ok) => {
            const nextCorrect = correct + (ok ? 1 : 0)
            setCorrect(nextCorrect)
            gradeCard(item.id, item.lang, ok ? 4 : 3)
            if (phase.index + 1 < items.length) {
              setPhase({ kind: 'quiz', index: phase.index + 1 })
            } else {
              const score = Math.round((nextCorrect / items.length) * 100)
              ensureCards(items.map((it) => ({ id: it.id, lang: it.lang })))
              addStat({ newItems: items.length, xp: 10 + nextCorrect * 2 })
              completeUnit(unitId, score)
              setPhase({ kind: 'done' })
            }
          }}
        />
      </LessonFrame>
    )
  }

  // done
  const score = Math.round((correct / items.length) * 100)
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
      <div className="text-6xl">{score >= 80 ? '🎉' : score >= 50 ? '👍' : '💪'}</div>
      <h1 className="text-2xl font-extrabold text-slate-800">เรียนจบบท!</h1>
      <div className="text-slate-500">
        ตอบถูก {correct} / {items.length} ข้อ ({score}%)
      </div>
      <div className="text-emerald-600 font-semibold">+{10 + correct * 2} XP</div>
      <p className="text-sm text-slate-500 max-w-xs">
        คำศัพท์เหล่านี้ถูกเพิ่มเข้าคิวทบทวนแล้ว ระบบจะเตือนให้ทบทวนตามหลัก Spaced Repetition
      </p>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => navigate('/learn/' + unit.lang)}
          className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          บทเรียนถัดไป
        </button>
        <button
          type="button"
          onClick={() => navigate('/review')}
          className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
        >
          ไปทบทวน
        </button>
      </div>
    </div>
  )
}

function LessonFrame({
  title,
  step,
  total,
  onBack,
  children,
}: {
  title: string
  step: number
  total: number
  onBack: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-600 mb-1">{title}</div>
          <ProgressBar value={step} max={total} />
        </div>
      </div>
      {children}
    </div>
  )
}

function NavButtons({ onNext, nextLabel }: { onNext: () => void; nextLabel: string }) {
  return (
    <button
      type="button"
      onClick={onNext}
      className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
    >
      {nextLabel === 'เริ่มฝึก' ? <Check size={18} /> : <ArrowRight size={18} />} {nextLabel}
    </button>
  )
}
