import { eachDayOfInterval, format, subDays } from 'date-fns'
import type { DailyStat } from '../../types/progress'

interface Props {
  daily: Record<string, DailyStat>
  days?: number
}

function level(xp: number): string {
  if (xp === 0) return 'bg-slate-100'
  if (xp < 20) return 'bg-emerald-200'
  if (xp < 50) return 'bg-emerald-400'
  if (xp < 100) return 'bg-emerald-500'
  return 'bg-emerald-600'
}

export default function Heatmap({ daily, days = 91 }: Props) {
  const today = new Date()
  const start = subDays(today, days - 1)
  const allDays = eachDayOfInterval({ start, end: today })
  const leadPad = allDays[0].getDay() // เว้นช่องให้เริ่มต้นตรงวันในสัปดาห์

  return (
    <div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1" style={{ gridAutoColumns: '12px' }}>
        {Array.from({ length: leadPad }).map((_, i) => (
          <div key={`pad-${i}`} className="w-3 h-3" />
        ))}
        {allDays.map((d) => {
          const key = format(d, 'yyyy-MM-dd')
          const xp = daily[key]?.xp ?? 0
          return (
            <div
              key={key}
              className={`w-3 h-3 rounded-sm ${level(xp)}`}
              title={`${format(d, 'd MMM')}: ${xp} XP`}
            />
          )
        })}
      </div>
      <div className="flex items-center gap-1 justify-end mt-2 text-[10px] text-slate-400">
        น้อย
        <span className="w-3 h-3 rounded-sm bg-slate-100" />
        <span className="w-3 h-3 rounded-sm bg-emerald-200" />
        <span className="w-3 h-3 rounded-sm bg-emerald-400" />
        <span className="w-3 h-3 rounded-sm bg-emerald-600" />
        มาก
      </div>
    </div>
  )
}
