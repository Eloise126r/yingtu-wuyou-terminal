import { AlertCircle, BellRing, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, LogOut, MapPin, QrCode, ScanSearch, ShieldCheck, Smartphone, Sparkles, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { MiniProgramSyncBadge } from '../components/MiniProgramSyncBadge'
import { PreparationProgress } from '../components/PreparationProgress'
import { PrivacyTimeout } from '../components/PrivacyTimeout'
import { useApp } from '../context/AppContext'
import { queueStatusMeta } from '../data/mockData'
import { getWaitingAdvice } from '../utils/waitingTime'

export function PatientPage() {
  const navigate = useNavigate()
  const { patient, waitingEstimate, simulateMiniProgramSync } = useApp()

  if (!patient.checkedIn) return <div className="terminal-shell"><Header title="我的候检" subtitle="个人候检信息" /><main className="grid flex-1 place-items-center p-8"><section className="panel max-w-2xl p-12 text-center"><span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-amber-100 text-amber-600"><QrCode size={48} /></span><h1 className="mt-6 text-3xl font-black">尚未完成签到</h1><p className="mt-3 text-lg font-semibold leading-8 text-slate-500">请先扫描检查单或影途无忧小程序二维码，签到成功后系统会显示候检进度。</p><button className="primary-action mt-8 w-full" onClick={() => navigate('/scan')}><QrCode />前往扫码签到</button></section></main></div>

  const advice = getWaitingAdvice(patient, waitingEstimate)
  const status = queueStatusMeta[patient.queueStatus]
  const flow = [
    { label: '已签到', done: true },
    { label: '候检中', done: patient.checkedIn },
    { label: '即将检查', done: patient.aheadCount <= 1 || patient.called },
    { label: '准备完成', done: patient.prepared },
    { label: '等待叫号', done: patient.called },
  ]

  return (
    <div className="terminal-shell">
      <Header title="我的候检" subtitle={`${patient.ticketNo} · ${patient.maskedName} · 信息已脱敏`} />
      <PrivacyTimeout />
      <main className="terminal-main patient-layout overflow-y-auto">
        {patient.urgentAdjusted && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 font-bold text-amber-950"><span className="flex items-center gap-2"><AlertCircle className="text-amber-600" />因急诊患者需优先完成影像检查，当前候检顺序已调整。</span><span>原预计 {patient.previousWaitRange} → 当前 {waitingEstimate.min}–{waitingEstimate.max}分钟</span></div>}
        <section className="grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-7 text-white shadow-lift"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" /><div className="relative flex h-full flex-col justify-between gap-7"><div className="flex items-start justify-between gap-5"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-black">{status.label}</span>{patient.prepared && <span className="rounded-full bg-emerald-300 px-3 py-1.5 text-sm font-black text-emerald-950">准备完成</span>}</div><h1 className="mt-3 text-[clamp(2rem,3vw,3.4rem)] font-black">{patient.maskedName}</h1><p className="mt-2 text-lg font-semibold text-blue-50">候检号 {patient.ticketNo}</p></div><span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15"><CheckCircle2 size={34} /></span></div><div><p className="text-sm font-black text-blue-100">检查项目</p><p className="mt-1 text-2xl font-black">{patient.examName}</p><div className="mt-4 flex flex-wrap gap-3"><span className="info-chip"><MapPin size={18} />{patient.room}</span><span className="info-chip"><Clock3 size={18} />签到时间 {formatCheckIn(patient.checkedInAt)}</span><MiniProgramSyncBadge /></div></div></div></div>
          <div className="panel flex flex-col justify-between p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">动态预测</p><h2 className="mt-1 text-2xl font-black">预计等待时间</h2></div><span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-600"><Sparkles size={28} /></span></div><div className="my-5 flex items-baseline gap-2 text-blue-700"><span className="text-[clamp(3.2rem,5vw,5.8rem)] font-black tabular-nums leading-none">{waitingEstimate.min}–{waitingEstimate.max}</span><span className="text-2xl font-black">分钟</span></div><div className="grid grid-cols-2 gap-3"><div className="metric-card"><UsersRound />前方患者<strong>{patient.aheadCount} 人</strong></div><div className="metric-card"><Clock3 />当前状态<strong>{status.label}</strong></div></div><p className="mt-4 flex items-start gap-2 text-sm font-semibold leading-6 text-slate-500"><AlertCircle className="mt-0.5 shrink-0 text-amber-500" size={18} />时间为动态区间，急诊优先或检查用时变化时会更新。</p></div>
        </section>

        <section className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="panel p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">当前检查进度</p><h2 className="mt-1 text-2xl font-black">您现在需要知道</h2></div><BellRing className="text-blue-600" /></div><div className="mt-5 grid grid-cols-5 gap-2">{flow.map((item,index) => <div key={item.label} className="relative text-center"><div className={`mx-auto grid h-10 w-10 place-items-center rounded-full font-black ${item.done ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{item.done ? <CheckCircle2 size={20} /> : index+1}</div><p className={`mt-2 text-xs font-black ${item.done ? 'text-blue-800' : 'text-slate-400'}`}>{item.label}</p></div>)}</div><div className={`mt-5 rounded-2xl p-5 ${patient.aheadCount === 1 ? 'bg-amber-50 text-amber-950' : 'bg-blue-50 text-blue-950'}`}><p className="flex items-center gap-2 text-lg font-black"><Sparkles size={21} />智能建议</p><p className="mt-2 font-semibold leading-7">{advice}</p>{waitingEstimate.max > 20 && <div className="mt-4 flex gap-3"><button className="secondary-action bg-white" onClick={() => navigate('/preparation')}>检查前准备</button><button className="secondary-action bg-white" onClick={() => navigate('/training')}>体位学习</button></div>}</div><button className="mt-4 flex min-h-14 w-full items-center justify-between rounded-2xl bg-slate-50 px-5 font-black text-slate-700" onClick={() => navigate('/waiting')}><span className="flex items-center gap-2"><LogOut />暂离、急诊调整与叫号演示</span><ChevronRight /></button></div>
          <div className="panel p-6"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow">我的检查准备</p><h2 className="mt-1 text-2xl font-black">按本次检查动态生成</h2></div><button className="touch-link" onClick={simulateMiniProgramSync}><Smartphone size={18} className="inline" /> 模拟手机端同步</button></div><div className="mt-5"><PreparationProgress /></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><PatientAction icon={ClipboardCheck} title="检查前准备" subtitle="分类医学提示" onClick={() => navigate('/preparation')} /><PatientAction icon={ShieldCheck} title="安全确认" subtitle="规则转人工" onClick={() => navigate('/safety')} /><PatientAction icon={ScanSearch} title="体位学习" subtitle="图示与跟练" onClick={() => navigate('/training')} /></div><button className="mt-4 flex min-h-14 w-full items-center justify-between rounded-2xl bg-blue-50 px-5 text-left font-black text-blue-800" onClick={() => navigate('/preparation-summary')}><span>查看“我的检查准备”总结</span><ChevronRight /></button></div>
        </section>
      </main>
    </div>
  )
}

function formatCheckIn(value?: string) { if (!value) return '--:--'; return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value)) }
function PatientAction({ icon: Icon, title, subtitle, onClick }: { icon: typeof ClipboardCheck; title: string; subtitle: string; onClick: () => void }) { return <button className="group min-h-[128px] rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:-translate-y-1 hover:bg-white hover:shadow-lg" onClick={onClick}><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-700 shadow-sm"><Icon size={23} /></span><p className="mt-3 text-lg font-black">{title}</p><p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p></button> }
