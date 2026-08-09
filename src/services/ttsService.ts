import type { AnnouncementPriority } from '../types'

type SpeechTask = {
  id: string
  text: string
  priority: AnnouncementPriority
  volume: number
  onStart?: () => void
  onEnd?: () => void
}

const priorityWeight: Record<AnnouncementPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 }

class TTSService {
  private queue: SpeechTask[] = []
  private current: SpeechTask | null = null
  private fallbackTimer?: number

  speak(task: SpeechTask) {
    this.queue.push(task)
    this.queue.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
    this.playNext()
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    if (this.fallbackTimer) window.clearTimeout(this.fallbackTimer)
    this.current?.onEnd?.()
    this.current = null
    this.queue = []
  }

  private playNext() {
    if (this.current || !this.queue.length) return
    const task = this.queue.shift()!
    this.current = task
    task.onStart?.()
    const finish = () => {
      if (this.current?.id !== task.id) return
      this.current = null
      task.onEnd?.()
      this.playNext()
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      const utterance = new SpeechSynthesisUtterance(task.text)
      utterance.lang = 'zh-CN'
      utterance.volume = Math.max(0, Math.min(1, task.volume / 100))
      utterance.rate = 0.92
      utterance.onend = finish
      utterance.onerror = finish
      window.speechSynthesis.speak(utterance)
      return
    }
    this.fallbackTimer = window.setTimeout(finish, Math.min(8000, Math.max(2500, task.text.length * 110)))
  }
}

export const ttsService = new TTSService()
