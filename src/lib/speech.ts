import type { Lang } from '../types/content'

const LANG_TAG: Record<Lang, string> = { en: 'en-US', zh: 'zh-CN' }

type SpeechRecognitionResultLike = { transcript: string }
interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>>
}
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognitionLike)
    | null
}

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function sttSupported(): boolean {
  return typeof window !== 'undefined' && getRecognitionCtor() !== null
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  const tag = LANG_TAG[lang]
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === tag && v.localService) ??
    voices.find((v) => v.lang === tag) ??
    voices.find((v) => v.lang.startsWith(tag.slice(0, 2))) ??
    null
  )
}

/** อ่านออกเสียงข้อความด้วยเสียงเจ้าของภาษา (เลือก voice ตามภาษาอัตโนมัติ) */
export function speak(text: string, lang: Lang, rate = 1): Promise<void> {
  return new Promise((resolve) => {
    if (!ttsSupported()) {
      resolve()
      return
    }
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = LANG_TAG[lang]
    const voice = pickVoice(lang)
    if (voice) utter.voice = voice
    utter.rate = rate
    utter.onend = () => resolve()
    utter.onerror = () => resolve()
    window.speechSynthesis.speak(utter)
  })
}

export function stopSpeaking(): void {
  if (ttsSupported()) window.speechSynthesis.cancel()
}

export interface ListenHandle {
  stop: () => void
  result: Promise<string>
}

/**
 * ฟังเสียงพูดหนึ่งประโยคแล้วคืน transcript
 * reject ด้วย error string ('not-supported' | 'no-speech' | 'not-allowed' | ...)
 */
export function listen(lang: Lang): ListenHandle {
  const Ctor = getRecognitionCtor()
  if (!Ctor) {
    return {
      stop: () => {},
      result: Promise.reject(new Error('not-supported')),
    }
  }
  const rec = new Ctor()
  rec.lang = LANG_TAG[lang]
  rec.interimResults = false
  rec.maxAlternatives = 1

  let settled = false
  const result = new Promise<string>((resolve, reject) => {
    rec.onresult = (e) => {
      settled = true
      resolve(e.results[0][0].transcript)
    }
    rec.onerror = (e) => {
      settled = true
      reject(new Error(e.error))
    }
    rec.onend = () => {
      if (!settled) reject(new Error('no-speech'))
    }
  })
  rec.start()
  return { stop: () => rec.stop(), result }
}

/** โหลดรายชื่อ voice (บางเบราว์เซอร์โหลด async) */
export function warmUpVoices(): void {
  if (!ttsSupported()) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}
