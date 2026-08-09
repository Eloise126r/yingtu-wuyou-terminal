export type ExamType = 'DR' | 'CT平扫' | 'CT增强' | 'MRI平扫' | 'MRI增强'
export type Modality = 'DR' | 'CT' | 'MRI'

export type QueueStatusCode =
  | 'WAITING'
  | 'READY'
  | 'NEXT'
  | 'CALLED'
  | 'EXAMINING'
  | 'TEMP_LEAVE'
  | 'URGENT_DELAY'
  | 'COMPLETED'

export type PreparationStepKey = 'preparation' | 'safety' | 'position' | 'breathing'
export type SafetyAnswer = 'NO' | 'YES' | 'UNSURE'
export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED'

export interface QueuePatient {
  id: string
  maskedName: string
  ticketNo: string
  room: string
  status: QueueStatusCode
}

export interface PatientSession {
  id: string
  examId: string
  knowledgeId: string
  trainingId: string
  maskedName: string
  ticketNo: string
  examType: ExamType
  modality: Modality
  bodyPart: string
  contrast: boolean
  examName: string
  room: string
  aheadCount: number
  checkedInAt?: string
  checkedIn: boolean
  queueStatus: QueueStatusCode
  preparationCompleted: boolean
  safetyCheckCompleted: boolean
  positionTrainingCompleted: boolean
  breathingTrainingCompleted: boolean
  requiredSteps: PreparationStepKey[]
  prepared: boolean
  temporaryLeave: boolean
  called: boolean
  examCompleted: boolean
  emergencyAhead: number
  urgentAdjusted: boolean
  previousWaitRange?: string
  syncedFromMiniProgram: PreparationStepKey[]
  safetyAnswers: Record<string, SafetyAnswer>
  staffReviewRequired: boolean
}

export interface WaitingEstimate {
  min: number
  max: number
  averageMinutes: number
  emergencyDelay: number
  factors: string[]
}

export interface KnowledgeSection {
  title: string
  items: string[]
  note?: string
  riskLevel?: RiskLevel
}

export interface MetalRemovalGroup {
  area: string
  items: string[]
}

export interface SafetyQuestionDefinition {
  id: string
  question: string
  staffMessage: string
}

export interface ExamKnowledge {
  id: string
  modality: Modality
  subtype: ExamType
  bodyPart: string
  displayName: string
  summary: string
  beforeExam: KnowledgeSection[]
  dayOfExam: KnowledgeSection[]
  metalRemoval: MetalRemovalGroup[]
  metalExplanation: string
  safetyScreening: SafetyQuestionDefinition[]
  positioning: string[]
  breathing: string[]
  duringExam: KnowledgeSection[]
  afterExam: KnowledgeSection[]
  source: string[]
  localPolicyOverride?: string
}

export interface TrainingDefinition {
  id: string
  modality: Modality
  title: string
  shortTitle: string
  assetKey: string
  posture: string
  arms: string
  head: string
  stillness: string
  breathing: string
    cooperation: string
    steps: string[]
    supportsBreathingTrainer: boolean
    source: string
}

export interface FAQEntry {
  id: string
  category: string
  examTypes: Array<ExamType | '通用'>
  question: string
  keywords: string[]
  conclusion: string
  actions: string[]
  riskLevel: RiskLevel
  staffAlert?: string
  sourceTag: string
}

export interface AIAnswer {
  question: string
  conclusion: string
  actions: string[]
  riskLevel: RiskLevel
  staffAlert?: string
  sourceTag?: string
}
