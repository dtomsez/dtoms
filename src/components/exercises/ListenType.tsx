import { useState } from 'react'
import type { Lang } from '../../types/content'
import { diffTarget, similarity, stripTones } from '../../lib/score'
import SpeakButton from '../common/SpeakButton'

interface Props {
  target: string
  lang: Lang
  /** พินอินของประโยคเป้าหมาย — เปิดให้พิมพ์พินอินแทนอักษรจีนได้ */
  targetPinyin?: string
  hintTh?: string
  onDone: (correct: boolean) => void
}

const PASS_SCORE = 85

export default function ListenType({ target, lang, targetPinyin, hintTh, onDone }: Props) {
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)

  const typedPinyin = lang === 'zh' && targetPinyin && /[a-z]/i.test(answer)
  const score = !checked
    ? 0
    : typedPinyin
      ? similarity(stripTones(targetPinyin), stripTones(answer.toLowerCase()), 'en')
      : similarity(target, answer, lang)
  const passed = score >= PASS_SCORE

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4 text-center">
        <div className="text-sm text-slate-500 mb-3">ฟังแล้วพิมพ์สิ่งที่ได้ยิน</div>
        <div className="flex justify-center gap-3">
          <SpeakButton text={target} lang={lang} size="lg" />
          <SpeakButton text={target} lang={lang} size="lg" slow className="opacity-70" />
        </div>
        <div className="text-xs text-slate-400 mt-2">ปุ่มขวา = พูดช้า</div>
        {hintTh && <div className="mt-3 text-sm text-slate-500">คำใบ้: {hintTh}</div>}
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={checked}
        rows={2}
        placeholder={lang === 'zh' ? 'พิมพ์อักษรจีนหรือพินอิน...' : 'Type what you hear...'}
        className={`w-full rounded-xl border-2 border-slate-200 p-3 focus:border-indigo-400 focus:outline-none ${
          lang === 'zh' ? 'font-zh text-lg' : ''
        }`}
      />

      {checked && (
        <div className={`mt-3 rounded-xl p-4 ${passed ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <div className={`font-bold ${passed ? 'text-emerald-700' : 'text-rose-700'}`}>
            {passed ? `ถูกต้อง! (${score}%)` : `ยังไม่ตรง (${score}%)`}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            เฉลย: <span className={`font-semibold ${lang === 'zh' ? 'font-zh text-base' : ''}`}>{target}</span>
          </div>
          <div className={`mt-1 text-sm ${lang === 'zh' && !typedPinyin ? 'font-zh' : ''}`}>
            {(typedPinyin
              ? diffTarget(stripTones(targetPinyin!), stripTones(answer.toLowerCase()), 'en')
              : diffTarget(target, answer, lang)
            ).map((u, i) => (
              <span key={i} className={u.hit ? 'text-emerald-600' : 'text-rose-500 font-bold'}>
                {u.text}
                {lang === 'en' || typedPinyin ? ' ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {checked ? (
        <button
          type="button"
          onClick={() => onDone(passed)}
          className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
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
