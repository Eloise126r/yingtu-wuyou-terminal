import { KeyRound, X } from 'lucide-react'
import { useState } from 'react'

export function StaffPinDialog({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: (pin: string) => boolean }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  if (!open) return null
  const submit = () => { if (onSuccess(pin)) { setPin(''); setError(''); onClose() } else setError('PIN 不正确，请重新输入') }
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="staff-pin-title"><div className="modal-card text-left"><div className="flex items-start justify-between"><div><p className="eyebrow">工作人员入口</p><h2 id="staff-pin-title" className="mt-2 text-2xl font-black">工作人员身份验证</h2></div><button className="header-icon-button" onClick={onClose} aria-label="关闭"><X /></button></div><label className="mt-6 block text-sm font-black text-slate-600" htmlFor="staff-pin">请输入工作人员 PIN</label><div className="mt-2 flex items-center gap-3 rounded-2xl border border-blue-100 bg-slate-50 px-4"><KeyRound className="text-blue-600" /><input id="staff-pin" autoFocus inputMode="numeric" maxLength={4} type="password" value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, '')); setError('') }} onKeyDown={(event) => { if (event.key === 'Enter') submit() }} className="min-h-16 flex-1 bg-transparent text-2xl font-black tracking-[0.5em] outline-none" aria-invalid={Boolean(error)} /></div>{error && <p className="mt-3 font-bold text-rose-600">{error}</p>}<p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-800">比赛演示 PIN：1234</p><div className="mt-6 grid grid-cols-2 gap-3"><button className="secondary-action" onClick={onClose}>取消</button><button className="primary-action" disabled={pin.length !== 4} onClick={submit}>验证并进入</button></div></div></div>
}
