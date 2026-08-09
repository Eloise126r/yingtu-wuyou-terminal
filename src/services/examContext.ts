import type { PatientSession, WaitingEstimate } from '../types'

export function createExamContext(patient: PatientSession, waiting: WaitingEstimate) {
  return {
    examType: patient.examType,
    bodyPart: patient.bodyPart,
    contrast: patient.contrast,
    queueStatus: patient.queueStatus,
    estimatedWait: `${waiting.min}–${waiting.max}分钟`,
    preparationStatus: patient.prepared ? '准备完成' : '准备进行中',
  }
}
