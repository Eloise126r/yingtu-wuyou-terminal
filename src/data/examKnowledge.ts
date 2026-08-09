import type { ExamKnowledge, KnowledgeSection, SafetyQuestionDefinition } from '../types'

const section = (title: string, items: string[], note?: string): KnowledgeSection => ({ title, items, note })

const xrayPregnancy: SafetyQuestionDefinition = {
  id: 'xray-pregnancy',
  question: '您是否可能怀孕或已经怀孕？',
  staffMessage: '请在检查前主动告知工作人员，由医务人员结合本次检查评估。',
}

const mrSafetyQuestions: SafetyQuestionDefinition[] = [
  ['mr-pacemaker', '您是否装有心脏起搏器？'],
  ['mr-defibrillator', '您是否装有植入式除颤器？'],
  ['mr-cochlear', '您是否有人工耳蜗？'],
  ['mr-stimulator', '您是否有神经刺激器？'],
  ['mr-pump', '您是否有植入式药物泵？'],
  ['mr-aneurysm', '您是否有动脉瘤夹或血管内植入物？'],
  ['mr-orthopedic', '您是否有人工关节、内固定物或手术夹？'],
  ['mr-fragment', '您体内是否可能有弹片或不明金属异物？'],
  ['mr-eye-metal', '您是否有过眼部金属异物或金属伤？'],
  ['mr-pregnancy', '您是否可能怀孕或已经怀孕？'],
  ['mr-claustrophobia', '您是否有严重幽闭恐惧或不能长时间平卧？'],
  ['mr-motion', '您是否难以保持静止，或本次可能需要镇静？'],
].map(([id, question]) => ({
  id,
  question,
  staffMessage: '需要工作人员进一步确认 MR 安全条件。这并不代表您一定不能进行 MR 检查，请准备植入物型号、植入证明或相关资料。',
}))

const ctContrastQuestions: SafetyQuestionDefinition[] = [
  {
    id: 'ct-iodine-reaction',
    question: '您以前做增强 CT 或使用碘对比剂时，是否出现过明显不适或过敏样反应？',
    staffMessage: '需要工作人员进一步了解您之前反应的具体情况。',
  },
  {
    id: 'ct-renal',
    question: '您是否有严重肾脏疾病、肾功能异常或正在透析？',
    staffMessage: '请告知工作人员，是否需要进一步检查或调整方案由医务人员判断。',
  },
  {
    id: 'ct-pregnancy',
    question: '您是否可能怀孕或已经怀孕？',
    staffMessage: '请在检查前告知工作人员，由医务人员进一步评估。',
  },
  {
    id: 'ct-medication',
    question: '您是否正在使用二甲双胍等需要向工作人员说明的药物，或近期用药有变化？',
    staffMessage: '请告知工作人员并按照本院流程处理，不要自行停药。',
  },
]

const mrContrastQuestions: SafetyQuestionDefinition[] = [
  ...mrSafetyQuestions,
  {
    id: 'mr-gadolinium-reaction',
    question: '您以前做 MRI 增强或使用钆对比剂时，是否出现过明显异常反应？',
    staffMessage: '请由工作人员进一步了解既往反应并确认后续安排。',
  },
  {
    id: 'mr-renal-dialysis',
    question: '您是否存在严重肾脏疾病、肾功能异常或正在透析？',
    staffMessage: '请由工作人员进一步确认钆对比剂相关安全条件。',
  },
]

const mrMetal = [
  { area: '头部', items: ['发夹', '金属发饰', '耳环', '可拆卸助听器'] },
  { area: '颈部', items: ['项链', '吊坠'] },
  { area: '手部', items: ['手表', '智能手环', '戒指', '手链'] },
  { area: '衣物', items: ['皮带', '明显金属附件', '带金属配件衣物'] },
  { area: '随身', items: ['手机', '耳机', '钥匙', '硬币', '银行卡或磁卡', '其他电子设备'] },
]

const baseSources = ['RadiologyInfo（ACR/RSNA患者教育）', '中华医学会放射学分会相关指南/专家共识', '本院检查流程']
const contrastSources = ['ACR Manual on Contrast Media', 'ESUR Contrast Media Safety Committee Guidelines', '本院检查流程']
const mrSources = ['ACR Manual on MR Safety 2024', '中华医学会放射学分会相关指南/专家共识', '本院 MR 安全流程']

export const examKnowledge: ExamKnowledge[] = [
  {
    id: 'dr-chest', modality: 'DR', subtype: 'DR', bodyPart: '胸部', displayName: '胸部 DR',
    summary: '一般无需特殊饮食准备，重点是移除可能遮挡胸部的物品，并配合吸气、屏气。',
    beforeExam: [section('检查前', ['一般无需特殊饮食准备。', '如可能怀孕或已经怀孕，请在检查前主动告知工作人员。'])],
    dayOfExam: [section('到达检查室后', ['按照工作人员提示站到摄影设备前。', '需要时更换适合检查的衣物。'])],
    metalRemoval: [{ area: '胸部区域', items: ['项链', '胸针', '金属吊坠', '钢圈内衣', '较大的金属纽扣', '其他明显金属装饰'] }],
    metalExplanation: '这些物品可能在 X 线图像上形成遮挡，影响医生观察。',
    safetyScreening: [xrayPregnancy],
    positioning: ['站好并贴近指定位置', '保持身体和肩部稳定', '不要自行改变姿势'],
    breathing: ['听到“吸气”提示后深吸气', '按提示屏住呼吸数秒', '听到结束提示后恢复正常呼吸'],
    duringExam: [section('检查过程中', ['保持不动。', '按照工作人员提示深吸气并短暂屏气。'])],
    afterExam: [section('检查后', ['听到工作人员确认后再离开检查位置。'])],
    source: baseSources,
  },
  {
    id: 'dr-abdomen', modality: 'DR', subtype: 'DR', bodyPart: '腹部/KUB', displayName: '腹部 DR / KUB',
    summary: '饮食或肠道准备取决于具体检查目的和院内流程，不能统一判断。',
    beforeExam: [section('检查前', ['部分腹部检查可能有饮食或肠道准备要求，请以本次预约提示和工作人员要求为准。', '如可能怀孕，请主动告知工作人员。'])],
    dayOfExam: [section('检查当天', ['携带预约单并确认本次院内准备要求。'])],
    metalRemoval: [{ area: '腹部与腰部', items: ['皮带', '钥匙', '硬币', '金属扣', '其他遮挡检查区域的金属物品'] }],
    metalExplanation: '移除检查区域金属物品主要是为了减少图像遮挡。',
    safetyScreening: [xrayPregnancy], positioning: ['按提示仰卧或站立', '保持指定体位', '检查时不要移动'], breathing: ['是否需要屏气以现场指令为准'],
    duringExam: [section('检查过程中', ['保持指定体位并听从工作人员指令。'])], afterExam: [section('检查后', ['无特殊要求时可按工作人员提示离开。'])], source: baseSources,
    localPolicyOverride: '当前演示院内规则：请按照本次预约单要求完成饮食或肠道准备。',
  },
  {
    id: 'dr-spine-pelvis', modality: 'DR', subtype: 'DR', bodyPart: '脊柱/骨盆', displayName: '脊柱或骨盆 DR',
    summary: '重点移除腰腹部遮挡物，并保持工作人员指定的体位。',
    beforeExam: [section('检查前', ['如可能怀孕，请主动告知工作人员。'])], dayOfExam: [section('到达后', ['以本次检查部位和工作人员要求为准。'])],
    metalRemoval: [{ area: '腰腹与骨盆区域', items: ['皮带', '钥匙', '硬币', '金属扣', '较大的金属饰品'] }], metalExplanation: '这些物品可能遮挡脊柱或骨盆区域。',
    safetyScreening: [xrayPregnancy], positioning: ['保持指定体位', '不要自行转身或移动'], breathing: ['按现场提示正常呼吸或短暂屏气'],
    duringExam: [section('检查过程中', ['保持指定体位，检查时不要移动。'])], afterExam: [section('检查后', ['按工作人员提示结束检查。'])], source: baseSources,
  },
  {
    id: 'dr-limb', modality: 'DR', subtype: 'DR', bodyPart: '四肢', displayName: '四肢 DR',
    summary: '移除检查部位首饰，并按要求摆放手臂或腿部。', beforeExam: [section('检查前', ['无需自行做绝对化禁忌判断，有疑问请告诉工作人员。'])],
    dayOfExam: [section('到达后', ['说明疼痛或活动受限情况，避免勉强摆位。'])], metalRemoval: [{ area: '检查部位', items: ['戒指', '手表', '手链', '脚链', '其他首饰'] }],
    metalExplanation: '首饰可能遮挡骨骼或关节图像。', safetyScreening: [xrayPregnancy], positioning: ['按提示摆放检查肢体', '不要勉强活动受伤部位', '曝光时保持不动'], breathing: ['通常无需特殊屏气，以现场指令为准'],
    duringExam: [section('检查过程中', ['可能需要从不同方向拍摄，请按工作人员提示配合。'])], afterExam: [section('检查后', ['确认完成后再取回首饰。'])], source: baseSources,
  },
  {
    id: 'ct-plain-head', modality: 'CT', subtype: 'CT平扫', bodyPart: '头颅', displayName: '头颅 CT 平扫',
    summary: 'CT 使用 X 线成像；头部保持正中，尽量不要转头。', beforeExam: [section('通用 CT 提示', ['CT 使用 X 线成像。', '如可能怀孕或已经怀孕，请提前告知工作人员。'])],
    dayOfExam: [section('检查当天', ['无需自行做额外准备，以预约提示为准。'])], metalRemoval: [{ area: '头面部', items: ['耳环', '发夹', '眼镜', '可拆卸助听器', '可拆卸义齿按工作人员要求处理'] }],
    metalExplanation: 'CT 去除金属主要是为了减少金属伪影和图像遮挡，与 MRI 强磁场安全问题不是同一个概念。', safetyScreening: [xrayPregnancy],
    positioning: ['仰卧在检查床上', '头部保持正中', '检查过程中尽量不要转头'], breathing: ['通常无需自行做额外动作，以工作人员指令为准'],
    duringExam: [section('检查过程中', ['保持头部不动，听从设备和工作人员提示。'])], afterExam: [section('检查后', ['平扫通常无特殊观察要求，以工作人员提示为准。'])], source: baseSources,
  },
  {
    id: 'ct-plain-chest', modality: 'CT', subtype: 'CT平扫', bodyPart: '胸部', displayName: '胸部 CT 平扫',
    summary: '重点是仰卧、双臂通常上举、保持不动，并按设备提示配合吸气和屏气。', beforeExam: [section('检查前', ['CT 使用 X 线成像。', '一般饮食要求请以本次预约提示为准。', '如可能怀孕，请提前告知工作人员。'])],
    dayOfExam: [section('检查当天', ['携带预约信息，按照叫号进入检查室。'])], metalRemoval: [{ area: '胸部扫描区域', items: ['项链', '胸针', '金属挂件', '钢圈衣物', '扫描区域较大金属物'] }],
    metalExplanation: 'CT 去除金属主要是为了减少金属伪影和图像遮挡，与 MRI 强磁场安全问题不是同一个概念。', safetyScreening: [xrayPregnancy],
    positioning: ['仰卧在检查床上', '双臂通常举过头顶', '身体保持不动'], breathing: ['听到“吸气”后吸气', '听到“屏住呼吸”后短暂保持', '结束后恢复正常呼吸'],
    duringExam: [section('检查过程中', ['检查床会移动通过扫描区域。', '请按设备或工作人员提示配合屏气。'])], afterExam: [section('检查后', ['听到工作人员确认后再起身。'])], source: baseSources,
  },
  {
    id: 'ct-plain-abdomen', modality: 'CT', subtype: 'CT平扫', bodyPart: '腹部', displayName: '腹部 CT 平扫',
    summary: '是否需要空腹、饮水或口服对比剂取决于具体方案，请以本次预约要求为准。', beforeExam: [section('检查前', ['不要默认所有腹部 CT 都必须空腹。', '是否需要空腹、饮水或口服对比剂，取决于具体检查方案。'])],
    dayOfExam: [section('检查当天', ['按照预约单和工作人员要求完成饮食或饮水准备。'])], metalRemoval: [{ area: '腹部与腰部', items: ['皮带', '钥匙', '硬币', '裤腰较大的金属物品'] }],
    metalExplanation: '移除金属主要是为了减少伪影和图像遮挡。', safetyScreening: [xrayPregnancy], positioning: ['仰卧', '双臂通常按要求放置', '身体保持不动'], breathing: ['可能需要短时间屏气，以设备指令为准'],
    duringExam: [section('检查过程中', ['听从设备语音和工作人员提示。'])], afterExam: [section('检查后', ['按工作人员提示结束检查。'])], source: baseSources,
    localPolicyOverride: '当前演示院内规则：请按照预约单要求完成饮食准备。',
  },
  {
    id: 'ct-plain-abdomen-pelvis', modality: 'CT', subtype: 'CT平扫', bodyPart: '腹盆部', displayName: '腹盆部 CT 平扫',
    summary: '饮食、饮水与口服对比剂要求取决于检查方案和本院流程。', beforeExam: [section('检查前', ['请查看本次预约单，不要自行套用其他 CT 检查要求。'])],
    dayOfExam: [section('检查当天', ['按本院本次预约要求完成准备。'])], metalRemoval: [{ area: '腹盆部', items: ['皮带', '钥匙', '硬币', '裤腰较大的金属物品'] }],
    metalExplanation: '移除金属主要是为了减少图像伪影和遮挡。', safetyScreening: [xrayPregnancy], positioning: ['仰卧', '保持身体稳定'], breathing: ['可能多次短暂屏气，以设备指令为准'],
    duringExam: [section('检查过程中', ['检查床移动时保持不动。'])], afterExam: [section('检查后', ['按工作人员提示结束检查。'])], source: baseSources,
    localPolicyOverride: '当前演示院内规则：饮食、饮水或口服对比剂要求以预约单为准。',
  },
  {
    id: 'ct-contrast-abdomen', modality: 'CT', subtype: 'CT增强', bodyPart: '腹部', displayName: '腹部增强 CT',
    summary: '增强 CT 需要独立完成碘对比剂安全确认；系统只识别需要工作人员确认的情况。',
    beforeExam: [section('请提前说明', ['以前使用碘对比剂后是否发生过异常反应。', '是否有肾功能异常、严重肾脏疾病或正在透析。', '是否可能怀孕。', '近期重要疾病变化和当前正在使用的药物。'], '不要自行停药。')],
    dayOfExam: [section('检查当天', ['按本次预约单完成饮食和饮水准备。', '如果正在服用二甲双胍等药物，请告知工作人员并按照本院流程处理，不要自行停药。'])],
    metalRemoval: [{ area: '腹部与腰部', items: ['皮带', '钥匙', '硬币', '裤腰较大的金属物品'] }],
    metalExplanation: 'CT 去除金属是为了减少金属伪影和图像遮挡，不等同于 MRI 强磁场安全筛查。', safetyScreening: ctContrastQuestions,
    positioning: ['仰卧在检查床上', '按要求放置双臂', '身体保持不动'], breathing: ['可能需要多次短时间屏气', '实际时长以设备和工作人员指令为准'],
    duringExam: [section('注射对比剂时', ['部分患者可能短暂感到身体发热或口中有特殊味道。', '如果出现明显不适，请立即告诉工作人员。'])],
    afterExam: [section('检查后', ['按照工作人员要求短暂观察。', '如没有特殊限制，可按照医务人员建议适量饮水。'], '不要自行要求大量饮水，心衰或肾病等情况需遵循个体化建议。')],
    source: contrastSources, localPolicyOverride: '当前演示院内规则：请按照本次预约单完成饮食准备；药物处理需由工作人员确认。',
  },
  {
    id: 'mri-plain-head', modality: 'MRI', subtype: 'MRI平扫', bodyPart: '头颅', displayName: '头颅 MRI 平扫',
    summary: '进入磁共振检查区域前，请认真完成金属、电子物品和植入物安全确认。',
    beforeExam: [section('磁共振检查安全准备', ['进入磁共振检查区域前，请认真完成安全确认。', '携带植入物型号卡、手术记录或相关证明（如有）。'])],
    dayOfExam: [section('检查体验', ['检查过程中可能听到较大的、规律性的声音。', '会提供必要的听力保护。', '可通过工作人员提供的方式联系检查人员。'])],
    metalRemoval: mrMetal, metalExplanation: '进入 MR 检查区域前，请按照工作人员要求处理所有金属和电子物品。', safetyScreening: mrSafetyQuestions,
    positioning: ['仰卧', '头部放在专用线圈内', '尽量保持头部不动'], breathing: ['通常自然呼吸，按工作人员指令为准'],
    duringExam: [section('检查过程中', ['佩戴听力保护。', '扫描时尽量保持不动。', '保持放松并听从工作人员提示。'])], afterExam: [section('检查后', ['工作人员确认完成后再离开检查床。'])], source: mrSources,
  },
  {
    id: 'mri-plain-spine', modality: 'MRI', subtype: 'MRI平扫', bodyPart: '脊柱', displayName: '脊柱 MRI 平扫',
    summary: 'MRI 无电离辐射，但必须完成 MR 安全筛查并在扫描时保持身体位置。', beforeExam: [section('安全准备', ['完成植入物、金属异物和电子物品筛查。'])], dayOfExam: [section('检查体验', ['会听到规律性较大声音，并提供听力保护。'])],
    metalRemoval: mrMetal, metalExplanation: '进入 MR 区域前按工作人员要求处理金属和电子物品。', safetyScreening: mrSafetyQuestions,
    positioning: ['通常仰卧', '保持脊柱和身体位置', '不要自行翻身'], breathing: ['通常自然呼吸，以现场指令为准'],
    duringExam: [section('检查过程中', ['尽量不要改变身体位置。', '有需要可按约定方式联系工作人员。'])], afterExam: [section('检查后', ['听到确认后再起身。'])], source: mrSources,
  },
  {
    id: 'mri-plain-abdomen', modality: 'MRI', subtype: 'MRI平扫', bodyPart: '腹部', displayName: '腹部 MRI 平扫',
    summary: '完成 MR 安全筛查，并准备按设备提示进行多次短时间屏气。', beforeExam: [section('安全与院内准备', ['完成 MR 金属和植入物安全确认。', '饮食要求以本次预约单和院内流程为准。'])], dayOfExam: [section('检查当天', ['按预约要求到达，并告知不能平卧或不能屏气等情况。'])],
    metalRemoval: mrMetal, metalExplanation: '进入 MR 区域前按工作人员要求处理金属和电子物品。', safetyScreening: mrSafetyQuestions,
    positioning: ['通常仰卧', '按要求放置双臂', '保持身体不动'], breathing: ['可能多次进行短时间屏气', '不会屏气请提前告诉工作人员', '实际时长以设备指令为准'],
    duringExam: [section('检查过程中', ['佩戴听力保护。', '按设备指令进行短时间屏气。'])], afterExam: [section('检查后', ['按工作人员提示结束。'])], source: mrSources,
    localPolicyOverride: '当前演示院内规则：饮食准备以本次预约单为准。',
  },
  {
    id: 'mri-plain-joint', modality: 'MRI', subtype: 'MRI平扫', bodyPart: '四肢/关节', displayName: '四肢或关节 MRI 平扫',
    summary: '完成 MR 安全筛查，检查部位会放入专用线圈并需要保持不动。', beforeExam: [section('安全准备', ['完成植入物、金属异物与随身物品筛查。'])], dayOfExam: [section('到达后', ['告知疼痛或无法保持体位的情况。'])],
    metalRemoval: mrMetal, metalExplanation: '进入 MR 区域前按工作人员要求处理金属和电子物品。', safetyScreening: mrSafetyQuestions,
    positioning: ['检查部位放入专用线圈', '保持关节位置', '不要勉强摆位'], breathing: ['通常自然呼吸'], duringExam: [section('检查过程中', ['保持检查部位不动。'])], afterExam: [section('检查后', ['确认完成后再移动。'])], source: mrSources,
  },
  {
    id: 'mri-contrast-abdomen', modality: 'MRI', subtype: 'MRI增强', bodyPart: '腹部', displayName: '腹部 MRI 增强',
    summary: '继承全部 MR 安全筛查，并增加钆对比剂既往反应、肾脏疾病和透析情况确认。', beforeExam: [section('检查前', ['完成全部 MR 安全筛查。', '说明以前 MRI 增强是否发生明显异常反应。', '说明严重肾脏疾病、透析或可能怀孕等情况。'])],
    dayOfExam: [section('检查当天', ['饮食与药物要求以预约单和工作人员说明为准，不要自行停药。'])], metalRemoval: mrMetal,
    metalExplanation: '进入 MR 区域前按工作人员要求处理金属和电子物品。', safetyScreening: mrContrastQuestions,
    positioning: ['通常仰卧', '按要求放置双臂', '保持身体不动'], breathing: ['可能多次短时间屏气', '以设备和工作人员指令为准'],
    duringExam: [section('检查过程中', ['如有明显不适，按约定方式立即联系工作人员。'])], afterExam: [section('检查后', ['按照工作人员要求短暂观察。', '饮水等建议需结合个人情况，以医务人员说明为准。'])],
    source: [...mrSources, ...contrastSources], localPolicyOverride: '当前演示院内规则：饮食和药物管理以本次预约单及工作人员确认结果为准。',
  },
]

export function getExamKnowledge(id: string) {
  return examKnowledge.find((item) => item.id === id) ?? examKnowledge[0]
}
