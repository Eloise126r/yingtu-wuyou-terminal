import { Activity, ArrowLeft, CircleHelp, PersonStanding, RotateCcw, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { DemoCaseSwitcher } from './DemoCaseSwitcher'

interface HeaderProps { title?: string; subtitle?: string }

export function Header({ title, subtitle }: HeaderProps) {
  const [now, setNow] = useState(new Date())
  const location = useLocation()
  const navigate = useNavigate()
  const { resetDemo, elderMode, toggleElderMode } = useApp()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const dateText = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(now)
  const timeText = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)

  return (
    <header className="terminal-header">
      <div className="flex min-w-0 items-center gap-4">
        {isHome ? <div className="logo-mark" aria-hidden="true"><Activity strokeWidth={2.6} /></div> : <button className="header-icon-button" onClick={() => navigate(-1)} aria-label="返回上一页"><ArrowLeft /></button>}
        <div className="min-w-0">
          <p className="truncate text-[clamp(1.2rem,1.7vw,1.8rem)] font-black tracking-tight text-slate-900">{title ?? '影途无忧'}</p>
          <p className="mt-0.5 truncate text-sm font-semibold tracking-wide text-slate-500">{subtitle ?? '医学影像检查智能候诊与全流程引导终端'}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 lg:flex"><Wifi size={18} />服务正常</div>
        <DemoCaseSwitcher />
        <button className={`demo-case-button ${elderMode ? 'bg-blue-100 text-blue-800' : ''}`} onClick={toggleElderMode} aria-pressed={elderMode}><PersonStanding size={20} /><span className="hidden xl:inline">长辈模式</span></button>
        <button className="header-icon-button hidden 2xl:grid" aria-label="使用帮助"><CircleHelp /></button>
        {!isHome && <button className="header-icon-button hidden 2xl:grid" onClick={() => { resetDemo(); navigate('/') }} aria-label="重置演示"><RotateCcw /></button>}
        <div className="min-w-[112px] text-right"><p className="text-[clamp(1.45rem,2vw,2rem)] font-black tabular-nums leading-none text-slate-900">{timeText}</p><p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">{dateText}</p></div>
      </div>
    </header>
  )
}
