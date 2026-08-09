import { AlertTriangle, Bot, CheckCircle2, Mic, Send, ShieldAlert, Sparkles, Square, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { PrivacyTimeout } from '../components/PrivacyTimeout'
import { useApp } from '../context/AppContext'
import { FAQ_COUNT } from '../data/faqKnowledge'
import { askYingtuAI } from '../services/aiService'
import { createExamContext } from '../services/examContext'
import { getQuickQuestions } from '../services/knowledgeRetriever'
import type { AIAnswer } from '../types'

export function AIPage() {
  const { patient, waitingEstimate } = useApp()
  const [input, setInput] = useState('')
  const [answers, setAnswers] = useState<AIAnswer[]>([])
  const [voiceState, setVoiceState] = useState<'idle'|'listening'|'recognized'>('idle')
  const [recognized, setRecognized] = useState('')
  const voiceTimer = useRef<number>()
  const quick = useMemo(() => getQuickQuestions(patient), [patient])
  const context = createExamContext(patient, waitingEstimate)
  useEffect(() => () => window.clearTimeout(voiceTimer.current), [])

  const submit = (question: string) => {
    const clean = question.trim(); if (!clean) return
    setAnswers((items) => [...items, askYingtuAI(clean, patient)]); setInput('')
  }
  const startVoice = () => {
    setVoiceState('listening'); setRecognized('')
    voiceTimer.current = window.setTimeout(() => { const question='有心脏起搏器能做磁共振吗？'; setRecognized(question); setVoiceState('recognized'); submit(question) }, 1600)
  }
  const speak = (answer: AIAnswer) => { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance=new SpeechSynthesisUtterance(`${answer.conclusion}。${answer.actions.join('。')}`); utterance.lang='zh-CN'; window.speechSynthesis.speak(utterance) }

  return <div className="terminal-shell"><Header title="影途无忧 AI助手" subtitle="检查流程、准备、体位配合与安全提示" /><PrivacyTimeout /><main className="terminal-main overflow-y-auto"><div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[360px_1fr]"><aside className="space-y-4"><section className="panel p-5"><p className="eyebrow">当前咨询</p><h1 className="mt-2 text-2xl font-black">{patient.examName}</h1><div className="mt-4 grid grid-cols-2 gap-2 text-sm"><ContextItem label="部位" value={context.bodyPart} /><ContextItem label="是否增强" value={context.contrast?'是':'否'} /><ContextItem label="预计等待" value={context.estimatedWait} /><ContextItem label="准备状态" value={context.preparationStatus} /></div></section><section className="panel p-5"><div className="flex items-center justify-between"><p className="font-black">快捷问题</p><span className="text-xs font-black text-blue-700">{FAQ_COUNT} 条知识</span></div><div className="mt-3 max-h-[520px] space-y-2 overflow-y-auto">{quick.map((question) => <button key={question} className="min-h-12 w-full rounded-xl bg-slate-50 px-4 text-left text-sm font-bold text-slate-700 hover:bg-blue-50" onClick={() => submit(question)}>{question}</button>)}</div></section></aside><section className="panel flex min-h-[760px] flex-col overflow-hidden"><div className="border-b border-slate-100 bg-blue-50/50 p-5"><div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white"><Bot size={30} /></span><div><h2 className="text-xl font-black">您好，我可以帮您了解本次影像检查的准备、候诊、体位配合和安全注意事项。</h2><p className="mt-1 font-semibold text-slate-500">涉及疾病诊断和治疗的问题，请咨询医生。</p></div></div></div><div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">{answers.length===0 && <div className="grid min-h-[400px] place-items-center text-center"><div><Sparkles className="mx-auto text-blue-300" size={64} /><p className="mt-4 text-2xl font-black text-slate-700">请选择快捷问题，或输入您想了解的内容</p><p className="mt-2 font-semibold text-slate-400">回答来自结构化知识库 + 风险规则 + 模拟 RAG</p></div></div>}{answers.map((answer,index) => <AnswerCard key={`${answer.question}-${index}`} answer={answer} onSpeak={() => speak(answer)} />)}</div>{voiceState!=='idle' && <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 font-bold text-slate-700">{voiceState==='listening' ? <span className="flex items-center gap-2 text-rose-700"><span className="loading-dot !bg-rose-500" />正在听……</span> : <span>您问的是：{recognized}</span>}</div>}<div className="border-t border-slate-100 p-5"><div className="flex gap-3"><button className={`voice-action ${voiceState==='listening'?'bg-rose-600':''}`} onClick={voiceState==='listening'?()=>{window.clearTimeout(voiceTimer.current);setVoiceState('idle')}:startVoice}>{voiceState==='listening'?<Square size={20}/>:<Mic size={22}/>}<span className="hidden sm:inline">{voiceState==='listening'?'停止':'点击说话'}</span></button><input className="min-h-14 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-lg font-semibold outline-none focus:border-blue-500" value={input} onChange={(event)=>setInput(event.target.value)} onKeyDown={(event)=>event.key==='Enter'&&submit(input)} placeholder="例如：增强CT需要空腹吗？" /><button className="primary-action min-h-14 px-6" onClick={()=>submit(input)}><Send /></button></div></div></section></div></main></div>
}

function ContextItem({label,value}:{label:string;value:string}) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-black text-slate-400">{label}</p><p className="mt-1 font-black text-slate-800">{value}</p></div> }
function AnswerCard({answer,onSpeak}:{answer:AIAnswer;onSpeak:()=>void}) { const tone=answer.riskLevel==='RED'?'rose':answer.riskLevel==='YELLOW'?'amber':'blue'; return <article><div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-blue-600 px-5 py-3 font-bold text-white">{answer.question}</div><div className="mt-3 max-w-[88%] rounded-2xl rounded-tl-md border border-slate-100 bg-slate-50 p-5"><div className="flex items-center justify-between gap-3"><p className="flex items-center gap-2 font-black text-slate-900">{tone==='rose'?<ShieldAlert className="text-rose-600"/>:tone==='amber'?<AlertTriangle className="text-amber-600"/>:<CheckCircle2 className="text-blue-600"/>}先告诉您</p><button className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 text-sm font-black text-blue-700" onClick={onSpeak}><Volume2 size={17}/>播放回答</button></div><p className="mt-3 text-lg font-semibold leading-8 text-slate-700">{answer.conclusion}</p><p className="mt-5 font-black text-slate-900">现在怎么做</p><ul className="mt-2 space-y-2">{answer.actions.map((item)=><li key={item} className="flex gap-2 font-semibold leading-7 text-slate-600"><span className="text-blue-600">•</span>{item}</li>)}</ul>{answer.staffAlert&&<div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 font-black leading-7 text-amber-950"><AlertTriangle className="mt-0.5 shrink-0"/>{answer.staffAlert}</div>}</div></article> }
