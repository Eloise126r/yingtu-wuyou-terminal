import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardCheck, Info, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { KnowledgeSourceDialog } from '../components/KnowledgeSourceDialog'
import { MiniProgramSyncBadge } from '../components/MiniProgramSyncBadge'
import { PreparationProgress } from '../components/PreparationProgress'
import { PrivacyTimeout } from '../components/PrivacyTimeout'
import { useApp } from '../context/AppContext'
import { getExamKnowledge } from '../data/examKnowledge'

type Tab = 'before' | 'metal' | 'safety' | 'during' | 'after'

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'before', label: '检查前准备' }, { id: 'metal', label: '去除金属' }, { id: 'safety', label: '安全确认' }, { id: 'during', label: '检查过程' }, { id: 'after', label: '检查后' },
]

export function PreparationPage() {
  const [tab, setTab] = useState<Tab>('before')
  const { patient, markStep } = useApp()
  const navigate = useNavigate()
  const knowledge = useMemo(() => getExamKnowledge(patient.knowledgeId), [patient.knowledgeId])
  const sections = tab === 'before' ? [...knowledge.beforeExam, ...knowledge.dayOfExam] : tab === 'during' ? knowledge.duringExam : knowledge.afterExam

  return (
    <div className="terminal-shell">
      <Header title="检查前准备" subtitle={`${patient.examName} · 规则知识库`} />
      <PrivacyTimeout />
      <main className="terminal-main overflow-y-auto">
        <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-4">
            <section className="panel p-6">
              <p className="eyebrow">您的检查</p>
              <h1 className="mt-2 text-2xl font-black text-slate-900">{knowledge.displayName}</h1>
              <p className="mt-3 font-semibold leading-7 text-slate-500">{knowledge.summary}</p>
              <div className="mt-4"><MiniProgramSyncBadge completed={patient.syncedFromMiniProgram.includes('preparation')} /></div>
            </section>
            <section className="panel p-5"><PreparationProgress /></section>
            {knowledge.localPolicyOverride && <section className="rounded-[24px] border border-amber-200 bg-amber-50 p-5"><p className="flex items-center gap-2 font-black text-amber-900"><Info size={20} />本院本次规则</p><p className="mt-2 font-semibold leading-7 text-amber-900">{knowledge.localPolicyOverride}</p></section>}
          </aside>

          <section className="panel min-h-[720px] overflow-hidden">
            <div className="flex flex-wrap gap-2 border-b border-slate-100 p-5">
              {tabs.map((item) => <button key={item.id} className={`min-h-12 rounded-xl px-5 font-black transition ${tab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`} onClick={() => setTab(item.id)}>{item.label}</button>)}
            </div>
            <div className="p-6 lg:p-8">
              {tab === 'metal' ? (
                <div className="mx-auto max-w-5xl">
                  <div>
                    <p className="eyebrow">为什么要处理这些物品？</p><h2 className="mt-2 text-3xl font-black">按检查部位去除金属</h2>
                    <p className="mt-3 rounded-2xl bg-blue-50 p-4 font-semibold leading-7 text-blue-900">{knowledge.metalExplanation}</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">{knowledge.metalRemoval.map((group) => <div key={group.area} className="rounded-2xl bg-slate-50 p-4"><p className="font-black text-slate-900">{group.area}</p><div className="mt-3 flex flex-wrap gap-2">{group.items.map((item) => <span key={item} className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-slate-600 shadow-sm">{item}</span>)}</div></div>)}</div>
                  </div>
                </div>
              ) : tab === 'safety' ? (
                <div className="grid min-h-[520px] place-items-center text-center"><div className="max-w-2xl"><span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-amber-100 text-amber-700"><ShieldCheck size={48} /></span><h2 className="mt-6 text-3xl font-black">本次需要完成 {knowledge.safetyScreening.length} 项安全确认</h2><p className="mt-4 text-lg font-semibold leading-8 text-slate-500">系统只识别需要工作人员进一步确认的情况，不会自动判断“能做”或“不能做”。</p><button className="primary-action mx-auto mt-7" onClick={() => navigate('/safety')}><ShieldCheck />进入安全确认</button></div></div>
              ) : (
                <div>
                  <div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700">{tab === 'before' ? <ClipboardCheck /> : tab === 'during' ? <ScanSearch /> : <BookOpenCheck />}</span><div><p className="eyebrow">{knowledge.displayName}</p><h2 className="mt-1 text-3xl font-black">{tabs.find((item) => item.id === tab)?.label}</h2></div></div>
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">{sections.map((item) => <article key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-5"><h3 className="text-xl font-black text-slate-900">{item.title}</h3><ul className="mt-4 space-y-3">{item.items.map((line) => <li key={line} className="flex gap-3 font-semibold leading-7 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-blue-600" size={20} />{line}</li>)}</ul>{item.note && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">{item.note}</p>}</article>)}</div>
                  {tab === 'before' && <div className="mt-5 rounded-2xl bg-cyan-50 p-5"><p className="flex items-center gap-2 font-black text-cyan-900"><Sparkles />体位与呼吸配合</p><div className="mt-3 grid gap-3 md:grid-cols-2"><div><p className="font-black">体位重点</p>{knowledge.positioning.map((item) => <p key={item} className="mt-1 font-semibold text-slate-600">• {item}</p>)}</div><div><p className="font-black">呼吸重点</p>{knowledge.breathing.map((item) => <p key={item} className="mt-1 font-semibold text-slate-600">• {item}</p>)}</div></div></div>}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <KnowledgeSourceDialog sources={knowledge.source} />
              <div className="flex gap-3"><button className="secondary-action" onClick={() => navigate('/training')}>体位学习</button><button className="primary-action min-h-12 px-6" onClick={() => { markStep('preparation'); window.setTimeout(() => window.location.assign(`${import.meta.env.BASE_URL}preparation-summary`), 0) }}>我已阅读本次准备 <ArrowRight size={20} /></button></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
