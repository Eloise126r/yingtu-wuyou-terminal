import type { ExamRoom, PatientSession, WaitingEstimate } from '../types'
import { calculateWaitingEstimate } from '../utils/waitingTime'

export function calculateRoomAwareETA(patient: PatientSession, room: ExamRoom): WaitingEstimate {
  const base = calculateWaitingEstimate(patient)
  const buffer = room.etaAdjustment + (room.eventDelayMinutes ?? 0)
  if (room.status === 'DEVICE_FAULT' || room.status === 'PAUSED') {
    return { ...base, min: Math.max(0, base.min + buffer), max: Math.max(5, base.max + buffer), factors: [...base.factors, room.status === 'DEVICE_FAULT' ? '设备状态异常，预测区间正在重新评估' : '候检流程已暂停，预测暂时冻结'] }
  }
  return { ...base, min: Math.max(0, base.min + buffer), max: Math.max(5, base.max + buffer), factors: buffer ? [...base.factors, `已包含工作人员修正与进度缓冲 ${buffer > 0 ? '+' : ''}${buffer} 分钟`] : base.factors }
}
