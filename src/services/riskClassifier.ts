import type { RiskLevel } from '../types'

const redKeywords = ['癌', '肿瘤', '是不是恶性', '报告严重', '诊断', '做手术', '治疗', '吃什么药', '怎么治', '用药方案']
const yellowKeywords = ['起搏器', '除颤器', '人工耳蜗', '植入物', '钢板', '内固定', '动脉瘤夹', '弹片', '眼部金属', '肾功能', '肾脏疾病', '透析', '既往反应', '过敏', '怀孕', '幽闭', '不能平躺', '不会屏气', '二甲双胍']

export function classifyRisk(question: string): RiskLevel {
  const normalized = question.replace(/\s/g, '')
  if (redKeywords.some((keyword) => normalized.includes(keyword))) return 'RED'
  if (yellowKeywords.some((keyword) => normalized.includes(keyword))) return 'YELLOW'
  return 'GREEN'
}
