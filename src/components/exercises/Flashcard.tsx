import { useState } from 'react'
import type { VocabItem } from '../../types/content'
import type { Grade } from '../../types/progress'
import SpeakButton from '../common/SpeakButton'

interface Props {
  item: VocabItem
  onGrade: (grade: Grade) => void
}

const gradeButtons: { grade: Grade; label: string; cls: string }[] = [
  { grade: 0, label: 'ลืม', cls: 'bg-rose-100 text-rose-700 hover:bg-rose-200' },
  { grade: 3, label: 'ยาก', cls: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { grade: 4, label: 'พอได้', cls: 'bg-sky-100 text-sky-700 hover:bg-sky-200' },
  { grade: 5, label: 'ง่าย', cls: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
]

export default function Flashcard({ item, onGrade }: Props) {
  const [flipped, setFlipped] = useState(false)
  const example = item.examples[0]

  return (
    <div>
      <button
        type="button"
        onClick={() => setFlipped(true)}
        className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[220px] flex flex-col items-center justify-center gap-3 cursor-pointer"
      >
        <div className={`text-4xl font-bold text-slate-800 ${item.lang === 'zh' ? 'font-zh' : ''}`}>
          {item.headword}
        </div>
        {item.pinyin && <div className="text-slate-500">{item.pinyin}</div>}
        <SpeakButton text={item.headword} lang={item.lang} />
        {flipped ? (
          <div className="mt-2 text-center border-t border-slate-100 pt-3 w-full">
            <div className="text-xl font-semibold text-indigo-700">{item.meaningTh}</div>
            <div className="text-xs text-slate-400 mt-1">({item.pos})</div>
            {example && (
              <div className="mt-3 text-sm text-slate-600">
                <div className={item.lang === 'zh' ? 'font-zh text-base' : ''}>{example.text}</div>
                {example.pinyin && <div className="text-slate-400">{example.pinyin}</div>}
                <div className="text-slate-500">{example.translationTh}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-400 mt-2">แตะเพื่อดูคำแปล</div>
        )}
      </button>

      {flipped && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {gradeButtons.map(({ grade, label, cls }) => (
            <button
              key={grade}
              type="button"
              onClick={() => onGrade(grade)}
              className={`py-3 rounded-xl font-semibold transition-colors ${cls}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
