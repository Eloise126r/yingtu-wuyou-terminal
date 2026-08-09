import type { QueuePatient, QueueStatusCode } from '../types'

export const queueStatusMeta: Record<QueueStatusCode, { label: string; tone: string }> = {
  WAITING: { label: '候检中', tone: 'slate' },
  READY: { label: '请做好准备', tone: 'amber' },
  NEXT: { label: '即将叫号', tone: 'sky' },
  CALLED: { label: '正在叫号', tone: 'blue' },
  EXAMINING: { label: '正在检查', tone: 'blue' },
  TEMP_LEAVE: { label: '暂离', tone: 'slate' },
  MISSED: { label: '请联系工作人员', tone: 'amber' },
  URGENT_DELAY: { label: '因急诊调整', tone: 'amber' },
  COMPLETED: { label: '已完成', tone: 'emerald' },
}

export const currentCall: QueuePatient = {
  id: 'q-008',
  maskedName: '张*三',
  ticketNo: '08',
  room: 'CT 2 号检查室',
  status: 'EXAMINING',
}

export const queuePatients: QueuePatient[] = [
  { ...currentCall, examName: '胸部 CT 平扫', prepared: true, positionTrainingCompleted: true },
  { id: 'q-009', maskedName: '李*华', ticketNo: '09', room: 'CT 2 号检查室', status: 'NEXT', examName: '胸部 CT 平扫', prepared: true, positionTrainingCompleted: true },
  { id: 'q-010', maskedName: '王*明', ticketNo: '10', room: 'CT 2 号检查室', status: 'READY', examName: '腹部 CT 平扫', prepared: false, positionTrainingCompleted: true, staffReviewRequired: true },
  { id: 'q-011', maskedName: '陈*丽', ticketNo: '11', room: 'CT 2 号检查室', status: 'WAITING', examName: '胸部 CT 平扫', prepared: true, positionTrainingCompleted: false },
  { id: 'q-012', maskedName: '周*', ticketNo: '12', room: 'CT 2 号检查室', status: 'TEMP_LEAVE', examName: '胸部 CT 平扫', prepared: false, positionTrainingCompleted: false },
]

export const hospitalTips = [
  '请留意屏幕叫号，并在候检区域保持安静',
  '如需暂时离开，请先在个人候检页登记暂离',
  '检查前如有疑问，请点击“检查前准备”查看本次提示',
  '终端与影途无忧手机端同步候检与准备状态',
]

export const averageMinutesByExam = {
  DR: 4,
  CT平扫: 5,
  CT增强: 10,
  MRI平扫: 16,
  MRI增强: 20,
} as const
