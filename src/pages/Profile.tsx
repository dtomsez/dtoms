import { useRef, useState } from 'react'
import { Award, Download, LogOut, RotateCcw, Upload } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import {
  currentStreak,
  learningCount,
  matureCount,
  totalXp,
  useProgressStore,
} from '../store/progressStore'
import { LANG_META } from '../data/content'
import { BADGES, earnedBadges } from '../data/badges'
import type { Lang } from '../types/content'

export default function Profile() {
  const { status, email, signOut } = useAuthStore()
  const settings = useSettingsStore()
  const progress = useProgressStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const streak = currentStreak(progress.daily)
  const xp = totalXp(progress.daily)
  const earned = earnedBadges(progress.cards, progress.daily)

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ cards: progress.cards, units: progress.units, daily: progress.daily, settings }, null, 2)],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lingodaily-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('ดาวน์โหลดไฟล์สำรองข้อมูลแล้ว')
  }

  const importData = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (data.cards && data.units && data.daily) {
          progress.importData({ cards: data.cards, units: data.units, daily: data.daily })
          if (data.settings?.displayName) settings.setDisplayName(data.settings.displayName)
          setMsg('นำเข้าข้อมูลสำเร็จ')
        } else {
          setMsg('ไฟล์ไม่ถูกต้อง')
        }
      } catch {
        setMsg('อ่านไฟล์ไม่ได้')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">โปรไฟล์</h1>
        <p className="text-slate-500 text-sm">
          {status === 'guest' ? 'โหมด Guest (ข้อมูลเก็บในเครื่องนี้)' : email}
        </p>
      </div>

      {/* สถิติรวม */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="วันติดต่อกัน" value={`🔥 ${streak}`} />
        <Stat label="XP รวม" value={`⭐ ${xp}`} />
        {(['en', 'zh'] as Lang[]).map((lang) => (
          <Stat
            key={lang}
            label={`${LANG_META[lang].flag} คำที่จำได้`}
            value={`${matureCount(progress.cards, lang)}`}
            sub={`กำลังเรียน ${learningCount(progress.cards, lang)}`}
          />
        ))}
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
          <Award size={18} className="text-amber-500" /> เหรียญตรา ({earned.size}/{BADGES.length})
        </div>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const has = earned.has(b.id)
            return (
              <div
                key={b.id}
                className={`text-center rounded-xl p-3 ${has ? 'bg-amber-50' : 'bg-slate-50 opacity-50'}`}
                title={b.description}
              >
                <div className="text-3xl">{has ? b.icon : '🔒'}</div>
                <div className="text-xs font-semibold text-slate-600 mt-1">{b.title}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ตั้งค่า */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 grid gap-4">
        <div className="font-semibold text-slate-700">ตั้งค่า</div>

        <label className="grid gap-1">
          <span className="text-sm text-slate-500">ชื่อที่แสดง</span>
          <input
            value={settings.displayName}
            onChange={(e) => settings.setDisplayName(e.target.value)}
            className="rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-indigo-400 focus:outline-none"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-slate-500">เป้าหมาย XP ต่อวัน: {settings.dailyGoalXp}</span>
          <input
            type="range"
            min={20}
            max={200}
            step={10}
            value={settings.dailyGoalXp}
            onChange={(e) => settings.setDailyGoalXp(Number(e.target.value))}
            className="accent-indigo-600"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-slate-500">ความเร็วเสียงอ่าน: {settings.ttsRate.toFixed(1)}x</span>
          <input
            type="range"
            min={0.5}
            max={1.2}
            step={0.1}
            value={settings.ttsRate}
            onChange={(e) => settings.setTtsRate(Number(e.target.value))}
            className="accent-indigo-600"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-slate-500">คำใหม่ต่อวัน (แนะนำ): {settings.newWordsPerDay}</span>
          <input
            type="range"
            min={4}
            max={20}
            step={2}
            value={settings.newWordsPerDay}
            onChange={(e) => settings.setNewWordsPerDay(Number(e.target.value))}
            className="accent-indigo-600"
          />
        </label>
      </div>

      {/* ข้อมูล */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 grid gap-2">
        <div className="font-semibold text-slate-700 mb-1">ข้อมูลของฉัน</div>
        {msg && <div className="text-sm text-emerald-700 bg-emerald-50 rounded-lg p-2">{msg}</div>}
        <button
          type="button"
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
        >
          <Download size={18} /> ดาวน์โหลดข้อมูลสำรอง (JSON)
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
        >
          <Upload size={18} /> นำเข้าข้อมูลจากไฟล์
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => {
            if (confirm('ล้างความคืบหน้าทั้งหมด? การกระทำนี้ย้อนกลับไม่ได้')) {
              progress.resetAll()
              setMsg('ล้างข้อมูลแล้ว')
            }
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-rose-200 text-rose-600 font-semibold hover:bg-rose-50"
        >
          <RotateCcw size={18} /> ล้างความคืบหน้าทั้งหมด
        </button>
      </div>

      <button
        type="button"
        onClick={signOut}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900"
      >
        <LogOut size={18} /> ออกจากระบบ
      </button>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-extrabold text-slate-800 mt-1">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  )
}
