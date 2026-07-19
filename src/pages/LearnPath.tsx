import { Link, useParams } from 'react-router-dom'
import { BookOpen, CheckCircle2, Lock, Play } from 'lucide-react'
import { LANG_META, packsFor } from '../data/content'
import type { Lang } from '../types/content'
import { useProgressStore } from '../store/progressStore'

export default function LearnPath() {
  const { lang } = useParams<{ lang: Lang }>()
  const units = useProgressStore((s) => s.units)
  if (lang !== 'en' && lang !== 'zh') return <div>ไม่พบภาษา</div>
  const meta = LANG_META[lang]
  const packs = packsFor(lang)

  // ลำดับ unit ทั้งภาษา เพื่อคำนวณการปลดล็อก (บทถัดไปปลดล็อกเมื่อบทก่อนหน้าเรียนจบ)
  const flat = packs.flatMap((p) => p.units)
  let firstLockedIndex = flat.findIndex((u) => units[u.id]?.status !== 'completed')
  if (firstLockedIndex === -1) firstLockedIndex = flat.length

  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{meta.flag}</span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{meta.nameTh}</h1>
          <p className="text-slate-500 text-sm">เส้นทางบทเรียนตามกรอบ {meta.framework}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['en', 'zh'] as Lang[]).map((l) => (
          <Link
            key={l}
            to={`/learn/${l}`}
            className={`px-4 py-2 rounded-xl font-semibold text-sm ${
              l === lang ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {LANG_META[l].flag} {LANG_META[l].nameTh}
          </Link>
        ))}
      </div>

      {packs.map((pack) => (
        <div key={pack.level}>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800">{pack.name}</h2>
          </div>
          <p className="text-sm text-slate-500 mb-3">{pack.description}</p>
          <div className="grid gap-2">
            {pack.units.map((unit) => {
              const globalIndex = flat.findIndex((u) => u.id === unit.id)
              const prog = units[unit.id]
              const locked = globalIndex > firstLockedIndex
              const completed = prog?.status === 'completed'
              return (
                <UnitRow
                  key={unit.id}
                  locked={locked}
                  completed={completed}
                  inProgress={prog?.status === 'in_progress'}
                  bestScore={prog?.bestScore ?? 0}
                  unitId={unit.id}
                  index={unit.index}
                  title={unit.title}
                  titleTh={unit.titleTh}
                  count={unit.items.length}
                  isZh={lang === 'zh'}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

interface RowProps {
  locked: boolean
  completed: boolean
  inProgress: boolean
  bestScore: number
  unitId: string
  index: number
  title: string
  titleTh: string
  count: number
  isZh: boolean
}

function UnitRow({ locked, completed, inProgress, bestScore, unitId, index, title, titleTh, count, isZh }: RowProps) {
  const inner = (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl border shadow-sm transition-colors ${
        locked
          ? 'bg-slate-50 border-slate-200 opacity-60'
          : 'bg-white border-slate-200 hover:border-indigo-300'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
          completed ? 'bg-emerald-100 text-emerald-600' : locked ? 'bg-slate-200 text-slate-400' : 'bg-indigo-100 text-indigo-600'
        }`}
      >
        {completed ? <CheckCircle2 size={22} /> : locked ? <Lock size={18} /> : index}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-slate-800 truncate ${isZh ? 'font-zh' : ''}`}>{title}</div>
        <div className="text-sm text-slate-500 truncate">
          {titleTh} · {count} คำ{completed ? ` · คะแนนดีสุด ${bestScore}%` : ''}
        </div>
      </div>
      {!locked &&
        (completed ? (
          <BookOpen size={18} className="text-slate-400" />
        ) : (
          <span className="flex items-center gap-1 text-indigo-600 text-sm font-semibold shrink-0">
            <Play size={16} className="fill-indigo-600" /> {inProgress ? 'ต่อ' : 'เริ่ม'}
          </span>
        ))}
    </div>
  )
  if (locked) return inner
  return <Link to={`/lesson/${unitId}`}>{inner}</Link>
}
