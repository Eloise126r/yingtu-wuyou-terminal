import { Bot, ClipboardCheck, QrCode, ScanSearch } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { BottomTicker } from '../components/BottomTicker'
import { CurrentCall } from '../components/CurrentCall'
import { Header } from '../components/Header'
import { QueueList } from '../components/QueueList'
import { useApp } from '../context/AppContext'

export function HomePage() {
  const navigate = useNavigate()
  const { patient } = useApp()

  return (
    <div className="terminal-shell">
      <Header />
      <main className="terminal-main">
        <CurrentCall />
        <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[1.12fr_0.88fr]">
          <QueueList />
          <section className="panel grid content-start grid-cols-1 gap-4 p-6 sm:grid-cols-2" aria-label="患者服务入口">
            <div className="col-span-full flex items-center justify-between">
              <div>
                <p className="eyebrow">患者服务 / PATIENT SERVICE</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">请选择需要的服务</h2>
              </div>
              {patient.checkedIn && (
                <button className="touch-link" onClick={() => navigate('/patient')}>
                  继续我的候检
                </button>
              )}
            </div>
            <BigButton
              title={patient.checkedIn ? '查看候检进度' : '扫码签到'}
              description={patient.checkedIn ? `${patient.ticketNo} 已签到，查看排队状态` : '扫描检查单或小程序签到码'}
              icon={QrCode}
              tone="primary"
              onClick={() => navigate(patient.checkedIn ? '/patient' : '/scan')}
            />
            <BigButton
              title="检查前准备"
              description="按本次 DR、CT 或 MRI 显示专业准备"
              icon={ClipboardCheck}
              tone="sky"
              onClick={() => navigate('/preparation')}
            />
            <BigButton
              title="体位学习"
              description="11 类体位教学与屏气跟练"
              icon={ScanSearch}
              tone="teal"
              onClick={() => navigate('/training')}
            />
            <BigButton
              title="AI 问答"
              description="上下文问答、风险分流与语音模拟"
              icon={Bot}
              tone="violet"
              onClick={() => navigate('/ai')}
            />
          </section>
        </div>
        <BottomTicker />
      </main>
    </div>
  )
}
