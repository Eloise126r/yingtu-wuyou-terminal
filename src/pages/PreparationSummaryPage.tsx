import { CheckCircle2, Circle, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { MiniProgramSyncBadge } from '../components/MiniProgramSyncBadge'
import { PrivacyTimeout } from '../components/PrivacyTimeout'
import { useApp } from '../context/AppContext'
import type { PreparationStepKey } from '../types'

const meta: Record<PreparationStepKey, { label: string; field: 'preparationCompleted'|'safetyCheckCompleted'|'positionTrainingCompleted'|'breathingTrainingCompleted'; path: string }> = {
  preparation: { label: '检查前准备已阅读', field: 'preparationCompleted', path: '/preparation' }, safety: { label: '安全事项已确认', field: 'safetyCheckCompleted', path: '/safety' }, position: { label: '体位学习已完成', field: 'positionTrainingCompleted', path: '/training' }, breathing: { label: '呼吸练习已完成', field: 'breathingTrainingCompleted', path: '/training' },
}

export function PreparationSummaryPage() {
  const { patient } = useApp(); const navigate = useNavigate()
  return <div className="terminal-shell"><Header title="我的检查准备" subtitle="终端与影途无忧手机端同步" /><PrivacyTimeout /><main className="grid flex-1 place-items-center p-6"><section className="grid w-full max-w-5xl overflow-hidden rounded-[34px] bg-white shadow-panel lg:grid-cols-[0.8fr_1.2fr]"><div className={`flex min-h-[600px] flex-col justify-between p-9 text-white ${patient.prepared ? 'bg-gradient-to-br from-emerald-600 to-cyan-600' : 'bg-gradient-to-br from-blue-700 to-cyan-500'}`}><div><p className="text-sm font-black tracking-widest text-white/80">{patient.maskedName} · {patient.ticketNo}</p><h1 className="mt-4 text-4xl font-black">{patient.examName}</h1></div><div><span className="grid h-24 w-24 place-items-center rounded-full bg-white/15">{patient.prepared ? <CheckCircle2 size={54} /> : <RotateCcw size={48} />}</span><p className="mt-6 text-3xl font-black">{patient.prepared ? '准备完成' : '准备进行中'}</p><p className="mt-3 font-semibold leading-7 text-white/85">{patient.prepared ? '完成状态已同步到候检页面。' : '继续完成下方未完成项目。'}</p></div></div><div className="flex min-h-[600px] flex-col justify-center p-9 lg:p-12"><p className="eyebrow">PREPARATION STATUS</p><h2 className="mt-2 text-3xl font-black">本次准备状态</h2><div className="mt-6 space-y-3">{patient.requiredSteps.map((step) => { const item=meta[step]; const done=patient[item.field]; return <button key={step} className="flex min-h-16 w-full items-center justify-between rounded-2xl bg-slate-50 px-5 text-left" onClick={() => !done && navigate(item.path)}><span className="flex items-center gap-3 font-black text-slate-800">{done ? <CheckCircle2 className="text-emerald-600" /> : <Circle className="text-slate-300" />}{item.label}</span>{patient.syncedFromMiniProgram.includes(step) ? <MiniProgramSyncBadge completed /> : !done ? <span className="text-sm font-black text-blue-700">继续完成</span> : null}</button> })}</div>{patient.staffReviewRequired && <p className="mt-5 rounded-2xl bg-amber-50 p-4 font-bold leading-7 text-amber-900">已识别需要工作人员确认的安全信息；“准备完成”不等于系统批准检查。</p>}<button className="primary-action mt-7 w-full" onClick={() => navigate('/patient')}>返回候检</button></div></section></main></div>
}
