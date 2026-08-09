import { AlertTriangle, BellRing, DoorOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function CurrentCall() {
  const { queue, examRoom } = useApp()
  const called = queue.find((patient) => patient.status === 'CALLED') ?? queue.find((patient) => patient.status === 'EXAMINING')
  const normal = examRoom.status === 'NORMAL'
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-7 py-5 text-white shadow-lift">
      <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full bg-white/10" />
      <div className="absolute right-24 top-10 h-24 w-24 rounded-full bg-cyan-200/10" />
      <div className="relative grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
            <BellRing className="animate-pulse" size={30} />
          </span>
          <div>
            <p className="text-sm font-black tracking-[0.2em] text-blue-100">当前叫号 / NOW CALLING</p>
            <p className="mt-1 text-lg font-bold text-white/90">{normal ? '请前往检查室，过号请联系工作人员' : '当前检查暂缓，候检顺序将保留'}</p>
          </div>
        </div>

        <div className="flex items-baseline justify-center gap-5 border-y border-white/15 py-3 lg:border-x lg:border-y-0 lg:px-10 lg:py-0">
          <span className="text-[clamp(2.1rem,3.7vw,4.3rem)] font-black tracking-tight">{called?.ticketNo ?? '--'}</span>
          <span className="text-[clamp(1.7rem,2.6vw,3rem)] font-black">{called?.maskedName ?? '等待叫号'}</span>
        </div>

        <div className="flex items-center justify-end gap-3 text-right">
          <div>
            <p className="text-[clamp(1.45rem,2vw,2.1rem)] font-black">{examRoom.name}</p>
            <p className="mt-1 inline-flex items-center gap-2 font-semibold text-cyan-50">{normal ? <><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />正常运行</> : <><AlertTriangle size={17} />检查暂缓</>}</p>
          </div>
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-blue-600">
            <DoorOpen size={30} />
          </span>
        </div>
      </div>
    </section>
  )
}
