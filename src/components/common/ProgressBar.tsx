interface Props {
  value: number
  max: number
  colorClass?: string
  heightClass?: string
}

export default function ProgressBar({ value, max, colorClass = 'bg-indigo-500', heightClass = 'h-2' }: Props) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={`w-full ${heightClass} bg-slate-200 rounded-full overflow-hidden`}>
      <div className={`${heightClass} ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}
