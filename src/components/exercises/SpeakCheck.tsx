import { useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import type { Lang } from '../../types/content'
import { diffTarget, similarity } from '../../lib/score'
import { listen, sttSupported, stopSpeaking, type ListenHandle } from '../../lib/speech'
import SpeakButton from '../common/SpeakButton'

interface Props {
  target: string
  lang: Lang
  pinyin?: string
  translationTh?: string
  onScore?: (score: number) => void
}

const ERROR_TH: Record<string, string> = {
  'not-allowed': 'ไม่ได้รับอนุญาตให้ใช้ไมโครโฟน — เปิดสิทธิ์ไมค์ในเบราว์เซอร์ก่อน',
  'no-speech': 'ไม่ได้ยินเสียงพูด ลองอีกครั้ง',
  'audio-capture': 'ไม่พบไมโครโฟน',
  network: 'ระบบรู้จำเสียงต้องใช้อินเทอร์เน็ต ลองอีกครั้ง',
}

export default function SpeakCheck({ target, lang, pinyin, translationTh, onScore }: Props) {
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const handleRef = useRef<ListenHandle | null>(null)

  useEffect(() => {
    setTranscript(null)
    setError(null)
    setRecording(false)
  }, [target])

  const score = transcript !== null ? similarity(target, transcript, lang) : null

  const start = async () => {
    setError(null)
    setTranscript(null)
    stopSpeaking()
    setRecording(true)
    const handle = listen(lang)
    handleRef.current = handle
    try {
      const text = await handle.result
      setTranscript(text)
      onScore?.(similarity(target, text, lang))
    } catch (e) {
      const key = e instanceof Error ? e.message : 'unknown'
      setError(ERROR_TH[key] ?? `เกิดข้อผิดพลาด (${key})`)
    } finally {
      setRecording(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="text-center">
        <div className={`text-2xl font-bold text-slate-800 ${lang === 'zh' ? 'font-zh' : ''}`}>{target}</div>
        {pinyin && <div className="text-slate-500 mt-1">{pinyin}</div>}
        {translationTh && <div className="text-sm text-slate-500 mt-1">{translationTh}</div>}
        <div className="flex justify-center items-center gap-4 mt-4">
          <SpeakButton text={target} lang={lang} size="lg" />
          {sttSupported() ? (
            <button
              type="button"
              onClick={recording ? () => handleRef.current?.stop() : start}
              className={`p-3 rounded-full transition-colors ${
                recording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
              }`}
              aria-label={recording ? 'หยุดอัด' : 'เริ่มพูด'}
            >
              {recording ? <Square size={28} /> : <Mic size={28} />}
            </button>
          ) : (
            <div className="text-xs text-slate-400 max-w-[180px] text-left">
              เบราว์เซอร์นี้ไม่รองรับการรู้จำเสียง — แนะนำ Chrome หรือ Edge เพื่อฝึกพูด
            </div>
          )}
        </div>
        {recording && <div className="text-sm text-rose-500 mt-2 font-medium">กำลังฟัง... พูดได้เลย</div>}
      </div>

      {error && <div className="mt-4 rounded-xl bg-amber-50 text-amber-700 text-sm p-3">{error}</div>}

      {transcript !== null && score !== null && (
        <div className={`mt-4 rounded-xl p-4 ${score >= 80 ? 'bg-emerald-50' : score >= 50 ? 'bg-amber-50' : 'bg-rose-50'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">คะแนนการออกเสียง</span>
            <span
              className={`text-2xl font-extrabold ${
                score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {score}%
            </span>
          </div>
          <div className="text-sm text-slate-500 mt-2">
            ระบบได้ยิน: <span className={`text-slate-700 ${lang === 'zh' ? 'font-zh' : ''}`}>{transcript}</span>
          </div>
          <div className={`mt-2 text-lg ${lang === 'zh' ? 'font-zh' : ''}`}>
            {diffTarget(target, transcript, lang).map((u, i) => (
              <span key={i} className={u.hit ? 'text-emerald-600' : 'text-rose-500 font-bold underline'}>
                {u.text}
                {lang === 'en' ? ' ' : ''}
              </span>
            ))}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {score >= 80 ? 'ยอดเยี่ยม! ออกเสียงชัดเจน 👏' : 'คำสีแดงคือส่วนที่ระบบฟังไม่ตรง — ฟังต้นแบบแล้วลองใหม่'}
          </div>
        </div>
      )}
    </div>
  )
}
