import { ImageOff, Smartphone } from 'lucide-react'

export function MissingAssetPlaceholder({ title, assetKey }: { title: string; assetKey: string }) {
  // TODO: replace with mini-program original image when the shared asset package is provided.
  return (
    <div className="missing-asset" role="img" aria-label={`${title}示意图暂缺`}>
      <div className="relative grid h-32 w-32 place-items-center rounded-full bg-blue-50 text-blue-600">
        <ImageOff size={52} strokeWidth={1.7} />
        <span className="absolute -bottom-1 -right-1 grid h-11 w-11 place-items-center rounded-2xl bg-white text-cyan-600 shadow-md"><Smartphone size={22} /></span>
      </div>
      <p className="mt-5 text-xl font-black text-slate-800">{title}</p>
      <p className="mt-2 max-w-md text-center text-sm font-semibold leading-6 text-slate-500">未在当前仓库中找到影途无忧小程序原图，已保留统一资源位。</p>
      <code className="mt-3 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">{assetKey}</code>
    </div>
  )
}
