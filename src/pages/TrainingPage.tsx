import { CheckCircle2, ListFilter, PlayCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BreathingTrainer } from '../components/BreathingTrainer'
import { Header } from '../components/Header'
import { MiniProgramSyncBadge } from '../components/MiniProgramSyncBadge'
import { MissingAssetPlaceholder } from '../components/MissingAssetPlaceholder'
import { PrivacyTimeout } from '../components/PrivacyTimeout'
import { useApp } from '../context/AppContext'
import { examTrainingAssets } from '../data/examTrainingAssets'
import { getTraining, trainingData } from '../data/trainingData'
import type { Modality } from '../types'

export function TrainingPage() {
  const { patient, markStep } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Modality | '全部'>(patient.modality)
  const [activeId, setActiveId] = useState(patient.trainingId)
  useEffect(() => { setActiveId(patient.trainingId); setFilter(patient.modality) }, [patient.id, patient.trainingId, patient.modality])
  const active = getTraining(activeId)
  const items = useMemo(() => filter === '全部' ? trainingData : trainingData.filter((item) => item.modality === filter), [filter])
  const asset = examTrainingAssets[active.assetKey]

  return (
    <div className="terminal-shell">
      <Header title="检查体位学习" subtitle={`${patient.examName} · 大屏跟练`} />
      <PrivacyTimeout />
      <main className="terminal-main overflow-y-auto">
        <div className="grid gap-5 xl:grid-cols-[330px_1fr]">
          <aside className="panel overflow-hidden">
            <div className="border-b border-slate-100 p-5"><div className="flex items-center gap-2"><ListFilter className="text-blue-700" /><h2 className="text-xl font-black">选择教学内容</h2></div><div className="mt-4 grid grid-cols-4 gap-2">{(['全部','DR','CT','MRI'] as const).map((item) => <button key={item} className={`min-h-11 rounded-xl text-sm font-black ${filter === item ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'}`} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
            <div className="max-h-[700px] space-y-2 overflow-y-auto p-3">{items.map((item) => <button key={item.id} className={`flex min-h-16 w-full items-center justify-between rounded-2xl px-4 text-left font-black transition ${active.id === item.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`} onClick={() => setActiveId(item.id)}><span>{item.shortTitle}</span>{item.id === patient.trainingId && <span className={`text-xs ${active.id === item.id ? 'text-blue-100' : 'text-blue-700'}`}>本次检查</span>}</button>)}</div>
          </aside>
          <section className="space-y-5">
            <div className="panel p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">{active.modality} 体位教学</p><h1 className="mt-2 text-3xl font-black">{active.title}</h1></div>{active.id === patient.trainingId && <MiniProgramSyncBadge completed={patient.syncedFromMiniProgram.includes('position')} />}</div>
              <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                {asset ? <img src={asset} alt={active.title} className="h-full w-full rounded-[26px] object-cover" /> : <MissingAssetPlaceholder title={active.shortTitle} assetKey={active.assetKey} />}
                <div className="grid gap-3 sm:grid-cols-2">{[
                  ['检查怎么躺/站', active.posture], ['手臂怎么放', active.arms], ['头怎么放', active.head], ['什么时候不能动', active.stillness], ['是否需要屏气', active.breathing], ['需要怎么配合', active.cooperation],
                ].map(([title,text]) => <div key={title} className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-black text-blue-700">{title}</p><p className="mt-2 font-semibold leading-7 text-slate-700">{text}</p></div>)}</div>
              </div>
              <div className="mt-6 rounded-2xl bg-blue-50 p-5"><h2 className="flex items-center gap-2 text-xl font-black text-blue-950"><PlayCircle />跟着步骤练一次</h2><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{active.steps.map((step,index) => <div key={step} className="flex items-center gap-3 rounded-xl bg-white p-3 font-bold text-slate-700"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-700">{index+1}</span>{step}</div>)}</div></div>
              <p className="mt-4 text-sm font-semibold text-slate-500">体位语料参考：{active.source}。示意图用于候检教学，实际摆位以现场技师指令为准。</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_auto]">{active.supportsBreathingTrainer ? <BreathingTrainer onComplete={() => active.id === patient.trainingId && markStep('breathing')} /> : <div className="rounded-[26px] bg-slate-900 p-6 text-white"><p className="eyebrow !text-cyan-300">保持不动练习</p><h3 className="mt-2 text-2xl font-black">放松身体，保持检查部位稳定</h3><p className="mt-3 font-semibold leading-7 text-slate-300">实际检查中如有不适，请使用工作人员说明的联系方法，不要勉强坚持。</p></div>}
              <div className="panel flex min-w-72 flex-col justify-center p-5"><button className="primary-action w-full" onClick={() => { if (active.id === patient.trainingId) markStep('position'); window.setTimeout(() => navigate('/preparation-summary'), 0) }}><CheckCircle2 />我已完成本次学习</button><button className="secondary-action mt-3" onClick={() => navigate('/patient')}>返回候检</button></div></div>
          </section>
        </div>
      </main>
    </div>
  )
}
