import { CheckCircle2, CircleHelp, QrCode, ScanLine, Smartphone, UserRoundCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useApp } from '../context/AppContext'

type ScanState = 'ready' | 'scanning' | 'success'

export function ScanPage() {
  const [state, setState] = useState<ScanState>('ready')
  const [showHelp, setShowHelp] = useState(false)
  const navigate = useNavigate()
  const { patient, checkIn } = useApp()
  const scanTimer = useRef<number | undefined>(undefined)
  const navigateTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (patient.checkedIn) setState('success')
  }, [patient.checkedIn])

  useEffect(() => () => {
    window.clearTimeout(scanTimer.current)
    window.clearTimeout(navigateTimer.current)
  }, [])

  const startScan = () => {
    setState('scanning')
    scanTimer.current = window.setTimeout(() => {
      checkIn()
      setState('success')
      navigateTimer.current = window.setTimeout(() => navigate('/patient'), 1400)
    }, 2300)
  }

  return (
    <div className="terminal-shell">
      <Header title="扫码签到" subtitle="扫描检查单或影途无忧小程序二维码" />
      <main className="grid flex-1 place-items-center px-5 py-7 lg:px-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[34px] bg-white shadow-panel lg:grid-cols-[0.92fr_1.08fr]">
          <section className="relative flex min-h-[620px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-cyan-100/10" />

            {state === 'success' ? (
              <div className="relative text-center" role="status" aria-live="polite">
                <div className="mx-auto grid h-36 w-36 place-items-center rounded-full bg-white text-emerald-500 shadow-2xl shadow-blue-950/20">
                  <CheckCircle2 size={82} strokeWidth={2.4} />
                </div>
                <h1 className="mt-8 text-4xl font-black">签到成功</h1>
                <p className="mt-3 text-xl font-semibold text-blue-50">正在进入您的候检页面…</p>
              </div>
            ) : (
              <>
                <div className="relative h-[286px] w-[286px] rounded-[32px] bg-white p-6 shadow-2xl shadow-blue-950/25">
                  <div className="grid h-full w-full place-items-center rounded-2xl border-4 border-dashed border-blue-200 bg-slate-50 text-blue-700">
                    <QrCode size={148} strokeWidth={1.5} />
                  </div>
                  <span className="scan-corner left-2 top-2 border-l-4 border-t-4" />
                  <span className="scan-corner right-2 top-2 border-r-4 border-t-4" />
                  <span className="scan-corner bottom-2 left-2 border-b-4 border-l-4" />
                  <span className="scan-corner bottom-2 right-2 border-b-4 border-r-4" />
                  {state === 'scanning' && <span className="absolute left-7 right-7 top-7 h-1 animate-scan rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.95)]" />}
                </div>
                <p className="relative mt-7 text-center text-lg font-bold text-blue-50">
                  {state === 'scanning' ? '正在安全识别二维码，请保持稳定' : '将二维码放入蓝色扫描框内'}
                </p>
              </>
            )}
          </section>

          <section className="flex min-h-[620px] flex-col justify-center p-9 lg:p-14">
            <p className="eyebrow">自助签到 / SELF CHECK-IN</p>
            <h2 className="mt-3 text-[clamp(2rem,2.6vw,3rem)] font-black leading-tight text-slate-900">
              {state === 'success' ? `您好，${patient.maskedName}` : '请扫描您的签到二维码'}
            </h2>
            <p className="mt-4 max-w-xl text-lg font-semibold leading-8 text-slate-500">
              {state === 'success'
                ? `${patient.examName} · ${patient.room}，签到信息已同步到本终端。`
                : '可使用影途无忧手机端的签到码，或检查单上的二维码。系统仅显示脱敏信息。'}
            </p>

            <div className="mt-8 space-y-3">
              <div className="instruction-row">
                <span>1</span><Smartphone />打开影途无忧手机端“检查签到码”
              </div>
              <div className="instruction-row">
                <span>2</span><ScanLine />将二维码对准屏幕扫描区域
              </div>
              <div className="instruction-row">
                <span>3</span><UserRoundCheck />核对检查信息后进入候检页面
              </div>
            </div>

            {state === 'success' ? (
              <button className="primary-action mt-9" onClick={() => navigate('/patient')}>
                立即查看候检进度
              </button>
            ) : (
              <button className="primary-action mt-9" onClick={startScan} disabled={state === 'scanning'}>
                {state === 'scanning' ? <><span className="loading-dot" />正在识别…</> : <><QrCode />开始模拟扫码</>}
              </button>
            )}

            <button className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-2xl font-black text-blue-700 transition hover:bg-blue-50" onClick={() => setShowHelp(true)}>
              <CircleHelp size={22} />无法扫码？获取工作人员协助
            </button>
          </section>
        </div>
      </main>

      {showHelp && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="help-title">
          <div className="modal-card text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-blue-700"><CircleHelp size={40} /></span>
            <h2 id="help-title" className="mt-5 text-2xl font-black text-slate-900">已发出协助提示</h2>
            <p className="mt-3 text-lg font-semibold leading-8 text-slate-500">请携带检查单在终端旁等候，工作人员将协助您完成签到。</p>
            <button className="primary-action mt-7 w-full" onClick={() => setShowHelp(false)}>我知道了</button>
          </div>
        </div>
      )}
    </div>
  )
}
