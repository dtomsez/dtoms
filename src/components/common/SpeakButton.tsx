import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import type { Lang } from '../../types/content'
import { speak, ttsSupported } from '../../lib/speech'
import { useSettingsStore } from '../../store/settingsStore'

interface Props {
  text: string
  lang: Lang
  size?: 'sm' | 'md' | 'lg'
  className?: string
  slow?: boolean
}

export default function SpeakButton({ text, lang, size = 'md', className = '', slow = false }: Props) {
  const ttsRate = useSettingsStore((s) => s.ttsRate)
  const [playing, setPlaying] = useState(false)
  if (!ttsSupported()) return null

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 28 : 20
  const pad = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2'

  return (
    <button
      type="button"
      aria-label="ฟังเสียง"
      onClick={async (e) => {
        e.stopPropagation()
        setPlaying(true)
        await speak(text, lang, slow ? ttsRate * 0.7 : ttsRate)
        setPlaying(false)
      }}
      className={`${pad} rounded-full transition-colors ${
        playing ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
      } ${className}`}
    >
      <Volume2 size={iconSize} />
    </button>
  )
}
