import type { TrainingDefinition } from '../types'

const DX_SOURCE = '《数字X线摄影检查技术专家共识》（中华放射学杂志，2016）'
const CT_SOURCE = '《CT检查技术专家共识》（中华放射学杂志，2016）'
const MR_SOURCE = '《MRI检查技术专家共识》（中华放射学杂志，2016）'

export const trainingData: TrainingDefinition[] = [
  {
    id: 'dr-chest-pa', modality: 'DR', title: '胸部 DR 后前位（PA）怎么配合？', shortTitle: '胸部 DR 后前位', assetKey: 'dr-chest-pa',
    posture: '面向摄影架站立，两足分开，前胸贴近探测器，身体中线对准摄影架中线。', arms: '两手背置于髋部，双肘弯曲向前，两肩内转放平，使肩胛骨尽量移出肺野。', head: '头稍后仰，下颌不要遮挡上胸部。',
    stillness: '深吸气后按提示屏住呼吸，曝光时身体和肩部不能移动。', breathing: '听到指令后深吸气，在吸气末短暂屏气。', cooperation: '曝光结束后再恢复正常呼吸；站立困难请提前告诉工作人员。',
    steps: ['面向摄影架站稳', '前胸贴近探测器', '两手背置于髋部', '双肘向前、肩膀放平', '深吸气后屏住呼吸', '曝光结束后恢复呼吸'], supportsBreathingTrainer: true, source: DX_SOURCE,
  },
  {
    id: 'dr-chest-lateral', modality: 'DR', title: '胸部 DR 侧位怎么配合？', shortTitle: '胸部 DR 侧位', assetKey: 'dr-chest-lateral',
    posture: '侧立于摄影架，被检侧贴近探测器，腋中线对准探测器中线，避免身体旋转。', arms: '双上肢上举并交叉抱头，尽量让手臂离开胸部范围。', head: '头颈保持自然，身体侧面保持正直。',
    stillness: '收腹挺胸，曝光时保持侧位不动。', breathing: '听到指令后深吸气，并在吸气末短暂屏气。', cooperation: '如抬臂困难或疼痛，请在摆位前说明。',
    steps: ['侧身贴近摄影架', '腋中线对准中线', '双上肢上举抱头', '避免身体旋转', '深吸气后屏气', '结束后恢复呼吸'], supportsBreathingTrainer: true, source: DX_SOURCE,
  },
  {
    id: 'dr-limb', modality: 'DR', title: '四肢 DR 基本配合（手掌后前位示例）', shortTitle: '四肢 DR', assetKey: 'dr-limb',
    posture: '以手掌检查为例：坐在摄影台旁，将手掌平贴探测器。其他肢体体位以现场指令为准。', arms: '前臂自然放松，五指自然分开，不要用力僵直。', head: '头部无需特殊摆放，保持舒适即可。',
    stillness: '曝光时检查部位保持不动；疼痛或活动受限时不要勉强摆位。', breathing: '通常自然呼吸。', cooperation: '同一部位可能需要正位、侧位或斜位等不同方向拍摄。',
    steps: ['说明疼痛和活动受限', '去除检查部位饰物', '手掌平贴探测器', '五指自然分开', '曝光时保持不动'], supportsBreathingTrainer: false, source: DX_SOURCE,
  },
  {
    id: 'ct-head', modality: 'CT', title: '颅脑 CT 平扫怎么配合？', shortTitle: '颅脑 CT', assetKey: 'ct-head',
    posture: '仰卧、头先进，身体与检查床长轴保持一致。', arms: '双臂自然放在身体两侧。', head: '头置于头托中央，下颌轻收，两侧外耳孔与床面等距。',
    stillness: '头部保持正中，扫描过程中不要转头。', breathing: '通常平静呼吸。', cooperation: '头部外伤或颈部不适时不要自行调整，请听从工作人员安排。',
    steps: ['仰卧、头先进', '头放入头托中央', '下颌轻收', '双臂放在身体两侧', '扫描时保持头部不动'], supportsBreathingTrainer: false, source: CT_SOURCE,
  },
  {
    id: 'ct-chest', modality: 'CT', title: '胸部 CT 平扫怎么配合？', shortTitle: '胸部 CT', assetKey: 'ct-chest',
    posture: '仰卧、头先进，两腿平伸，身体中线与检查床中线一致。', arms: '两臂上举，肘部弯曲抱头；不能举臂请提前说明。', head: '头枕在凹形头垫上，保持自然正中。',
    stillness: '检查床移动和扫描时身体保持不动。', breathing: '按指令深吸气，在吸气末屏气，并尽量让每次吸气幅度一致。', cooperation: '听到结束提示后恢复正常呼吸。',
    steps: ['仰卧、头先进', '双臂上举抱头', '身体中线对准床中线', '按提示深吸气', '吸气末短暂屏气', '结束后恢复呼吸'], supportsBreathingTrainer: true, source: CT_SOURCE,
  },
  {
    id: 'ct-abdomen', modality: 'CT', title: '腹部 CT 怎么配合？', shortTitle: '腹部 CT', assetKey: 'ct-abdomen',
    posture: '仰卧、头先进，腹部正中线与检查床中线一致。', arms: '双臂通常上举抱头；如无法上举请提前说明。', head: '头部保持自然舒适。',
    stillness: '扫描过程中身体不要扭动。', breathing: '通常按指令在呼气末短暂屏气；不能屏气请提前说明。', cooperation: '饮水、空腹或对比剂准备必须以本院本次预约要求为准。',
    steps: ['仰卧、头先进', '腹部位于床中央', '双臂上举抱头', '保持身体不动', '按提示呼气末屏气', '结束后正常呼吸'], supportsBreathingTrainer: true, source: CT_SOURCE,
  },
  {
    id: 'ct-abdomen-pelvis', modality: 'CT', title: '腹盆部 CT 怎么配合？', shortTitle: '腹盆部 CT', assetKey: 'ct-abdomen-pelvis',
    posture: '仰卧、头先进，身体位于检查床中央。', arms: '双臂通常上举，避免进入扫描范围。', head: '头颈自然放松。',
    stillness: '扫描时保持躯干和骨盆不动。', breathing: '按设备提示平静呼吸或短暂屏气。', cooperation: '膀胱充盈、空腹或对比剂要求以本次预约单和现场指令为准。',
    steps: ['按本次要求完成准备', '仰卧在床中央', '双臂按提示上举', '保持躯干与骨盆不动', '听从呼吸指令'], supportsBreathingTrainer: true, source: CT_SOURCE,
  },
  {
    id: 'mri-head', modality: 'MRI', title: '颅脑 MRI 怎么配合？', shortTitle: '颅脑 MRI', assetKey: 'mri-head',
    posture: '仰卧、头先进，身体位于检查床中央。', arms: '双臂自然放在身体两侧或按工作人员提示摆放。', head: '头部放入头线圈，定位中心对准眉间与线圈中心。',
    stillness: '扫描时间较长，头部尽量不要移动。', breathing: '通常平静呼吸。', cooperation: '佩戴听力保护；幽闭不适或不能保持不动时请提前说明。',
    steps: ['完成 MRI 安全确认', '仰卧、头先进', '头部放入头线圈', '佩戴听力保护', '保持头部不动', '不适时按约定方式联系工作人员'], supportsBreathingTrainer: false, source: MR_SOURCE,
  },
  {
    id: 'mri-spine', modality: 'MRI', title: '脊柱 MRI 怎么配合？', shortTitle: '脊柱 MRI', assetKey: 'mri-spine',
    posture: '通常仰卧、头先进，脊柱区域对准专用线圈中心。', arms: '双臂自然放置，避免影响舒适和稳定。', head: '颈椎检查时头颈保持正中；腰椎检查时保持自然舒适。',
    stillness: '扫描时保持头颈、躯干和脊柱位置不变。', breathing: '通常平静呼吸；特殊序列按设备指令配合。', cooperation: '腰椎检查前是否排尿等准备以本次预约要求为准。',
    steps: ['完成 MRI 安全确认', '仰卧、头先进', '身体对准线圈中心', '佩戴听力保护', '保持头颈和躯干不动'], supportsBreathingTrainer: false, source: MR_SOURCE,
  },
  {
    id: 'mri-abdomen', modality: 'MRI', title: '腹部 MRI 怎么配合？', shortTitle: '腹部 MRI', assetKey: 'mri-abdomen',
    posture: '仰卧、头先进，体部线圈覆盖腹部，定位中心位于检查区域。', arms: '双臂按工作人员提示放置，通常尽量离开腹部扫描范围。', head: '头颈自然放松。',
    stillness: '身体保持不动，多次扫描之间也不要自行改变位置。', breathing: '可能使用呼吸触发，也可能多次要求短暂屏气。', cooperation: '不会屏气、不能平卧或存在幽闭不适时请提前说明。',
    steps: ['完成 MRI 安全确认', '按本次要求完成空腹准备', '仰卧并放置体部线圈', '佩戴听力保护', '按提示短暂屏气', '结束提示后恢复呼吸'], supportsBreathingTrainer: true, source: MR_SOURCE,
  },
  {
    id: 'mri-joint', modality: 'MRI', title: '关节 MRI 怎么配合？（膝关节示例）', shortTitle: '四肢/关节 MRI', assetKey: 'mri-joint',
    posture: '以膝关节为例：仰卧、头先进或足先进，被检膝放入专用线圈。', arms: '双臂自然放置，不触碰检查线圈。', head: '头部保持舒适自然。',
    stillness: '膝部放松并保持不动；标准摆位可轻度屈曲约 10°～15°。', breathing: '通常平静呼吸。', cooperation: '疼痛、肿胀或无法维持体位时请提前说明，不要勉强。',
    steps: ['完成 MRI 安全确认', '说明疼痛和活动受限', '被检膝放入专用线圈', '膝部轻度屈曲并放松', '扫描时保持关节不动'], supportsBreathingTrainer: false, source: MR_SOURCE,
  },
]

export const getTraining = (id: string) => trainingData.find((item) => item.id === id) ?? trainingData[0]
