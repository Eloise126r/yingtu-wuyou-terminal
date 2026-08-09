import { AlertTriangle, BellRing, CheckCircle2, Clock3, Volume2, VolumeX } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { AnnouncementType } from '../types'

const tone: Record<AnnouncementType, string> = {
  CALL: 'from-blue-700 to-cyan-500 text-white', EMERGENCY: 'from-amber-500 to-orange-400 text-slate-950', QUIET: 'from-sky-100 to-cyan-50 text-sky-950', DEVICE_FAULT: 'from-amber-500 to-yellow-300 text-slate-950', DEVICE_RECOVERY: 'from-emerald-600 to-teal-400 text-white', DELAY: 'from-orange-100 to-amber-50 text-orange-950', CUSTOM: 'from-blue-700 to-sky-500 text-white', PREPARATION: 'from-blue-700 to-cyan-500 text-white',
}
const icon: Record<AnnouncementType, typeof BellRing> = { CALL: BellRing, EMERGENCY: AlertTriangle, QUIET: VolumeX, DEVICE_FAULT: AlertTriangle, DEVICE_RECOVERY: CheckCircle2, DELAY: Clock3, CUSTOM: Volume2, PREPARATION: BellRing }

export function GlobalAnnouncementOverlay() {
  const { currentAnnouncement } = useApp()
  const location = useLocation()
  if (!currentAnnouncement || location.pathname.startsWith('/technician')) return null
  const Icon = icon[currentAnnouncement.type]
  return <aside className={`announcement-overlay bg-gradient-to-r ${tone[currentAnnouncement.type]}`} role="status" aria-live="assertive"><div className="mx-auto flex w-full max-w-6xl items-center gap-5"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/25"><Icon size={34} /></span><div className="min-w-0 flex-1"><p className="text-sm font-black tracking-[0.16em] opacity-75">影途无忧 · 实时广播</p><h2 className="mt-1 text-3xl font-black">{currentAnnouncement.title}</h2><p className="mt-2 whitespace-pre-line text-lg font-bold leading-7 opacity-90">{currentAnnouncement.screenText}</p>{currentAnnouncement.originalEta && <p className="mt-3 inline-flex rounded-xl bg-white/25 px-4 py-2 font-black">预计等待：原 {currentAnnouncement.originalEta} → 调整后 {currentAnnouncement.adjustedEta}</p>}</div></div></aside>
}
