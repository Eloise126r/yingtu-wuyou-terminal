export function PhaseBadge({ phase }: { phase: 2 | 3 }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">
      第 {phase} 阶段
    </span>
  )
}
