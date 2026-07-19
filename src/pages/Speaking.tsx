import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Lang } from '../types/content'
import { LANG_META, unitsFor } from '../data/content'
import { useProgressStore } from '../store/progressStore'
import SkillHeader from '../components/layout/SkillHeader'
import SpeakCheck from '../components/exercises/SpeakCheck'

interface Phrase {
  text: string
  pinyin?: string
  translationTh: string
}

export default function Speaking() {
  const { lang } = useParams<{ lang: Lang }>()
  const addStat = useProgressStore((s) => s.addStat)
  const [index, setIndex] = useState(0)
  const [scored, setScored] = useState<Set<number>>(new Set())

  const phrases = useMemo<Phrase[]>(() => {
    if (lang !== 'en' && lang !== 'zh') return []
    const list: Phrase[] = []
    for (const unit of unitsFor(lang)) {
      for (const item of unit.items) {
        const ex = item.examples[0]
        if (ex) list.push({ text: ex.text, pinyin: ex.pinyin, translationTh: ex.translationTh })
      }
    }
    return list
  }, [lang])

  if (lang !== 'en' && lang !== 'zh') return <div>ไม่พบภาษา</div>
  if (phrases.length === 0) return <div>ยังไม่มีเนื้อหา</div>

  const phrase = phrases[index]

  const handleScore = (score: number) => {
    if (!scored.has(index)) {
      setScored((s) => new Set(s).add(index))
      addStat({ xp: score >= 80 ? 5 : score >= 50 ? 3 : 1, minutes: 1 })
    }
  }

  return (
    <div>
      <SkillHeader
        title={`ฝึกพูด ${LANG_META[lang].nameTh}`}
        subtitle="ฟังเสียงต้นแบบ กดไมค์แล้วพูดตาม"
        step={index + 1}
        total={phrases.length}
      />

      <div className="text-center text-sm text-slate-400 mb-3">
        ประโยค {index + 1} / {phrases.length}
      </div>

      <SpeakCheck
        key={index}
        target={phrase.text}
        lang={lang}
        pinyin={phrase.pinyin}
        translationTh={phrase.translationTh}
        onScore={handleScore}
      />

      <div className="flex justify-between mt-4">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="flex items-center gap-1 px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold disabled:opacity-40"
        >
          <ChevronLeft size={18} /> ก่อนหน้า
        </button>
        <button
          type="button"
          disabled={index === phrases.length - 1}
          onClick={() => setIndex((i) => Math.min(phrases.length - 1, i + 1))}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40"
        >
          ถัดไป <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
