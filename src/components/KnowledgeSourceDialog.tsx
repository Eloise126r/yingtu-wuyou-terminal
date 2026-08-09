import { Info, X } from 'lucide-react'
import { useState } from 'react'

export function KnowledgeSourceDialog({ sources }: { sources: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-sm font-black text-slate-500 hover:bg-slate-100" onClick={() => setOpen(true)}><Info size={18} />内容依据</button>
      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="source-title">
          <div className="modal-card max-w-2xl text-left">
            <div className="flex items-start justify-between gap-4">
              <div><p className="eyebrow">医学知识说明</p><h2 id="source-title" className="mt-2 text-2xl font-black">内容依据</h2></div>
              <button className="header-icon-button" onClick={() => setOpen(false)} aria-label="关闭"><X /></button>
            </div>
            <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">本页面医学内容依据专业指南、专家共识及院内流程整理，并需经影像科专业人员审核后正式使用。</p>
            <div className="mt-5 space-y-2">{[...new Set(sources)].map((source) => <div key={source} className="rounded-xl bg-slate-50 px-4 py-3 font-bold text-slate-700">{source}</div>)}</div>
            <button className="primary-action mt-6 w-full" onClick={() => setOpen(false)}>我知道了</button>
          </div>
        </div>
      )}
    </>
  )
}
