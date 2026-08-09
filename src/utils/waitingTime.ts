import { averageMinutesByExam } from '../data/mockData'
import type { PatientSession, WaitingEstimate } from '../types'

/** Demo 规则模型。正式部署时由 RIS/HIS/排队预测 API 替换。 */
export function calculateWaitingEstimate(patient: PatientSession): WaitingEstimate {
  if (patient.called || patient.queueStatus === 'CALLED') {
    return { min: 0, max: 5, averageMinutes: 0, emergencyDelay: 0, factors: ['已进入叫号状态'] }
  }

  const averageMinutes = averageMinutesByExam[patient.examType]
  const emergencyDelay = patient.emergencyAhead * 10
  const raw = patient.aheadCount * averageMinutes + emergencyDelay
  const min = Math.max(5, Math.ceil(raw / 5) * 5)
  const max = min + 5
  const factors = [
    `前方 ${patient.aheadCount} 位患者`,
    `${patient.examType} 历史平均约 ${averageMinutes} 分钟/人`,
  ]
  if (patient.emergencyAhead > 0) factors.push('已考虑急诊患者优先安排带来的顺序调整')
  return { min, max, averageMinutes, emergencyDelay, factors }
}

export function getWaitingAdvice(patient: PatientSession, estimate: WaitingEstimate) {
  if (patient.aheadCount === 1) return '下一位可能就是您，请做好进入检查室的准备。'
  if (estimate.max > 20) return '等待期间可以先完成检查准备和体位学习。'
  if (estimate.max >= 10) return '请尽量留在候检区域附近，并确认检查准备。'
  return '即将轮到您，请勿远离候检区域。'
}
