import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { Lang, VocabItem } from '../types/content'
import type { Grade } from '../types/progress'
import { dueCards, useProgressStore } from '../store/progressStore'
import { cardsToItems } from '../lib/session'
import { unitsFor } from '../data/content'
import ProgressBar from '../components/common/ProgressBar'
import Flashcard from '../components/exercises/Flashcard'
import MultipleChoice from '../components/exercises/MultipleChoice'
import ListenType from '../components/exercises/ListenType'
import SpeakButton from '../components/common/SpeakButton'

const MAX_PER_SESSION = 20

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Mode = 'flash' | 'choice' | 'listen'

export default function ReviewSession() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const langParam = params.get('lang')
  const lang: Lang | undefined = langParam === 'en' || langParam === 'zh' ? langParam : undefined

  const { cards, gradeCard } = useProgressStore()
  const distractorPool = useMemo(
    () => unitsFor(lang ?? 'en').flatMap((u) => u.items),
    [lang],
  )

  // snapshot คำที่ถึงกำหนดทบทวน ณ เริ่ม session (ไม่เปลี่ยนกลางคัน)
  const queue = useMemo(() => {
    const due = dueCards(cards, lang)
    return cardsToItems(due).slice(0, MAX_PER_SESSION)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const mode = useMemo<Mode>(() => {
    const modes: Mode[] = ['flash', 'choice', 'listen']
    return modes[Math.floor(Math.random() * modes.length)]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <div className="text-6xl">✅</div>
        <h1 className="text-2xl font-extrabold text-slate-800">ทบทวนครบแล้ว!</h1>
        <p className="text-slate-500 max-w-xs">
          ไม่มีคำที่ถึงกำหนดทบทวนตอนนี้ ลองเรียนบทเรียนใหม่เพื่อเพิ่มคำศัพท์
        </p>
        <Link to="/learn/en" className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold">
          ไปเรียนบทใหม่
        </Link>
      </div>
    )
  }

  if (index >= queue.length) {
    const score = Math.round((correct / queue.length) * 100)
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
        <div className="text-6xl">{score >= 80 ? '🌟' : '👍'}</div>
        <h1 className="text-2xl font-extrabold text-slate-800">จบรอบทบทวน!</h1>
        <div className="text-slate-500">
          จำได้ {correct} / {queue.length} คำ ({score}%)
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            กลับหน้าหลัก
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
          >
            ทบทวนต่อ
          </button>
        </div>
      </div>
    )
  }

  const item = queue[index]

  const advance = (grade: Grade) => {
    gradeCard(item.id, item.lang, grade)
    if (grade >= 4) setCorrect((c) => c + 1)
    setIndex((i) => i + 1)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-600 mb-1">
            ทบทวน · {index + 1} / {queue.length}
          </div>
          <ProgressBar value={index} max={queue.length} colorClass="bg-emerald-500" />
        </div>
      </div>

      {mode === 'flash' && <Flashcard key={item.id} item={item} onGrade={advance} />}

      {mode === 'choice' && (
        <ChoiceReview key={item.id} item={item} pool={distractorPool} onDone={(ok) => advance(ok ? 4 : 0)} />
      )}

      {mode === 'listen' && (
        <ListenType
          key={item.id}
          target={item.headword}
          lang={item.lang}
          targetPinyin={item.pinyin}
          hintTh={item.meaningTh}
          onDone={(ok) => advance(ok ? 5 : 0)}
        />
      )}
    </div>
  )
}

function ChoiceReview({
  item,
  pool,
  onDone,
}: {
  item: VocabItem
  pool: VocabItem[]
  onDone: (correct: boolean) => void
}) {
  const { choices, answerIndex } = useMemo(() => {
    const wrong = shuffle(pool.filter((it) => it.id !== item.id))
      .slice(0, 3)
      .map((it) => it.meaningTh)
    const all = shuffle([item.meaningTh, ...wrong])
    return { choices: all, answerIndex: all.indexOf(item.meaningTh) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id])

  return (
    <MultipleChoice
      prompt={
        <div className="text-center">
          <div className="text-sm text-slate-500 mb-2">คำนี้แปลว่าอะไร</div>
          <div className={`text-3xl font-bold text-slate-800 ${item.lang === 'zh' ? 'font-zh' : ''}`}>
            {item.headword}
          </div>
          {item.pinyin && <div className="text-slate-500 mt-1">{item.pinyin}</div>}
          <div className="mt-2 flex justify-center">
            <SpeakButton text={item.headword} lang={item.lang} />
          </div>
        </div>
      }
      choices={choices}
      answerIndex={answerIndex}
      onDone={onDone}
    />
  )
}
