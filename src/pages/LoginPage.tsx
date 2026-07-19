import { useState, type FormEvent } from 'react'
import { Database, LogIn, UserPlus, UserRound } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { getSheetsUrl, saveSheetsUrl } from '../lib/sheets'

export default function LoginPage() {
  const { signIn, signUp, continueAsGuest, provider } = useAuthStore()
  const hasBackend = provider !== 'none'
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [sheetsUrl, setSheetsUrl] = useState(getSheetsUrl())

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setBusy(true)
    const err = mode === 'login' ? await signIn(email, password) : await signUp(email, password)
    setBusy(false)
    if (err) {
      setError(err)
    } else if (mode === 'register') {
      setNotice('สมัครสำเร็จ! ถ้าระบบส่งอีเมลยืนยัน กรุณายืนยันก่อนเข้าสู่ระบบ')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-indigo-50 to-slate-100">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🌏</div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Lingo<span className="text-indigo-600">Daily</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            ฝึกภาษาอังกฤษ 🇬🇧 และภาษาจีน 🇨🇳 ทุกวัน
            <br />
            อ่านออก เขียนได้ พูดคล่อง
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1 mb-4">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mode === m ? 'bg-white shadow text-indigo-700' : 'text-slate-500'
                }`}
              >
                {m === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="grid gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมล"
              className="rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-indigo-400 focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
              className="rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-indigo-400 focus:outline-none"
            />
            {error && <div className="text-sm text-rose-600 bg-rose-50 rounded-lg p-2">{error}</div>}
            {notice && <div className="text-sm text-emerald-700 bg-emerald-50 rounded-lg p-2">{notice}</div>}
            <button
              type="submit"
              disabled={busy}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {busy ? 'กำลังดำเนินการ...' : mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </button>
          </form>

          {provider === 'sheets' && (
            <div className="text-xs text-emerald-700 bg-emerald-50 rounded-lg p-2 mt-3">
              เชื่อมต่อ Google Sheets แล้ว — สมัคร/เข้าสู่ระบบเพื่อบันทึกความคืบหน้าลงชีตและซิงก์ข้ามอุปกรณ์
            </div>
          )}
          {!hasBackend && (
            <div className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 mt-3">
              ยังไม่ได้ตั้งค่าฐานข้อมูล — ใช้โหมด Guest ได้เลย (ข้อมูลเก็บในเครื่องนี้)
              วิธีเชื่อม Google Sheets อยู่ใน README
            </div>
          )}

          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full flex items-center justify-center gap-2 mt-3 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
          >
            <UserRound size={18} /> ใช้แบบไม่ login (Guest)
          </button>

          {/* ตั้งค่า Google Sheets เป็นฐานข้อมูล (วาง URL ได้เองบนเว็บที่ deploy แล้ว) */}
          <button
            type="button"
            onClick={() => setShowConfig((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 mt-3 text-xs text-slate-400 hover:text-slate-600"
          >
            <Database size={14} /> เชื่อมต่อ Google Sheets เป็นฐานข้อมูล
          </button>
          {showConfig && (
            <div className="mt-2 grid gap-2 bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">
                วาง URL ของ Google Apps Script Web App (ลงท้าย <code>/exec</code>) — ดูวิธีสร้างใน README
              </p>
              <input
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  saveSheetsUrl(sheetsUrl)
                  window.location.reload()
                }}
                className="py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                บันทึกและเชื่อมต่อ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
