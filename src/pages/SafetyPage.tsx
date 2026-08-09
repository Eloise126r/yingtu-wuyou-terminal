import { AlertTriangle, CheckCircle2, HelpCircle, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { PrivacyTimeout } from '../components/PrivacyTimeout'
import { useApp } from '../context/AppContext'
import { getExamKnowledge } from '../data/examKnowledge'
import type { SafetyAnswer } from '../types'

const choices: Array<{ value: SafetyAnswer; label: string }> = [{ value: 'NO', label: '没有' }, { value: 'YES', label: '有' }, { value: 'UNSURE', label: '不确定' }]

export function SafetyPage() {
  const { patient, answerSafety, markStep } = useApp()
  const knowledge = useMemo(() => getExamKnowledge(patient.knowledgeId), [patient.knowledgeId])
  const navigate = useNavigate()
  const answered = knowledge.safetyScreening.filter((question) => patient.safetyAnswers[question.id]).length

  return (
    <div className="terminal-shell">
      <Header title={patient.modality === 'MRI' ? '磁共振检查安全准备' : `${patient.examName}安全确认`} subtitle="规则引擎识别风险 · 医务人员最终确认" />
      <PrivacyTimeout />
      <main className="terminal-main overflow-y-auto">
        <section className="mx-auto w-full max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6"><div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-amber-700"><ShieldCheck size={30} /></span><div><h1 className="text-2xl font-black text-amber-950">请认真完成安全确认</h1><p className="mt-2 font-semibold leading-7 text-amber-900">选择“有”或“不确定”只表示需要工作人员进一步确认，并不代表您一定不能检查。</p></div></div></div>
            <div className="panel min-w-56 p-5 text-center"><p className="text-sm font-black text-slate-500">已完成</p><p className="mt-1 text-3xl font-black text-blue-700">{answered} / {knowledge.safetyScreening.length}</p></div>
          </div>
          {patient.staffReviewRequired && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-100 p-5 font-bold leading-7 text-amber-950"><AlertTriangle className="mt-0.5 shrink-0" />需要工作人员进一步确认安全条件。请准备植入物、既往反应或相关医疗资料（如有）。</div>}
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {knowledge.safetyScreening.map((question, index) => {
              const value = patient.safetyAnswers[question.id]
              return <article key={question.id} className="panel p-5"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 font-black text-blue-700">{index + 1}</span><h2 className="text-lg font-black leading-7 text-slate-900">{question.question}</h2></div><div className="mt-4 grid grid-cols-3 gap-2">{choices.map((choice) => <button key={choice.value} className={`min-h-12 rounded-xl border font-black transition ${value === choice.value ? choice.value === 'NO' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 bg-white text-slate-600'}`} onClick={() => answerSafety(question.id, choice.value)}>{choice.label}</button>)}</div>{value && value !== 'NO' && <p className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900"><HelpCircle className="mt-0.5 shrink-0" size={18} />{question.staffMessage}</p>}</article>
            })}
          </div>
          <div className="sticky bottom-3 mt-5 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-panel backdrop-blur"><p className="font-bold text-slate-500">请完成全部问题后提交；系统不会给出检查许可判断。</p><button className="primary-action px-8" disabled={answered < knowledge.safetyScreening.length} onClick={() => { markStep('safety'); window.setTimeout(() => window.location.assign(`${import.meta.env.BASE_URL}preparation-summary`), 0) }}><CheckCircle2 />提交安全确认</button></div>
        </section>
      </main>
    </div>
  )
}
