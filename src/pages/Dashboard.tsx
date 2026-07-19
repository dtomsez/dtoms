import { Link } from 'react-router-dom'
import { BookOpen, Flame, GraduationCap, Mic, RotateCcw, Sparkles, Target } from 'lucide-react'
import {
  currentStreak,
  dueCards,
  learningCount,
  matureCount,
  todayKey,
  useProgressStore,
} from '../store/progressStore'
import { useSettingsStore } from '../store/settingsStore'
import { LANG_META, unitsFor } from '../data/content'
import type { Lang } from '../types/content'
import ProgressBar from '../components/common/ProgressBar'
import Heatmap from '../components/dashboard/Heatmap'

const LANGS: Lang[] = ['en', 'zh']

export default function Dashboard() {
  const { cards, daily, units } = useProgressStore()
  const { displayName, dailyGoalXp } = useSettingsStore()
  const streak = currentStreak(daily)
  const todayXp = daily[todayKey()]?.xp ?? 0
  const goalPct = Math.min(100, Math.round((todayXp / dailyGoalXp) * 100))

  const totalDue = dueCards(cards).length

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">สวัสดี, {displayName} 👋</h1>
        <p className="text-slate-500 text-sm">มาฝึกภาษาให้ครบทุกวันกันเถอะ</p>
      </div>

      {/* เป้าหมายวันนี้ */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 font-semibold text-slate-700">
            <Target size={18} className="text-indigo-600" /> เป้าหมายวันนี้
          </span>
          <span className="text-sm text-slate-500">
            {todayXp} / {dailyGoalXp} XP
          </span>
        </div>
        <ProgressBar value={todayXp} max={dailyGoalXp} heightClass="h-3" />
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1 text-orange-500 font-semibold">
            <Flame size={16} className={streak > 0 ? 'fill-orange-400' : ''} /> {streak} วันติดต่อกัน
          </span>
          {goalPct >= 100 && <span className="text-emerald-600 font-semibold">✓ ทำเป้าครบแล้ว!</span>}
        </div>
      </div>

      {/* แผนฝึกวันนี้ */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-sm p-5 text-white">
        <div className="flex items-center gap-2 font-bold text-lg mb-1">
          <Sparkles size={20} /> แผนฝึกวันนี้
        </div>
        <p className="text-indigo-100 text-sm mb-4">
          {totalDue > 0
            ? `มีคำรอทบทวน ${totalDue} คำ — ทบทวนก่อน แล้วเรียนคำใหม่และฝึกพูด`
            : 'ไม่มีคำค้างทบทวน — เรียนคำใหม่และฝึกพูดได้เลย!'}
        </p>
        <div className="grid gap-2">
          <Link
            to="/review"
            className="flex items-center justify-between bg-white/15 hover:bg-white/25 rounded-xl px-4 py-3 font-semibold transition-colors"
          >
            <span className="flex items-center gap-2">
              <RotateCcw size={18} /> ทบทวนคำศัพท์
            </span>
            <span className="bg-white text-indigo-700 rounded-full px-2.5 py-0.5 text-sm">{totalDue}</span>
          </Link>
          <Link
            to="/learn/en"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 rounded-xl px-4 py-3 font-semibold transition-colors"
          >
            <BookOpen size={18} /> เรียนบทเรียนใหม่
          </Link>
          <Link
            to="/practice"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 rounded-xl px-4 py-3 font-semibold transition-colors"
          >
            <Mic size={18} /> ฝึกพูด / เขียน / อ่าน
          </Link>
        </div>
      </div>

      {/* สรุปแต่ละภาษา */}
      <div className="grid gap-3 sm:grid-cols-2">
        {LANGS.map((lang) => {
          const meta = LANG_META[lang]
          const langUnits = unitsFor(lang)
          const completed = langUnits.filter((u) => units[u.id]?.status === 'completed').length
          const due = dueCards(cards, lang).length
          const mature = matureCount(cards, lang)
          const learning = learningCount(cards, lang)
          return (
            <Link
              key={lang}
              to={`/learn/${lang}`}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="text-2xl">{meta.flag}</span> {meta.nameTh}
                </span>
                <GraduationCap size={18} className="text-slate-400" />
              </div>
              <div className="text-sm text-slate-500 mb-2">
                บทเรียน {completed}/{langUnits.length} · กรอบ {meta.framework}
              </div>
              <ProgressBar value={completed} max={langUnits.length} colorClass="bg-indigo-500" />
              <div className="flex gap-3 mt-3 text-xs">
                <span className="text-emerald-600 font-semibold">จำแล้ว {mature}</span>
                <span className="text-sky-600 font-semibold">กำลังเรียน {learning}</span>
                {due > 0 && <span className="text-orange-500 font-semibold">รอทบทวน {due}</span>}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="font-semibold text-slate-700 mb-3">สถิติการฝึก 3 เดือน</div>
        <Heatmap daily={daily} />
      </div>
    </div>
  )
}
