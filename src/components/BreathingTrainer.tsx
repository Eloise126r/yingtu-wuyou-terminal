import { CheckCircle2, Play, Wind } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const timeline = ['准备', '3', '2', '1', '吸气……', '屏住呼吸……', '3', '2', '1', '可以呼吸']

export function BreathingTrainer({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(-1)
  const timer = useRef<number>()
  const running = index >= 0 && index < timeline.length
  const done = index >= timeline.length

  useEffect(() => {
    if (!running) return
    timer.current = window.setTimeout(() => setIndex((value) => value + 1), index === 5 ? 1400 : 850)
    return () => window.clearTimeout(timer.current)
  }, [index, running])

  useEffect(() => { if (done) onComplete() }, [done, onComplete])

  const current = index >= 0 && index < timeline.length ? timeline[index] : ''
  return (
    <div className="rounded-[26px] bg-gradient-to-br from-blue-700 to-cyan-500 p-6 text-white">
      <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Wind /></span><div><p className="text-sm font-black text-blue-100">教学 Demo</p><h3 className="text-xl font-black">呼吸与屏气跟练</h3></div></div>
      <div className="my-5 grid min-h-32 place-items-center rounded-2xl bg-white/12 text-center">
        {index < 0 && <p className="text-lg font-bold">点击开始，熟悉设备语音节奏</p>}
        {running && <p className={`font-black ${/^\d$/.test(current) ? 'text-7xl' : 'text-3xl'}`}>{current}</p>}
        {done && <div><CheckCircle2 className="mx-auto" size={48} /><p className="mt-2 text-2xl font-black">练习完成</p></div>}
      </div>
      <button className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white font-black text-blue-700" onClick={() => setIndex(0)} disabled={running}><Play size={20} />{done ? '再练一次' : running ? '练习进行中' : '开始屏气练习'}</button>
      <p className="mt-4 text-sm font-semibold leading-6 text-blue-50">实际屏气时长请以检查设备和工作人员指令为准，本练习不代表固定屏气时长。</p>
    </div>
  )
}
