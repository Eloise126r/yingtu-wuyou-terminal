import { HeartPulse, ShieldCheck } from 'lucide-react'
import { hospitalTips } from '../data/mockData'

export function BottomTicker() {
  return (
    <footer className="flex min-h-12 items-center gap-4 overflow-hidden rounded-2xl border border-sky-100 bg-white px-5 shadow-sm">
      <div className="flex shrink-0 items-center gap-2 font-black text-blue-700">
        <HeartPulse size={20} />
        温馨提示
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track whitespace-nowrap text-sm font-semibold text-slate-600">
          {hospitalTips.map((tip) => (
            <span key={tip} className="mr-14">{tip}</span>
          ))}
          {hospitalTips.map((tip) => (
            <span key={`${tip}-repeat`} className="mr-14">{tip}</span>
          ))}
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-2 text-sm font-bold text-emerald-700 lg:flex">
        <ShieldCheck size={18} />
        隐私信息已脱敏
      </div>
    </footer>
  )
}
