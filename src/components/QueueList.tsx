import { Accessibility, AlertTriangle, BellRing, CheckCircle2, Clock3, DoorOpen, LogOut, TimerReset } from 'lucide-react'
import { queueStatusMeta } from '../data/mockData'
import type { QueueStatusCode } from '../types'
import { useApp } from '../context/AppContext'

const statusStyle: Record<QueueStatusCode, string> = {
  WAITING: 'bg-slate-100 text-slate-600', READY: 'bg-amber-50 text-amber-700', NEXT: 'bg-sky-50 text-sky-700', CALLED: 'bg-blue-100 text-blue-700',
  EXAMINING: 'bg-blue-100 text-blue-700', TEMP_LEAVE: 'bg-slate-100 text-slate-600', URGENT_DELAY: 'bg-amber-50 text-amber-700', COMPLETED: 'bg-emerald-50 text-emerald-700',
  MISSED: 'bg-amber-50 text-amber-800',
}
const icons = { WAITING: Clock3, READY: TimerReset, NEXT: BellRing, CALLED: BellRing, EXAMINING: DoorOpen, TEMP_LEAVE: LogOut, MISSED: AlertTriangle, URGENT_DELAY: AlertTriangle, COMPLETED: CheckCircle2 }

export function QueueList() {
  const { queue: queuePatients } = useApp()
  return (
    <section className="panel flex min-h-0 flex-col p-6" aria-labelledby="queue-heading">
      <div className="mb-4 flex items-center justify-between">
        <div><p className="eyebrow">CT 2 号检查室 · 候检队列</p><h2 id="queue-heading" className="mt-1 text-2xl font-black text-slate-900">当前候检情况</h2></div>
        <div className="flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700"><Accessibility size={18} />无障碍服务</div>
      </div>
      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {queuePatients.map((patient, index) => {
          const Icon = icons[patient.status]
          return (
            <div key={patient.id} className={`grid grid-cols-[66px_1fr_auto] items-center gap-4 rounded-2xl px-4 py-3.5 ${index === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200/70' : 'bg-slate-50 text-slate-800'}`}>
              <div className={`text-center text-xl font-black tabular-nums ${index === 0 ? 'text-white' : 'text-blue-700'}`}>{patient.ticketNo}</div>
              <span className="truncate text-lg font-black">{patient.maskedName}</span>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-black ${index === 0 ? 'bg-white/18 text-white' : statusStyle[patient.status]}`}><Icon size={16} />{queueStatusMeta[patient.status].label}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-relaxed text-amber-900"><AlertTriangle className="mt-0.5 shrink-0 text-amber-500" size={19} />因急诊患者需优先完成影像检查时，后续候检时间将自动重新计算。</div>
    </section>
  )
}
