import { ArrowLeft, Blocks, CheckCircle2, Construction, Database, Route, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'

interface ComingSoonPageProps {
  title: string
  phase: 2 | 3
  description: string
  planned: string[]
}

export function ComingSoonPage({ title, phase, description, planned }: ComingSoonPageProps) {
  const navigate = useNavigate()
  return (
    <div className="terminal-shell">
      <Header title={title} subtitle={`产品路线图 · 第 ${phase} 阶段`} />
      <main className="grid flex-1 place-items-center p-6 lg:p-10">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-[34px] bg-white shadow-panel lg:grid-cols-[0.72fr_1.28fr]">
          <div className="relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800 p-9 text-white">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10" />
            <span className="relative grid h-20 w-20 place-items-center rounded-3xl bg-white/10"><Construction size={42} /></span>
            <div className="relative">
              <p className="text-sm font-black tracking-[0.2em] text-cyan-200">PHASE {phase}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight">{title}</h1>
              <p className="mt-4 text-lg font-semibold leading-8 text-blue-100">{description}</p>
            </div>
            <div className="relative flex items-center gap-2 text-sm font-bold text-blue-200"><Route size={18} />路由与入口已在第一阶段保留</div>
          </div>

          <div className="flex min-h-[520px] flex-col justify-center p-9 lg:p-12">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-800">尚未开放</span>
              <span className="font-bold text-slate-400">当前为第一阶段 Demo</span>
            </div>
            <h2 className="mt-6 text-3xl font-black text-slate-900">本页面不会用虚假数据冒充医学能力</h2>
            <p className="mt-3 text-lg font-semibold leading-8 text-slate-500">页面路径、入口和组件边界已经搭建，后续将按 PRD 接入可配置规则或业务模拟。</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {planned.map((item) => (
                <div key={item} className="flex min-h-16 items-center gap-3 rounded-2xl bg-slate-50 px-4 font-bold text-slate-700">
                  <CheckCircle2 className="shrink-0 text-blue-600" size={21} />{item}
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
              <span className="roadmap-chip"><Database />可配置数据</span>
              <span className="roadmap-chip"><ShieldCheck />安全规则优先</span>
              <span className="roadmap-chip"><Blocks />组件化接入</span>
            </div>
            <button className="primary-action mt-8 self-start px-8" onClick={() => navigate(-1)}><ArrowLeft />返回上一页</button>
          </div>
        </section>
      </main>
    </div>
  )
}
