import { useState } from 'react'
import type { VocabItem } from '../../types/content'

interface Props {
  items: VocabItem[]
  onDone: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchPairs({ items, onDone }: Props) {
  const [left] = useState(() => shuffle(items))
  const [right] = useState(() => shuffle(items))
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrongFlash, setWrongFlash] = useState<string | null>(null)

  const pickMeaning = (id: string) => {
    if (!selectedWord || matched.has(id)) return
    if (id === selectedWord) {
      const next = new Set(matched)
      next.add(id)
      setMatched(next)
      setSelectedWord(null)
      if (next.size === items.length) setTimeout(onDone, 500)
    } else {
      setWrongFlash(id)
      setTimeout(() => setWrongFlash(null), 400)
      setSelectedWord(null)
    }
  }

  return (
    <div>
      <div className="text-sm text-slate-500 mb-3 text-center">จับคู่คำกับความหมาย</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2 content-start">
          {left.map((it) => (
            <button
              key={it.id}
              type="button"
              disabled={matched.has(it.id)}
              onClick={() => setSelectedWord(it.id)}
              className={`px-3 py-3 rounded-xl border-2 font-semibold transition-all ${it.lang === 'zh' ? 'font-zh text-lg' : ''} ${
                matched.has(it.id)
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-500 opacity-60'
                  : selectedWord === it.id
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              {it.headword}
              {it.pinyin && <div className="text-xs font-normal opacity-70">{it.pinyin}</div>}
            </button>
          ))}
        </div>
        <div className="grid gap-2 content-start">
          {right.map((it) => (
            <button
              key={it.id}
              type="button"
              disabled={matched.has(it.id)}
              onClick={() => pickMeaning(it.id)}
              className={`px-3 py-3 rounded-xl border-2 font-medium transition-all ${
                matched.has(it.id)
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-500 opacity-60'
                  : wrongFlash === it.id
                    ? 'bg-rose-100 border-rose-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              {it.meaningTh}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
