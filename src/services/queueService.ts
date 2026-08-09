import type { QueuePatient } from '../types'

export function findNextCallable(queue: QueuePatient[]) {
  return queue.find((patient) => patient.status === 'NEXT') ?? queue.find((patient) => patient.status === 'READY') ?? queue.find((patient) => patient.status === 'WAITING')
}

export function updateQueuePatient(queue: QueuePatient[], id: string, updater: (patient: QueuePatient) => QueuePatient) {
  return queue.map((patient) => patient.id === id ? updater(patient) : patient)
}
