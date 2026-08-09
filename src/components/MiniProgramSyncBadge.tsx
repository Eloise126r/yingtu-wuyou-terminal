import { CheckCircle2, Smartphone } from 'lucide-react'

export function MiniProgramSyncBadge({ completed = false }: { completed?: boolean }) {
  return (
    <span className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-black ${completed ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
      {completed ? <CheckCircle2 size={16} /> : <Smartphone size={16} />}
      {completed ? '已在手机端完成' : '与手机端同步'}
    </span>
  )
}
