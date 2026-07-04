import type { ReactNode } from 'react'
import { useAppStore } from '../store/appStore'
import type { ModuleKey } from '../store/appStore'
import { LogOut, UserRound } from 'lucide-react'

const MENU: { key: ModuleKey; icon: string; th: string; sub: string; badge?: string }[] = [
  { key: 'bazi',       icon: '☯️', th: 'ดวงจีน BaZi',        sub: '八字 สี่เสาชะตา' },
  { key: 'tongshu',    icon: '📅', th: 'ปฏิทินมงคล',          sub: '通勝 Tong Shu' },
  { key: 'qimen',      icon: '🧭', th: 'ฉีเหมินตุ้นเจี่ย',      sub: '奇門遁甲' },
  { key: 'sesheta',    icon: '𓁟', th: 'Sesheta AI',          sub: 'ที่ปรึกษาดวงชะตา' },
  { key: 'numerology', icon: '🔢', th: 'เลขศาสตร์',           sub: '數字', badge: 'ใหม่!' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { user, module, setModule, logout, birth } = useAppStore()

  return (
    <div className="min-h-screen flex bg-night-950 text-night-100">
      {/* sidebar */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col border-r border-gold-500/10 bg-night-900/70 backdrop-blur sticky top-0 h-screen">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-gold-500/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-purple-700 flex items-center justify-center text-xl shadow-[0_0_18px_rgba(227,165,75,0.35)]">𓁟</div>
          <div>
            <div className="font-bold text-gold-200 tracking-wide">Sesheta</div>
            <div className="text-[10px] text-night-400">Chinese Metaphysics AI</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {MENU.map(m => (
            <button
              key={m.key}
              onClick={() => setModule(m.key)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                module === m.key
                  ? 'bg-gradient-to-r from-gold-500/20 to-purple-600/15 border border-gold-500/35 text-gold-100'
                  : 'hover:bg-night-800 text-night-200 border border-transparent'
              }`}
            >
              <span className="text-lg w-6 text-center">{m.icon}</span>
              <span className="flex-1">
                <span className="block text-sm font-medium flex items-center gap-1.5">
                  {m.th}
                  {m.badge && <span className="text-[9px] bg-red-500/90 text-white rounded-full px-1.5 py-px">{m.badge}</span>}
                </span>
                <span className="block text-[10px] text-night-400">{m.sub}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gold-500/10">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-purple-600/40 border border-purple-400/40 flex items-center justify-center">
              <UserRound size={15} className="text-purple-200" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{birth?.name || user?.name}</div>
              <div className="text-[10px] text-night-400 truncate">{user?.email}</div>
            </div>
            <button onClick={logout} title="ออกจากระบบ" className="text-night-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-night-800">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* mobile top nav */}
        <div className="md:hidden sticky top-0 z-40 bg-night-900/90 backdrop-blur border-b border-gold-500/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">𓁟</span>
              <span className="font-bold text-gold-200">Sesheta</span>
            </div>
            <button onClick={logout} className="text-night-400 p-1"><LogOut size={16} /></button>
          </div>
          <div className="flex overflow-x-auto gap-1 px-2 pb-2">
            {MENU.map(m => (
              <button key={m.key} onClick={() => setModule(m.key)}
                className={`whitespace-nowrap text-xs rounded-full px-3 py-1.5 border ${module === m.key ? 'bg-gold-500/20 border-gold-500/40 text-gold-200' : 'border-night-700 text-night-300'}`}>
                {m.icon} {m.th}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
