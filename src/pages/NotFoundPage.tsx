import { Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="terminal-shell">
      <Header title="页面未找到" />
      <main className="grid flex-1 place-items-center p-8 text-center">
        <div>
          <p className="text-8xl font-black text-blue-100">404</p>
          <h1 className="mt-4 text-3xl font-black text-slate-900">该服务路径不存在</h1>
          <button className="primary-action mx-auto mt-8" onClick={() => navigate('/')}><Home />返回公共候检屏</button>
        </div>
      </main>
    </div>
  )
}
