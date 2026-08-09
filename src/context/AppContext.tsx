import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { defaultDemoPatient, demoPatients } from '../data/demoPatients'
import type { PatientSession, PreparationStepKey, QueueStatusCode, SafetyAnswer } from '../types'
import { calculateWaitingEstimate } from '../utils/waitingTime'

const STORAGE_KEY = 'yingtu-terminal-session-v2'

interface StoredState {
  selectedId: string
  sessions: Record<string, PatientSession>
  elderMode: boolean
}

interface AppContextValue {
  patient: PatientSession
  demoPatients: PatientSession[]
  waitingEstimate: ReturnType<typeof calculateWaitingEstimate>
  elderMode: boolean
  checkIn: () => void
  selectDemoPatient: (id: string) => void
  markStep: (step: PreparationStepKey, completed?: boolean, fromMiniProgram?: boolean) => void
  answerSafety: (questionId: string, answer: SafetyAnswer) => void
  setQueueStatus: (status: QueueStatusCode) => void
  leaveTemporarily: () => void
  returnFromLeave: () => void
  insertEmergency: () => void
  advanceQueue: () => void
  callPatient: () => void
  simulateMiniProgramSync: () => void
  toggleElderMode: () => void
  resetDemo: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const initialSessions = () => Object.fromEntries(demoPatients.map((patient) => [patient.id, patient]))

function readState(): StoredState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as StoredState
      return { selectedId: parsed.selectedId, sessions: { ...initialSessions(), ...parsed.sessions }, elderMode: Boolean(parsed.elderMode) }
    }
  } catch {
    // A malformed demo cache should never block the public terminal.
  }
  return { selectedId: defaultDemoPatient.id, sessions: initialSessions(), elderMode: false }
}

const completionField: Record<PreparationStepKey, keyof PatientSession> = {
  preparation: 'preparationCompleted',
  safety: 'safetyCheckCompleted',
  position: 'positionTrainingCompleted',
  breathing: 'breathingTrainingCompleted',
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(readState)
  const patient = state.sessions[state.selectedId] ?? defaultDemoPatient

  useEffect(() => {
    document.documentElement.classList.toggle('elder-mode', state.elderMode)
  }, [state.elderMode])

  const commit = (next: StoredState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const updatePatient = (updater: (current: PatientSession) => PatientSession) => {
    setState((currentState) => {
      const currentPatient = currentState.sessions[currentState.selectedId] ?? defaultDemoPatient
      const nextPatient = updater(currentPatient)
      const nextState = { ...currentState, sessions: { ...currentState.sessions, [nextPatient.id]: nextPatient } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
      return nextState
    })
  }

  const checkIn = () => updatePatient((current) => ({
    ...current,
    checkedIn: true,
    checkedInAt: new Date().toISOString(),
    queueStatus: current.urgentAdjusted ? 'URGENT_DELAY' : 'WAITING',
  }))

  const selectDemoPatient = (id: string) => {
    if (!state.sessions[id]) return
    commit({ ...state, selectedId: id })
  }

  const markStep = (step: PreparationStepKey, completed = true, fromMiniProgram = false) => updatePatient((current) => {
    const next = { ...current, [completionField[step]]: completed } as PatientSession
    const synced = new Set(next.syncedFromMiniProgram)
    if (fromMiniProgram && completed) synced.add(step)
    if (!completed) synced.delete(step)
    next.syncedFromMiniProgram = [...synced]
    next.prepared = next.requiredSteps.every((item) => Boolean(next[completionField[item]]))
    return next
  })

  const answerSafety = (questionId: string, answer: SafetyAnswer) => updatePatient((current) => ({
    ...current,
    safetyAnswers: { ...current.safetyAnswers, [questionId]: answer },
    staffReviewRequired: answer !== 'NO' || Object.entries(current.safetyAnswers).some(([id, value]) => id !== questionId && value !== 'NO'),
  }))

  const setQueueStatus = (queueStatus: QueueStatusCode) => updatePatient((current) => ({ ...current, queueStatus }))
  const leaveTemporarily = () => updatePatient((current) => ({ ...current, temporaryLeave: true, queueStatus: 'TEMP_LEAVE' }))
  const returnFromLeave = () => updatePatient((current) => ({ ...current, temporaryLeave: false, queueStatus: 'WAITING' }))
  const insertEmergency = () => updatePatient((current) => {
    const before = calculateWaitingEstimate(current)
    return {
      ...current,
      previousWaitRange: `${before.min}–${before.max}分钟`,
      emergencyAhead: current.emergencyAhead + 1,
      urgentAdjusted: true,
      queueStatus: 'URGENT_DELAY',
    }
  })
  const advanceQueue = () => updatePatient((current) => {
    const aheadCount = Math.max(0, current.aheadCount - 1)
    return { ...current, aheadCount, queueStatus: aheadCount <= 0 ? 'CALLED' : aheadCount === 1 ? 'NEXT' : 'WAITING', called: aheadCount <= 0 }
  })
  const callPatient = () => updatePatient((current) => ({ ...current, aheadCount: 0, called: true, queueStatus: 'CALLED' }))
  const simulateMiniProgramSync = () => updatePatient((current) => {
    const required = current.requiredSteps.filter((step) => step !== 'safety')
    const next = { ...current, syncedFromMiniProgram: [...new Set([...current.syncedFromMiniProgram, ...required])] }
    for (const step of required) (next[completionField[step]] as boolean) = true
    next.prepared = next.requiredSteps.every((item) => Boolean(next[completionField[item]]))
    return next
  })

  const toggleElderMode = () => commit({ ...state, elderMode: !state.elderMode })
  const resetDemo = () => commit({ selectedId: defaultDemoPatient.id, sessions: initialSessions(), elderMode: false })

  const value = useMemo<AppContextValue>(() => ({
    patient,
    demoPatients: demoPatients.map((item) => state.sessions[item.id] ?? item),
    waitingEstimate: calculateWaitingEstimate(patient),
    elderMode: state.elderMode,
    checkIn,
    selectDemoPatient,
    markStep,
    answerSafety,
    setQueueStatus,
    leaveTemporarily,
    returnFromLeave,
    insertEmergency,
    advanceQueue,
    callPatient,
    simulateMiniProgramSync,
    toggleElderMode,
    resetDemo,
  }), [state, patient])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used inside AppProvider')
  return value
}
