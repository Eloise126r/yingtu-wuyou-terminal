import { ArrowRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface BigButtonProps {
  title: string
  description: string
  icon: LucideIcon
  tone?: 'primary' | 'sky' | 'teal' | 'violet'
  badge?: ReactNode
  onClick: () => void
}

const toneStyles = {
  primary: 'from-blue-600 to-blue-500 text-white shadow-blue-200/80',
  sky: 'from-sky-50 to-white text-sky-950 border-sky-100',
  teal: 'from-teal-50 to-white text-teal-950 border-teal-100',
  violet: 'from-violet-50 to-white text-violet-950 border-violet-100',
}

const iconStyles = {
  primary: 'bg-white/18 text-white',
  sky: 'bg-sky-100 text-sky-600',
  teal: 'bg-teal-100 text-teal-600',
  violet: 'bg-violet-100 text-violet-600',
}

export function BigButton({ title, description, icon: Icon, tone = 'sky', badge, onClick }: BigButtonProps) {
  return (
    <button
      className={`group relative flex min-h-[142px] w-full items-center gap-5 overflow-hidden rounded-[28px] border border-transparent bg-gradient-to-br p-6 text-left shadow-panel transition duration-200 active:scale-[0.98] ${toneStyles[tone]}`}
      onClick={onClick}
    >
      <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${iconStyles[tone]}`}>
        <Icon size={34} strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-3">
          <span className="text-[clamp(1.15rem,1.55vw,1.6rem)] font-black">{title}</span>
          {badge}
        </span>
        <span className={`mt-1.5 block text-sm font-semibold leading-relaxed ${tone === 'primary' ? 'text-blue-50' : 'text-slate-500'}`}>
          {description}
        </span>
      </span>
      <ArrowRight className={`shrink-0 transition-transform group-hover:translate-x-1 ${tone === 'primary' ? 'text-white' : 'text-slate-300'}`} />
    </button>
  )
}
