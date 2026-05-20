// 方言分区
export const DIALECT_GROUPS = [
  '东北官话',
  '华北官话',
  '中原官话',
  '兰银官话',
  '西南官话',
  '江淮官话',
  '吴语',
  '湘语',
  '赣语',
  '闽语',
  '粤语',
  '客家话',
  '晋语',
] as const;

// 毒性指数等级
export const SPICY_LEVELS = [
  { level: 1, label: '微辣', color: '#fef3c7' },
  { level: 2, label: '小辣', color: '#fde68a' },
  { level: 3, label: '中辣', color: '#fcd34d' },
  { level: 4, label: '大辣', color: '#fb923c' },
  { level: 5, label: '爆辣', color: '#ef4444' },
] as const;

// 内容等级
export const CONTENT_LEVELS = {
  GREEN: {
    label: '温和表达',
    description: '全员可见',
    color: '#22c55e',
  },
  YELLOW: {
    label: '较粗俗',
    description: '需登录+年龄验证',
    color: '#eab308',
  },
  RED: {
    label: '高度粗俗',
    description: 'VIP/研究者可见',
    color: '#ef4444',
  },
} as const;

// 审核状态
export const REVIEW_STATUS = {
  PENDING: { label: '待审核', color: '#f59e0b' },
  AI_PASSED: { label: 'AI通过', color: '#22c55e' },
  AI_REJECTED: { label: 'AI拒绝', color: '#ef4444' },
  HUMAN_PASSED: { label: '人工通过', color: '#22c55e' },
  HUMAN_REJECTED: { label: '人工拒绝', color: '#ef4444' },
} as const;

// 分页默认值
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

// 排行榜配置
export const RANKING_CONFIG = {
  WEIGHT_ENTRIES: 0.3,       // 词条丰富度权重
  WEIGHT_VOICES: 0.25,       // 语音贡献数权重
  WEIGHT_RATINGS: 0.25,       // 用户评分均值权重
  WEIGHT_SPREAD: 0.2,         // 传播指数权重
} as const;

// 支持的音频格式
export const AUDIO_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'] as const;

// 最大音频时长（秒）
export const MAX_AUDIO_DURATION = 30 as const;