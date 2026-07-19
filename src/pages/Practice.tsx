import { Link } from 'react-router-dom'
import { BookText, Mic, PencilLine } from 'lucide-react'
import { LANG_META } from '../data/content'
import type { Lang } from '../types/content'

const skills = [
  { key: 'speaking', label: 'ฝึกพูด', desc: 'ฟังต้นแบบ แล้วพูดตาม ระบบให้คะแนนการออกเสียง', icon: Mic, color: 'from-rose-500 to-pink-500' },
  { key: 'writing', label: 'ฝึกเขียน', desc: 'ฟัง-พิมพ์ตามคำบอก แปลประโยค และเขียนอักษรจีน', icon: PencilLine, color: 'from-sky-500 to-cyan-500' },
  { key: 'reading', label: 'ฝึกอ่าน', desc: 'อ่านบทความตามระดับ แตะคำเพื่อดูคำแปล', icon: BookText, color: 'from-amber-500 to-orange-500' },
]

export default function Practice() {
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">ฝึกทักษะ</h1>
        <p className="text-slate-500 text-sm">เลือกทักษะและภาษาที่อยากฝึกวันนี้</p>
      </div>

      {skills.map((skill) => (
        <div key={skill.key}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white`}>
              <skill.icon size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-800">{skill.label}</div>
              <div className="text-xs text-slate-500">{skill.desc}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['en', 'zh'] as Lang[]).map((lang) => (
              <Link
                key={lang}
                to={`/${skill.key}/${lang}`}
                className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:border-indigo-300 transition-colors"
              >
                <span className="text-xl">{LANG_META[lang].flag}</span> {LANG_META[lang].nameTh}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
