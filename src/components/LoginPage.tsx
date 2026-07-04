import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { Sparkles } from 'lucide-react'

const GOOGLE_EMAIL = 'dtoms.ez@gmail.com'

export default function LoginPage() {
  const login = useAppStore(s => s.login)
  const [busy, setBusy] = useState(false)

  const handleGoogle = () => {
    setBusy(true)
    // demo auth: signs in with the linked Google account
    setTimeout(() => login(GOOGLE_EMAIL.split('@')[0], GOOGLE_EMAIL), 700)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* mystic backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,80,220,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(227,165,75,0.12),transparent_55%)]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(1px 1px at 20% 30%, #fff8 0, transparent 100%), radial-gradient(1px 1px at 70% 20%, #fff6 0, transparent 100%), radial-gradient(1.5px 1.5px at 40% 70%, #fff7 0, transparent 100%), radial-gradient(1px 1px at 85% 60%, #fff5 0, transparent 100%), radial-gradient(1px 1px at 10% 80%, #fff6 0, transparent 100%)' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-purple-700 shadow-[0_0_45px_rgba(227,165,75,0.45)] mb-4">
            <span className="text-4xl">𓁟</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-300 via-gold-100 to-purple-300 bg-clip-text text-transparent tracking-wide">
            Sesheta
          </h1>
          <p className="text-night-200 mt-2 text-sm">
            รวมทุกศาสตร์จีนไว้ในแอพเดียว — ดวงจีน BaZi · ฉีเหมินตุ้นเจี่ย · ปฏิทินมงคล · เลขศาสตร์ · Sesheta AI
          </p>
          <p className="text-[11px] text-night-400 mt-1">เพื่อความแม่นยำในทุกการตัดสินใจของคุณ</p>
        </div>

        <div className="bg-night-800/80 border border-gold-500/20 rounded-2xl p-6 backdrop-blur shadow-2xl">
          <button
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium rounded-xl py-3 hover:bg-gray-100 transition disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.3 44 30.1 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            {busy ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบด้วย Google'}
          </button>
          <div className="text-center text-[11px] text-night-400 mt-3">
            บัญชีที่เชื่อมไว้: <span className="text-gold-300">{GOOGLE_EMAIL}</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 text-[11px] text-night-300">
            {[
              '☯️ BaZi ดวงชะตาสี่เสา',
              '📅 Tong Shu ปฏิทินมงคล',
              '🧭 Qi Men Dun Jia',
              '🤖 Sesheta AI ที่ปรึกษา',
              '🔢 เลขศาสตร์ 數字',
              '✨ Zero Hallucination Engine',
            ].map(f => (
              <div key={f} className="flex items-center gap-1.5 bg-night-700/50 rounded-lg px-2.5 py-2">
                <Sparkles size={11} className="text-gold-400 shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-night-500 mt-6">
          Sesheta — ระบบ Data โหราศาสตร์จีนที่ลึกล้ำและแม่นยำที่สุด
        </p>
      </div>
    </div>
  )
}
