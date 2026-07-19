import { useState, type ReactNode } from 'react'

interface Props {
  prompt: ReactNode
  choices: string[]
  answerIndex: number
  choiceClassName?: string
  onDone: (correct: boolean) => void
}

export default function MultipleChoice({ prompt, choices, answerIndex, choiceClassName = '', onDone }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">{prompt}</div>
      <div className="grid gap-2">
        {choices.map((choice, i) => {
          let cls = 'bg-white border-slate-200 hover:border-indigo-300'
          if (answered) {
            if (i === answerIndex) cls = 'bg-emerald-50 border-emerald-400 text-emerald-800'
            else if (i === selected) cls = 'bg-rose-50 border-rose-400 text-rose-700'
            else cls = 'bg-white border-slate-200 opacity-60'
          }
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setSelected(i)}
              className={`text-left px-4 py-3 rounded-xl border-2 font-medium transition-colors ${cls} ${choiceClassName}`}
            >
              {choice}
            </button>
          )
        })}
      </div>
      {answered && (
        <button
          type="button"
          onClick={() => onDone(selected === answerIndex)}
          className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          ต่อไป
        </button>
      )}
    </div>
  )
}
