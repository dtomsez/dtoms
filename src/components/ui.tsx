import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { ELEMENTS } from '../lib/data'
import type { ElementKey } from '../lib/data'

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-night-800/80 border border-gold-500/15 rounded-2xl p-5 shadow-lg shadow-black/30 backdrop-blur ${onClick ? 'cursor-pointer hover:border-gold-500/40 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionTitle({ icon, title, sub }: { icon?: ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {icon && <div className="text-gold-400 text-xl">{icon}</div>}
      <div>
        <h2 className="text-lg font-semibold text-gold-100">{title}</h2>
        {sub && <p className="text-xs text-night-300">{sub}</p>}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-night-900 border border-gold-500/25 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gold-200">{title}</h3>
          <button onClick={onClose} className="text-night-300 hover:text-gold-300 p-1 rounded-lg hover:bg-night-700">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ElementBadge({ el, size = 'md' }: { el: ElementKey; size?: 'sm' | 'md' | 'lg' }) {
  const info = ELEMENTS[el]
  const cls = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${cls}`} style={{ backgroundColor: info.color + '22', color: info.color, border: `1px solid ${info.color}55` }}>
      {info.cn} {info.th}
    </span>
  )
}

export function ScoreRing({ score, size = 90, label }: { score: number; size?: number; label?: string }) {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  const color = score >= 70 ? '#4ade80' : score >= 45 ? '#e3a54b' : '#f87171'
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a2438" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold" style={{ color }}>{score}</div>
        {label && <div className="text-[9px] text-night-300">{label}</div>}
      </div>
    </div>
  )
}

export function ElementBar({ percent }: { percent: Record<ElementKey, number> }) {
  const keys: ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water']
  return (
    <div className="space-y-2">
      {keys.map(k => (
        <div key={k} className="flex items-center gap-2">
          <span className="w-16 text-xs text-night-200">{ELEMENTS[k].emoji} {ELEMENTS[k].th}</span>
          <div className="flex-1 h-2.5 bg-night-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${percent[k]}%`, backgroundColor: ELEMENTS[k].color }} />
          </div>
          <span className="w-9 text-right text-xs font-mono text-night-200">{percent[k]}%</span>
        </div>
      ))}
    </div>
  )
}

export function PillarBox({ label, stemCn, stemSub, branchCn, branchSub, stemColor, branchColor, highlight, onClick, footer }: {
  label: string
  stemCn: string; stemSub: string; stemColor: string
  branchCn: string; branchSub: string; branchColor: string
  highlight?: boolean
  onClick?: () => void
  footer?: ReactNode
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-3 text-center bg-night-800/70 ${highlight ? 'border-gold-400/70 shadow-[0_0_18px_rgba(227,165,75,0.25)]' : 'border-night-600'} ${onClick ? 'cursor-pointer hover:border-gold-400/50' : ''}`}
    >
      <div className={`text-[11px] mb-2 ${highlight ? 'text-gold-300 font-semibold' : 'text-night-300'}`}>{label}</div>
      <div className="text-3xl font-bold leading-none" style={{ color: stemColor }}>{stemCn}</div>
      <div className="text-[10px] mt-1 text-night-300">{stemSub}</div>
      <div className="my-2 border-t border-night-600" />
      <div className="text-3xl font-bold leading-none" style={{ color: branchColor }}>{branchCn}</div>
      <div className="text-[10px] mt-1 text-night-300">{branchSub}</div>
      {footer}
    </div>
  )
}

export function HexagramFigure({ upper, lower, size = 'md' }: { upper: number[]; lower: number[]; size?: 'sm' | 'md' }) {
  const lines = [...upper, ...lower] // top → bottom
  const w = size === 'sm' ? 34 : 48
  const h = size === 'sm' ? 3 : 4
  return (
    <div className="inline-flex flex-col gap-[3px]">
      {lines.map((l, i) => l === 1
        ? <div key={i} className="bg-gold-400 rounded-sm" style={{ width: w, height: h }} />
        : <div key={i} className="flex gap-[6px]"><div className="bg-gold-400 rounded-sm" style={{ width: (w - 6) / 2, height: h }} /><div className="bg-gold-400 rounded-sm" style={{ width: (w - 6) / 2, height: h }} /></div>
      )}
    </div>
  )
}
