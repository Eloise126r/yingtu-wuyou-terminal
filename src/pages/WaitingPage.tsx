import { AlertTriangle, BellRing, Clock3, LogIn, LogOut, Smartphone, Sparkles, UsersRound, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { MiniProgramSyncBadge } from '../components/MiniProgramSyncBadge'
import { PrivacyTimeout } from '../components/PrivacyTimeout'
import { useApp } from '../context/AppContext'
import { queueStatusMeta } from '../data/mockData'
import { getWaitingAdvice } from '../utils/waitingTime'

export function WaitingPage() {
  const [leaveDialog, setLeaveDialog] = useState(false)
  const { patient, waitingEstimate, leaveTemporarily, returnFromLeave, advanceQueue } = useApp()
  const navigate = useNavigate()
  const advice = getWaitingAdvice(patient, waitingEstimate)
  return (
    <div className="terminal-shell">
      <Header title="等待状态" subtitle={`${patient.ticketNo} · ${patient.examName}`} />
      <PrivacyTimeout />
      <main className="terminal-main overflow-y-auto">
        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-blue-700 to-cyan-500 p-8 text-white shadow-lift"><div className="absolute -right-14 -top-24 h-72 w-72 rounded-full bg-white/10" /><div className="relative"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-black tracking-widest text-blue-100">当前预计等待</p><div className="mt-3 flex items-baseline gap-3"><span className="text-[clamp(4rem,8vw,8rem)] font-black leading-none">{waitingEstimate.min}–{waitingEstimate.max}</span><span className="text-3xl font-black">分钟</span></div></div><span className="rounded-full bg-white/15 px-5 py-3 text-lg font-black">{queueStatusMeta[patient.queueStatus].label}</span></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><span className="info-chip"><UsersRound />前方 {patient.aheadCount} 人</span><span className="info-chip"><Clock3 />动态区间</span><MiniProgramSyncBadge /></div></div></div>
          <div className="panel p-7"><p className="eyebrow">智能候检建议</p><h1 className="mt-2 text-3xl font-black">{advice}</h1><p className="mt-4 font-semibold leading-8 text-slate-500">留意大屏和影途无忧手机端提醒。时间变化会在两端同步。</p><div className="mt-6 flex flex-wrap gap-3">{patient.temporaryLeave ? <button className="primary-action flex-1" onClick={returnFromLeave}><LogIn />我已返回</button> : <button className="primary-action flex-1" onClick={() => setLeaveDialog(true)}><LogOut />我要暂离</button>}<button className="secondary-action flex-1" onClick={() => navigate('/patient')}>返回我的候检</button></div></div>
        </section>
        {patient.urgentAdjusted && <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 shrink-0 text-amber-600" /><div><p className="font-black text-amber-950">因急诊患者需优先完成影像检查，当前候检顺序已调整。</p><p className="mt-1 font-semibold text-amber-900">原预计 {patient.previousWaitRange}，调整后 {waitingEstimate.min}–{waitingEstimate.max}分钟。</p></div></div><MiniProgramSyncBadge /></section>}
        <section className="grid flex-1 gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="panel p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">等待时间依据</p><h2 className="mt-1 text-2xl font-black">当前计算因素</h2></div><Sparkles className="text-blue-600" /></div><div className="mt-5 grid gap-3">{waitingEstimate.factors.map((factor,index) => <div key={factor} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 font-bold text-slate-700"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-blue-700 shadow-sm">{index+1}</span>{factor}</div>)}</div></div>
          <div className="panel p-6"><p className="eyebrow">比赛演示控制</p><h2 className="mt-1 text-2xl font-black">推进候检流程</h2><div className="mt-5 grid gap-3 sm:grid-cols-2"><button className="demo-control" onClick={() => navigate('/emergency')}><AlertTriangle />模拟急诊优先</button><button className="demo-control" onClick={advanceQueue}><UsersRound />前方减少 1 人</button><button className="demo-control" onClick={() => navigate('/calling')}><BellRing />正式叫号</button><button className="demo-control" onClick={() => navigate('/ai')}><Smartphone />打开 AI 助手</button></div><p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-500">这些按钮仅用于大赛演示，不代表患者可调整真实队列。</p></div>
        </section>
      </main>
      {leaveDialog && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal-card text-left"><div className="flex items-start justify-between"><div><p className="eyebrow">暂离确认</p><h2 className="mt-2 text-2xl font-black">您确定要暂离吗？</h2></div><button className="header-icon-button" onClick={() => setLeaveDialog(false)}><X /></button></div><p className="mt-5 text-lg font-semibold leading-8 text-slate-600">您当前预计还有约 {waitingEstimate.min}–{waitingEstimate.max} 分钟。如选择暂离，请留意手机端提醒，并建议在预计检查前 10 分钟返回候检区域。</p><div className="mt-7 grid grid-cols-2 gap-3"><button className="secondary-action" onClick={() => setLeaveDialog(false)}>取消</button><button className="primary-action" onClick={() => { leaveTemporarily(); setLeaveDialog(false) }}>确认暂离</button></div></div></div>}
    </div>
  )
}
