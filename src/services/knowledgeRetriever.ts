import { faqKnowledge } from '../data/faqKnowledge'
import type { FAQEntry, PatientSession } from '../types'

export function retrieveKnowledge(question: string, patient: PatientSession): FAQEntry | undefined {
  const normalized = question.replace(/[？?，,。\s]/g, '')
  return faqKnowledge
    .map((entry) => {
      let score = entry.examTypes.includes(patient.examType) ? 5 : entry.examTypes.includes('通用') ? 2 : 0
      if (normalized.includes(entry.question.replace(/[？?，,。\s]/g, '')) || entry.question.includes(normalized)) score += 20
      for (const keyword of entry.keywords) if (normalized.includes(keyword.replace(/\s/g, ''))) score += 8
      if (entry.category.includes(patient.modality)) score += 2
      return { entry, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.entry
}

export function getQuickQuestions(patient: PatientSession) {
  const common = ['还要等多久？', '我能去厕所吗？', '检查大概要多久？', '需要去金属吗？', '检查时我要怎么躺？']
  const modality = patient.modality === 'CT'
    ? ['CT有辐射吗？', '为什么需要屏气？', '我可能怀孕怎么办？']
    : patient.modality === 'MRI'
      ? ['MR有辐射吗？', '有起搏器怎么办？', '有钢板能做吗？', '检查时为什么这么响？', '我怕幽闭怎么办？']
      : ['DR需要特殊准备吗？', '金属为什么要摘？', '胸片为什么要屏气？']
  const contrast = patient.examType === 'CT增强'
    ? ['增强CT需要空腹吗？', '以前过敏怎么办？', '肾功能不好怎么办？', '海鲜过敏能做吗？']
    : patient.examType === 'MRI增强'
      ? ['钆对比剂是什么？', '肾脏疾病能做MRI增强吗？', 'MRI增强以前有反应怎么办？']
      : []
  return [...contrast, ...modality, ...common].slice(0, 10)
}
