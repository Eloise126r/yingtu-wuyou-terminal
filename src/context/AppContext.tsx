import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { defaultDemoPatient, demoPatients } from '../data/demoPatients'
import { queuePatients } from '../data/mockData'
import { calculateRoomAwareETA } from '../services/etaService'
import { findNextCallable, updateQueuePatient } from '../services/queueService'
import { STAFF_DEMO_PIN } from '../services/examRoomService'
import { ttsService } from '../services/ttsService'
import { createAnnouncement, quietAnnouncement } from '../services/announcementService'
import type { Announcement, AnnouncementHistoryItem, ExamRoom, PatientSession, PreparationStepKey, QueuePatient, QueueStatusCode, SafetyAnswer } from '../types'

const STORAGE_KEY = 'yingtu-terminal-shared-state-v3'
const OLD_STORAGE_KEY = 'yingtu-terminal-session-v2'
const STAFF_SESSION_KEY = 'yingtu-terminal-staff-auth'

interface StoredState {
  selectedId: string
  sessions: Record<string, PatientSession>
  elderMode: boolean
  queue: QueuePatient[]
  examRoom: ExamRoom
  currentAnnouncement: Announcement | null
  history: AnnouncementHistoryItem[]
  audioVolume: number
  audioMuted: boolean
  autoQuietMinutes: 0 | 30 | 60
  miniProgramEvents: string[]
}

interface AppContextValue {
  patient: PatientSession
  demoPatients: PatientSession[]
  waitingEstimate: ReturnType<typeof calculateRoomAwareETA>
  elderMode: boolean
  queue: QueuePatient[]
  examRoom: ExamRoom
  nextCallable?: QueuePatient
  currentAnnouncement: Announcement | null
  broadcastingAnnouncement: Announcement | null
  announcementHistory: AnnouncementHistoryItem[]
  audioVolume: number
  audioMuted: boolean
  autoQuietMinutes: 0 | 30 | 60
  miniProgramEvents: string[]
  staffAuthenticated: boolean
  authenticateStaff: (pin: string) => boolean
  logoutStaff: () => void
  checkIn: () => void
  selectDemoPatient: (id: string) => void
  markStep: (step: PreparationStepKey, completed?: boolean, fromMiniProgram?: boolean) => void
  answerSafety: (questionId: string, answer: SafetyAnswer) => void
  setQueueStatus: (status: QueueStatusCode) => void
  leaveTemporarily: () => void
  returnFromLeave: () => void
  advanceQueue: () => void
  insertEmergency: () => void
  callPatient: () => void
  simulateMiniProgramSync: () => void
  toggleElderMode: () => void
  resetDemo: () => void
  publishAnnouncement: (announcement: Announcement, historyLabel?: string, miniProgramText?: string) => void
  callNextPatient: (patientId?: string) => QueuePatient | undefined
  repeatCurrentCall: () => QueuePatient | undefined
  markQueueMissed: (patientId: string) => void
  restoreQueuePatient: (patientId: string) => void
  pauseQueue: () => void
  resumeQueue: () => void
  setDeviceFault: (delay?: number) => void
  setDeviceMaintenance: (delay?: number) => void
  recoverDevice: () => void
  addEmergencyDelay: (minutes: number) => { original: string; adjusted: string }
  addProgressDelay: (minutes: number) => void
  setEtaAdjustment: (minutes: number) => void
  remindPreparation: (patientId: string) => void
  setAudioVolume: (volume: number) => void
  toggleAudioMuted: () => void
  setAutoQuietMinutes: (minutes: 0 | 30 | 60) => void
  stopBroadcast: () => void
}

const AppContext = createContext<AppContextValue | null>(null)
const initialSessions = () => Object.fromEntries(demoPatients.map((patient) => [patient.id, patient]))
const initialRoom = (): ExamRoom => ({ id: 'ct-room-2', name: 'CT 2号检查室', modality: 'CT', status: 'NORMAL', currentPatientId: 'q-008', nextPatientId: 'q-009', etaAdjustment: 0, callPaused: false, examiningStartedAt: new Date(Date.now() - 265000).toISOString() })
const initialState = (): StoredState => ({ selectedId: defaultDemoPatient.id, sessions: initialSessions(), elderMode: false, queue: queuePatients, examRoom: initialRoom(), currentAnnouncement: null, history: [], audioVolume: 80, audioMuted: false, autoQuietMinutes: 0, miniProgramEvents: [] })

function readState(): StoredState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...initialState(), ...(JSON.parse(stored) as StoredState), sessions: { ...initialSessions(), ...(JSON.parse(stored) as StoredState).sessions } }
    const old = localStorage.getItem(OLD_STORAGE_KEY)
    if (old) {
      const parsed = JSON.parse(old) as Pick<StoredState, 'selectedId' | 'sessions' | 'elderMode'>
      return { ...initialState(), ...parsed, sessions: { ...initialSessions(), ...parsed.sessions } }
    }
  } catch { /* Malformed demo state must not block the terminal. */ }
  return initialState()
}

const completionField: Record<PreparationStepKey, keyof PatientSession> = { preparation: 'preparationCompleted', safety: 'safetyCheckCompleted', position: 'positionTrainingCompleted', breathing: 'breathingTrainingCompleted' }

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(readState)
  const [staffAuthenticated, setStaffAuthenticated] = useState(() => sessionStorage.getItem(STAFF_SESSION_KEY) === 'true')
  const [broadcastingAnnouncement, setBroadcastingAnnouncement] = useState<Announcement | null>(null)
  const stateRef = useRef(state)
  const patient = state.sessions[state.selectedId] ?? defaultDemoPatient
  stateRef.current = state

  useEffect(() => { document.documentElement.classList.toggle('elder-mode', state.elderMode) }, [state.elderMode])
  useEffect(() => {
    if (!state.currentAnnouncement) return
    const id = state.currentAnnouncement.id
    const timer = window.setTimeout(() => setState((current) => current.currentAnnouncement?.id === id ? persist({ ...current, currentAnnouncement: null }) : current), state.currentAnnouncement.duration)
    return () => window.clearTimeout(timer)
  }, [state.currentAnnouncement?.id])
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === STORAGE_KEY && event.newValue) { const next = JSON.parse(event.newValue) as StoredState; if (next.currentAnnouncement && next.currentAnnouncement.id !== stateRef.current.currentAnnouncement?.id) playAnnouncement(next.currentAnnouncement); setState(next) } }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const commit = (updater: StoredState | ((current: StoredState) => StoredState)) => setState((current) => persist(typeof updater === 'function' ? updater(current) : updater))
  const updatePatient = (updater: (current: PatientSession) => PatientSession) => commit((current) => {
    const nextPatient = updater(current.sessions[current.selectedId] ?? defaultDemoPatient)
    return { ...current, sessions: { ...current.sessions, [nextPatient.id]: nextPatient } }
  })

  const playAnnouncement = (announcement: Announcement) => ttsService.speak({ id: announcement.id, text: announcement.ttsText, priority: announcement.priority, volume: stateRef.current.audioMuted ? 0 : stateRef.current.audioVolume, onStart: () => setBroadcastingAnnouncement(announcement), onEnd: () => setBroadcastingAnnouncement((current) => current?.id === announcement.id ? null : current) })
  const publishAnnouncement = (announcement: Announcement, historyLabel = announcement.title, miniProgramText?: string) => {
    commit((current) => ({ ...current, currentAnnouncement: announcement, history: [{ id: announcement.id, time: announcement.createdAt, type: announcement.type, label: historyLabel, operator: announcement.createdBy, result: announcement.affectsETA ? '已播报，等待时间已更新' : '播放成功' }, ...current.history].slice(0, 30), miniProgramEvents: miniProgramText ? [miniProgramText, ...current.miniProgramEvents].slice(0, 10) : current.miniProgramEvents }))
    playAnnouncement(announcement)
  }
  useEffect(() => {
    if (!state.autoQuietMinutes) return
    const timer = window.setInterval(() => publishAnnouncement(quietAnnouncement(), '自动安静提醒'), state.autoQuietMinutes * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [state.autoQuietMinutes])

  const checkIn = () => updatePatient((current) => ({ ...current, checkedIn: true, checkedInAt: new Date().toISOString(), queueStatus: current.urgentAdjusted ? 'URGENT_DELAY' : 'WAITING' }))
  const selectDemoPatient = (id: string) => commit((current) => current.sessions[id] ? { ...current, selectedId: id } : current)
  const markStep = (step: PreparationStepKey, completed = true, fromMiniProgram = false) => updatePatient((current) => { const next = { ...current, [completionField[step]]: completed } as PatientSession; const synced = new Set(next.syncedFromMiniProgram); if (fromMiniProgram && completed) synced.add(step); if (!completed) synced.delete(step); next.syncedFromMiniProgram = [...synced]; next.prepared = next.requiredSteps.every((item) => Boolean(next[completionField[item]])); return next })
  const answerSafety = (questionId: string, answer: SafetyAnswer) => updatePatient((current) => ({ ...current, safetyAnswers: { ...current.safetyAnswers, [questionId]: answer }, staffReviewRequired: answer !== 'NO' || Object.entries(current.safetyAnswers).some(([id, value]) => id !== questionId && value !== 'NO') }))
  const setQueueStatus = (queueStatus: QueueStatusCode) => updatePatient((current) => ({ ...current, queueStatus }))
  const leaveTemporarily = () => updatePatient((current) => ({ ...current, temporaryLeave: true, queueStatus: 'TEMP_LEAVE' }))
  const returnFromLeave = () => updatePatient((current) => ({ ...current, temporaryLeave: false, queueStatus: 'WAITING' }))
  const advanceQueue = () => updatePatient((current) => { const aheadCount = Math.max(0, current.aheadCount - 1); return { ...current, aheadCount, queueStatus: aheadCount <= 0 ? 'CALLED' : aheadCount === 1 ? 'NEXT' : 'WAITING', called: aheadCount <= 0 } })
  const callPatient = () => updatePatient((current) => ({ ...current, aheadCount: 0, called: true, queueStatus: 'CALLED' }))
  const simulateMiniProgramSync = () => updatePatient((current) => { const required = current.requiredSteps.filter((step) => step !== 'safety'); const next = { ...current, syncedFromMiniProgram: [...new Set([...current.syncedFromMiniProgram, ...required])] }; for (const step of required) (next[completionField[step]] as boolean) = true; next.prepared = next.requiredSteps.every((item) => Boolean(next[completionField[item]])); return next })
  const authenticateStaff = (pin: string) => { const valid = pin === STAFF_DEMO_PIN; if (valid) { sessionStorage.setItem(STAFF_SESSION_KEY, 'true'); setStaffAuthenticated(true) } return valid }
  const logoutStaff = () => { sessionStorage.removeItem(STAFF_SESSION_KEY); setStaffAuthenticated(false) }

  const callNextPatient = (patientId?: string) => {
    const selected = patientId ? state.queue.find((item) => item.id === patientId) : findNextCallable(state.queue)
    if (!selected || state.examRoom.callPaused || state.examRoom.status !== 'NORMAL') return undefined
    commit((current) => ({ ...current, queue: updateQueuePatient(current.queue, selected.id, (item) => ({ ...item, status: 'CALLED', calledCount: (item.calledCount ?? 0) + 1 })), examRoom: { ...current.examRoom, nextPatientId: selected.id } }))
    return selected
  }
  const repeatCurrentCall = () => state.queue.find((item) => item.status === 'CALLED')
  const markQueueMissed = (id: string) => commit((current) => ({ ...current, queue: updateQueuePatient(current.queue, id, (item) => ({ ...item, status: 'MISSED' })) }))
  const restoreQueuePatient = (id: string) => commit((current) => ({ ...current, queue: updateQueuePatient(current.queue, id, (item) => ({ ...item, status: 'WAITING' })) }))
  const pauseQueue = () => commit((current) => ({ ...current, examRoom: { ...current.examRoom, status: 'PAUSED', callPaused: true } }))
  const resumeQueue = () => commit((current) => ({ ...current, examRoom: { ...current.examRoom, status: 'NORMAL', callPaused: false, eventDelayMinutes: undefined } }))
  const setDeviceFault = (delay?: number) => commit((current) => ({ ...current, examRoom: { ...current.examRoom, status: 'DEVICE_FAULT', callPaused: true, recoveryEstimate: delay, eventDelayMinutes: delay } }))
  const setDeviceMaintenance = (delay?: number) => commit((current) => ({ ...current, examRoom: { ...current.examRoom, status: 'MAINTENANCE', callPaused: true, recoveryEstimate: delay, eventDelayMinutes: delay } }))
  const recoverDevice = () => commit((current) => ({ ...current, examRoom: { ...current.examRoom, status: 'NORMAL', callPaused: false, recoveryEstimate: undefined, eventDelayMinutes: undefined } }))
  const addEmergencyDelay = (minutes: number) => { const before = calculateRoomAwareETA(patient, state.examRoom); const original = `${before.min}–${before.max}分钟`; commit((current) => ({ ...current, sessions: Object.fromEntries(Object.entries(current.sessions).map(([id, item]) => [id, { ...item, previousWaitRange: id === current.selectedId ? original : item.previousWaitRange, emergencyAhead: item.emergencyAhead + 1, urgentAdjusted: true, queueStatus: item.checkedIn ? 'URGENT_DELAY' : item.queueStatus }])), examRoom: { ...current.examRoom, eventDelayMinutes: (current.examRoom.eventDelayMinutes ?? 0) + minutes } })); return { original, adjusted: `${before.min + minutes}–${before.max + minutes}分钟` } }
  const addProgressDelay = (minutes: number) => commit((current) => ({ ...current, examRoom: { ...current.examRoom, eventDelayMinutes: minutes } }))
  const setEtaAdjustment = (minutes: number) => commit((current) => ({ ...current, examRoom: { ...current.examRoom, etaAdjustment: minutes } }))
  const remindPreparation = (id: string) => { const target = state.queue.find((item) => item.id === id); const text = '即将轮到您，请尽快完成检查准备并留在候检区域。'; publishAnnouncement(createAnnouncement({ type: 'PREPARATION', priority: 'MEDIUM', title: '检查准备提醒', screenText: text, ttsText: text, duration: 8000, requireConfirmation: false, affectsQueue: false, affectsETA: false, detail: target ? `${target.ticketNo}号 ${target.maskedName}` : undefined }), `提醒${target?.ticketNo ?? ''}号完成准备`, text) }
  const resetDemo = () => { ttsService.stop(); commit(initialState()) }
  const stopBroadcast = () => { ttsService.stop(); setBroadcastingAnnouncement(null) }

  const value = useMemo<AppContextValue>(() => ({ patient, demoPatients: demoPatients.map((item) => state.sessions[item.id] ?? item), waitingEstimate: calculateRoomAwareETA(patient, state.examRoom), elderMode: state.elderMode, queue: state.queue, examRoom: state.examRoom, nextCallable: findNextCallable(state.queue), currentAnnouncement: state.currentAnnouncement, broadcastingAnnouncement, announcementHistory: state.history, audioVolume: state.audioVolume, audioMuted: state.audioMuted, autoQuietMinutes: state.autoQuietMinutes, miniProgramEvents: state.miniProgramEvents, staffAuthenticated, authenticateStaff, logoutStaff, checkIn, selectDemoPatient, markStep, answerSafety, setQueueStatus, leaveTemporarily, returnFromLeave, advanceQueue, insertEmergency: () => { addEmergencyDelay(10) }, callPatient, simulateMiniProgramSync, toggleElderMode: () => commit((current) => ({ ...current, elderMode: !current.elderMode })), resetDemo, publishAnnouncement, callNextPatient, repeatCurrentCall, markQueueMissed, restoreQueuePatient, pauseQueue, resumeQueue, setDeviceFault, setDeviceMaintenance, recoverDevice, addEmergencyDelay, addProgressDelay, setEtaAdjustment, remindPreparation, setAudioVolume: (audioVolume) => commit((current) => ({ ...current, audioVolume })), toggleAudioMuted: () => commit((current) => ({ ...current, audioMuted: !current.audioMuted })), setAutoQuietMinutes: (autoQuietMinutes) => commit((current) => ({ ...current, autoQuietMinutes })), stopBroadcast }), [state, patient, broadcastingAnnouncement, staffAuthenticated])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function persist(state: StoredState) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return state }
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('useApp must be used inside AppProvider'); return value }
