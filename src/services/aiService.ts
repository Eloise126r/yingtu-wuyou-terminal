import type { AIAnswer, PatientSession } from '../types'
import { classifyRisk } from './riskClassifier'
import { retrieveKnowledge } from './knowledgeRetriever'

const redAnswer: AIAnswer = {
  question: '',
  conclusion: '这个问题涉及疾病诊断或治疗方案，需要医生结合您的完整检查结果和临床情况判断。影途无忧目前只提供影像检查流程、准备和安全提示。',
  actions: ['不要根据终端自行诊断、用药或停药', '请咨询开单医生或相关专科医生', '如出现紧急不适，请及时联系医务人员'],
  riskLevel: 'RED',
}

export function askYingtuAI(question: string, patient: PatientSession): AIAnswer {
  const risk = classifyRisk(question)
  if (risk === 'RED') return { ...redAnswer, question }

  const match = retrieveKnowledge(question, patient)
  if (match) {
    return {
      question,
      conclusion: match.conclusion,
      actions: match.actions.slice(0, 3),
      riskLevel: risk === 'YELLOW' ? 'YELLOW' : match.riskLevel,
      staffAlert: match.staffAlert ?? (risk === 'YELLOW' ? '建议由现场工作人员进一步确认。' : undefined),
      sourceTag: match.sourceTag,
    }
  }

  if (risk === 'YELLOW') {
    return {
      question,
      conclusion: '您提到的情况可能影响本次影像检查准备或安全条件，系统不能直接判断能否检查。',
      actions: ['请暂时不要自行进入检查区域', '准备相关病史、植入物或用药资料（如有）', '主动告诉现场工作人员'],
      riskLevel: 'YELLOW',
      staffAlert: '建议由现场工作人员进一步确认。',
      sourceTag: '安全规则引擎',
    }
  }

  return {
    question,
    conclusion: `您当前咨询的是“${patient.examName}”。这个问题在演示知识库中暂时没有足够匹配内容。`,
    actions: ['可点击下方快捷问题', '检查准备以本次预约提示为准', '需要个体化判断时请询问工作人员'],
    riskLevel: 'GREEN',
    sourceTag: 'sharedKnowledgeBase',
  }
}
