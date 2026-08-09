import type { Announcement, AnnouncementPriority, AnnouncementType, QueuePatient } from '../types'

type AnnouncementInput = Omit<Announcement, 'id' | 'createdAt' | 'createdBy'> & { createdBy?: string }

export const createAnnouncement = (input: AnnouncementInput): Announcement => ({
  ...input,
  id: `announcement-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  createdAt: new Date().toISOString(),
  createdBy: input.createdBy ?? 'CT 2号检查室技师',
})

export const announcementPriority: Record<AnnouncementType, AnnouncementPriority> = {
  CALL: 'HIGH', EMERGENCY: 'HIGH', DEVICE_FAULT: 'HIGH', DEVICE_RECOVERY: 'MEDIUM', DELAY: 'MEDIUM', CUSTOM: 'MEDIUM', QUIET: 'LOW', PREPARATION: 'MEDIUM',
}

export function callAnnouncement(patient: QueuePatient, repeat = false) {
  const title = repeat ? '再次叫号' : '正在叫号'
  const ttsText = repeat
    ? `再次呼叫${patient.ticketNo}号${patient.maskedName}，请前往CT二号检查室。`
    : `请${patient.ticketNo}号${patient.maskedName}前往CT二号检查室，请做好检查准备。`
  return createAnnouncement({ type: 'CALL', priority: 'HIGH', title, screenText: `${patient.ticketNo}号 ${patient.maskedName}\n请前往CT 2号检查室`, ttsText, duration: 10000, requireConfirmation: false, affectsQueue: true, affectsETA: true, detail: `${patient.ticketNo}号 ${patient.maskedName}` })
}

export const quietAnnouncement = () => createAnnouncement({ type: 'QUIET', priority: 'LOW', title: '温馨提醒', screenText: '请降低交谈音量\n共同保持安静舒适的候检环境', ttsText: '为了营造安静舒适的候检环境，请降低交谈音量，并留意叫号信息。感谢您的理解与配合。', duration: 7000, requireConfirmation: false, affectsQueue: false, affectsETA: false })

export function emergencyAnnouncement(delay: number, originalEta: string, adjustedEta: string) {
  return createAnnouncement({ type: 'EMERGENCY', priority: 'HIGH', title: '急诊患者优先检查', screenText: '因急诊患者需要优先完成影像检查，当前候检顺序已进行调整。\n您的预计等待时间可能有所延长，感谢您的理解与配合。', ttsText: `各位患者您好，现有急诊患者需要优先完成影像检查。按照医院急诊绿色通道流程，当前候检顺序将进行相应调整，预计等待时间可能延长约${delay}分钟。感谢您的理解与配合。`, duration: 14000, requireConfirmation: true, affectsQueue: true, affectsETA: true, originalEta, adjustedEta })
}

export function faultAnnouncement(delay?: number) {
  const timeText = delay ? `预计可能延迟约${delay}分钟。` : '恢复时间正在评估。'
  const ttsTime = delay ? `预计等待时间可能延长约${delay}分钟。` : '目前恢复时间正在评估中。'
  return createAnnouncement({ type: 'DEVICE_FAULT', priority: 'HIGH', title: '检查设备临时异常', screenText: `当前检查设备出现临时异常，工作人员正在处理。\n您的候检顺序将保留，${timeText}\n请留意屏幕及工作人员通知。`, ttsText: `各位患者您好，因检查设备临时异常，本检查室当前检查暂时暂停，工作人员正在处理。您的候检顺序将保留，${ttsTime}请留意屏幕及工作人员通知，给您带来不便，敬请谅解。`, duration: 15000, requireConfirmation: true, affectsQueue: false, affectsETA: true, detail: delay ? `预计延迟${delay}分钟` : '恢复时间正在评估' })
}

export const recoveryAnnouncement = () => createAnnouncement({ type: 'DEVICE_RECOVERY', priority: 'MEDIUM', title: '设备已恢复运行', screenText: '检查将按照更新后的候检顺序继续进行，请留意叫号。', ttsText: '各位患者您好，检查设备已恢复正常运行，检查将按照更新后的候检顺序继续进行，请留意叫号信息。感谢您的耐心等待。', duration: 7000, requireConfirmation: true, affectsQueue: false, affectsETA: true })

export function delayAnnouncement(delay: number) {
  return createAnnouncement({ type: 'DELAY', priority: 'MEDIUM', title: '检查进度有所延迟', screenText: `当前检查进度较预计有所延迟，您的预计等待时间已相应更新。\n预计可能延迟约${delay}分钟。`, ttsText: `各位患者您好，当前检查进度较预计有所延迟，预计候检时间可能延长约${delay}分钟。请留意最新叫号信息，感谢您的理解与配合。`, duration: 9000, requireConfirmation: true, affectsQueue: false, affectsETA: true, detail: `预计延迟${delay}分钟` })
}

export function customAnnouncement(text: string) {
  return createAnnouncement({ type: 'CUSTOM', priority: 'MEDIUM', title: '候检通知', screenText: text, ttsText: text, duration: 9000, requireConfirmation: true, affectsQueue: false, affectsETA: false })
}
