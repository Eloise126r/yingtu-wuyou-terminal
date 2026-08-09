import { Check, Circle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { PreparationStepKey } from '../types'

const labels: Record<PreparationStepKey, string> = {
  preparation: '检查前准备',
  safety: '安全确认',
  position: '体位学习',
  breathing: '呼吸练习',
}

const field: Record<PreparationStepKey, 'preparationCompleted' | 'safetyCheckCompleted' | 'positionTrainingCompleted' | 'breathingTrainingCompleted'> = {
  preparation: 'preparationCompleted',
  safety: 'safetyCheckCompleted',
  position: 'positionTrainingCompleted',
  breathing: 'breathingTrainingCompleted',
}

export function PreparationProgress({ compact = false }: { compact?: boolean }) {
  const { patient } = useApp()
  const done = patient.requiredSteps.filter((step) => patient[field[step]]).length
  const percent = Math.round((done / patient.requiredSteps.length) * 100)

  return (
    <div className={compact ? '' : 'rounded-2xl bg-slate-50 p-4'}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-black text-slate-900">检查准备</p>
        <p className="text-sm font-black text-blue-700">完成 {done} / {patient.requiredSteps.length}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} /></div>
      <div className={`mt-3 grid gap-2 ${compact ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
        {patient.requiredSteps.map((step) => {
          const completed = patient[field[step]]
          return (
            <div key={step} className="flex items-center gap-2 text-sm font-bold text-slate-600">
              {completed ? <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={15} /></span> : <Circle className="text-slate-300" size={22} />}
              {labels[step]}
              {patient.syncedFromMiniProgram.includes(step) && <span className="text-xs text-emerald-700">手机端</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
