import { Check, ChevronDown, UsersRound, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export function DemoCaseSwitcher() {
  const [open, setOpen] = useState(false)
  const { patient, demoPatients, selectDemoPatient } = useApp()
  return (
    <>
      <button className="demo-case-button" onClick={() => setOpen(true)} aria-label="切换演示病例">
        <UsersRound size={20} />
        <span className="hidden xl:inline">演示病例</span>
        <ChevronDown size={17} />
      </button>
      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="case-title">
          <div className="modal-card max-w-3xl text-left">
            <div className="flex items-start justify-between gap-4">
              <div><p className="eyebrow">比赛演示工具</p><h2 id="case-title" className="mt-2 text-2xl font-black">切换 Demo 病例</h2></div>
              <button className="header-icon-button" onClick={() => setOpen(false)} aria-label="关闭"><X /></button>
            </div>
            <p className="mt-3 font-semibold text-slate-500">仅用于大赛演示；切换后页面使用对应检查知识、问卷和训练内容。</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {demoPatients.map((item, index) => (
                <button key={item.id} className={`relative min-h-28 rounded-2xl border p-4 text-left transition ${patient.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`} onClick={() => { selectDemoPatient(item.id); setOpen(false) }}>
                  {patient.id === item.id && <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-white"><Check size={16} /></span>}
                  <p className="text-xs font-black tracking-wider text-blue-700">CASE {index + 1}</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{item.maskedName} · {item.examName}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{item.staffReviewRequired ? '预置安全转人工情境' : item.syncedFromMiniProgram.length ? '预置手机端完成状态' : '标准检查准备流程'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
