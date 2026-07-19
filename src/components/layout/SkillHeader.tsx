import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProgressBar from '../common/ProgressBar'

interface Props {
  title: string
  subtitle?: string
  step?: number
  total?: number
}

export default function SkillHeader({ title, subtitle, step, total }: Props) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3 mb-4">
      <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
        <ArrowLeft size={20} />
      </button>
      <div className="flex-1">
        <div className="font-bold text-slate-800">{title}</div>
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
        {typeof step === 'number' && typeof total === 'number' && (
          <div className="mt-1">
            <ProgressBar value={step} max={total} />
          </div>
        )}
      </div>
    </div>
  )
}
