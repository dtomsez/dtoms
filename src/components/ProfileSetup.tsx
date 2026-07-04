import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { Card } from './ui'
import { Moon, Sun } from 'lucide-react'

export default function ProfileSetup() {
  const { user, setBirth } = useAppStore()
  const [name, setName] = useState(user?.name ?? '')
  const [date, setDate] = useState('1990-01-01')
  const [time, setTime] = useState('12:00')
  const [gender, setGender] = useState<'male' | 'female'>('male')

  const submit = () => {
    const [y, m, d] = date.split('-').map(Number)
    const [hh, mm] = time.split(':').map(Number)
    if (!y || !m || !d) return
    setBirth({ year: y, month: m, day: d, hour: hh, minute: mm, gender, name: name || user?.name || 'ผู้ใช้' })
  }

  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">☯️</div>
        <h1 className="text-xl font-bold text-gold-200">ตั้งค่าดวงชะตาของคุณ</h1>
        <p className="text-sm text-night-300 mt-1">กรอกวันเวลาเกิดเพียงครั้งเดียว ทุกโมดูลจะวิเคราะห์จากดวงจริงของคุณ</p>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-night-300 block mb-1">ชื่อเรียก</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อของคุณ"
              className="w-full bg-night-700/70 border border-night-600 rounded-xl px-3 py-2.5 text-sm focus:border-gold-500/60 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-night-300 block mb-1">วันเกิด (ค.ศ.)</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-night-700/70 border border-night-600 rounded-xl px-3 py-2.5 text-sm focus:border-gold-500/60 outline-none [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-xs text-night-300 block mb-1">เวลาเกิด</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full bg-night-700/70 border border-night-600 rounded-xl px-3 py-2.5 text-sm focus:border-gold-500/60 outline-none [color-scheme:dark]" />
            </div>
          </div>
          <div>
            <label className="text-xs text-night-300 block mb-1">เพศ (ใช้คำนวณทิศทางเสาโชค)</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setGender('male')}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm border ${gender === 'male' ? 'bg-gold-500/20 border-gold-500/50 text-gold-200' : 'border-night-600 text-night-300'}`}>
                <Sun size={15} /> ชาย
              </button>
              <button onClick={() => setGender('female')}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm border ${gender === 'female' ? 'bg-purple-500/20 border-purple-400/50 text-purple-200' : 'border-night-600 text-night-300'}`}>
                <Moon size={15} /> หญิง
              </button>
            </div>
          </div>
          <button onClick={submit}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-night-950 font-semibold rounded-xl py-3 transition shadow-[0_0_25px_rgba(227,165,75,0.3)]">
            ✨ ถอดรหัสดวงชะตา
          </button>
        </div>
      </Card>
    </div>
  )
}
