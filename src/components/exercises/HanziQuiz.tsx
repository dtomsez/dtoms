import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import { Eraser, Eye, Pencil } from 'lucide-react'

interface Props {
  char: string
  onComplete?: (totalMistakes: number) => void
}

/** ฝึกเขียนอักษรจีนตามลำดับขีด (ข้อมูลเส้นโหลดจาก CDN ของ hanzi-writer) */
export default function HanziQuiz({ char, onComplete }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)
  const [mode, setMode] = useState<'idle' | 'watch' | 'quiz'>('idle')
  const [loadError, setLoadError] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!boxRef.current) return
    boxRef.current.innerHTML = ''
    try {
      writerRef.current = HanziWriter.create(boxRef.current, char, {
        width: 220,
        height: 220,
        padding: 12,
        showCharacter: true,
        showOutline: true,
        strokeColor: '#4338ca',
        outlineColor: '#e2e8f0',
        drawingColor: '#0f172a',
        drawingWidth: 18,
        onLoadCharDataError: () => setLoadError(true),
      })
    } catch {
      queueMicrotask(() => setLoadError(true))
    }
    return () => {
      writerRef.current = null
    }
  }, [char])

  const watch = () => {
    const w = writerRef.current
    if (!w) return
    setMode('watch')
    setDone(false)
    w.cancelQuiz()
    void w.showCharacter()
    void w.animateCharacter({ onComplete: () => setMode('idle') })
  }

  const quiz = () => {
    const w = writerRef.current
    if (!w) return
    setMode('quiz')
    setDone(false)
    void w.hideCharacter()
    w.quiz({
      showHintAfterMisses: 2,
      onComplete: (summary) => {
        setDone(true)
        setMode('idle')
        onComplete?.(summary.totalMistakes)
      },
    })
  }

  return (
    <div className="flex flex-col items-center">
      <div
        ref={boxRef}
        className="bg-white rounded-2xl border-2 border-slate-200 touch-none"
        style={{ width: 220, height: 220 }}
      />
      {loadError && (
        <div className="text-sm text-amber-600 mt-2 text-center">
          โหลดข้อมูลเส้นอักษร “{char}” ไม่ได้ (ต้องต่ออินเทอร์เน็ต)
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={watch}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200"
        >
          <Eye size={18} /> ดูวิธีเขียน
        </button>
        <button
          type="button"
          onClick={quiz}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold ${
            mode === 'quiz' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
          }`}
        >
          <Pencil size={18} /> {mode === 'quiz' ? 'กำลังเขียน...' : 'ฝึกเขียนเอง'}
        </button>
        {mode === 'quiz' && (
          <button
            type="button"
            onClick={quiz}
            aria-label="เริ่มใหม่"
            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <Eraser size={18} />
          </button>
        )}
      </div>
      {done && <div className="mt-3 text-emerald-600 font-bold">เขียนครบทุกขีดแล้ว 🎉</div>}
      {mode === 'quiz' && !done && (
        <div className="mt-3 text-xs text-slate-400">ลากนิ้ว/เมาส์เขียนทีละขีดตามลำดับ</div>
      )}
    </div>
  )
}
