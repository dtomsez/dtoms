import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Flame, Home, Mic, RotateCcw, User } from 'lucide-react'
import { currentStreak, todayKey, useProgressStore } from '../../store/progressStore'

const tabs = [
  { to: '/', label: 'หน้าหลัก', icon: Home },
  { to: '/learn', label: 'บทเรียน', icon: BookOpen },
  { to: '/review', label: 'ทบทวน', icon: RotateCcw },
  { to: '/practice', label: 'ฝึกทักษะ', icon: Mic },
  { to: '/profile', label: 'โปรไฟล์', icon: User },
]

export default function AppShell() {
  const daily = useProgressStore((s) => s.daily)
  const streak = currentStreak(daily)
  const todayXp = daily[todayKey()]?.xp ?? 0

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌏</span>
            <span className="font-extrabold text-lg text-slate-800">
              Lingo<span className="text-indigo-600">Daily</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="flex items-center gap-1 text-orange-500" title="วันติดต่อกัน">
              <Flame size={18} className={streak > 0 ? 'fill-orange-400' : ''} />
              {streak}
            </span>
            <span className="text-amber-500" title="XP วันนี้">⭐ {todayXp}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto grid grid-cols-5">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
