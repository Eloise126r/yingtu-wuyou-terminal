import { ShieldAlert } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function PrivacyTimeout() {
  const navigate = useNavigate()
  const [warning, setWarning] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const idleTimer = useRef<number>()
  const redirectTimer = useRef<number>()
  const tickTimer = useRef<number>()

  const clearAll = () => {
    window.clearTimeout(idleTimer.current)
    window.clearTimeout(redirectTimer.current)
    window.clearInterval(tickTimer.current)
  }

  const reset = useCallback(() => {
    clearAll()
    setWarning(false)
    setCountdown(5)
    idleTimer.current = window.setTimeout(() => {
      setWarning(true)
      tickTimer.current = window.setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000)
      redirectTimer.current = window.setTimeout(() => navigate('/'), 5000)
    }, 12000)
  }, [navigate])

  useEffect(() => {
    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    events.forEach((event) => window.addEventListener(event, reset))
    reset()
    return () => {
      clearAll()
      events.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [reset])

  if (!warning) return null
  return (
    <div className="modal-backdrop" role="alertdialog" aria-modal="true">
      <div className="modal-card text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-100 text-amber-700"><ShieldAlert size={40} /></span>
        <h2 className="mt-5 text-2xl font-black">即将返回公共候检页面</h2>
        <p className="mt-3 text-lg font-semibold text-slate-600">为保护您的隐私，{countdown} 秒后将自动退出个人页面。</p>
        <button className="primary-action mt-7 w-full" onClick={reset}>继续使用</button>
      </div>
    </div>
  )
}
