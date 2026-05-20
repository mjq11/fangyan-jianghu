/**
 * 计算战力值
 * 战力值 = 词条丰富度(30%) + 语音贡献数(25%) + 用户评分均值(25%) + 传播指数(20%)
 */
export function calculatePowerValue(params: {
  entries: number;
  maxEntries: number;
  voices: number;
  maxVoices: number;
  avgRating: number;
  spreadIndex: number;
}): number {
  const { entries, maxEntries, voices, maxVoices, avgRating, spreadIndex } = params;

  const entryRichness = maxEntries > 0 ? (entries / maxEntries) * 100 : 0;
  const voiceRatio = maxVoices > 0 ? (voices / maxVoices) * 100 : 0;

  return (
    entryRichness * 0.3 +
    voiceRatio * 0.25 +
    avgRating * 0.25 +
    spreadIndex * 0.2
  );
}

/**
 * 格式化数字（用于显示）
 */
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
}

/**
 * 截断文本
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * 验证手机号
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 验证邮箱
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 清理字符串（去除空白）
 */
export function cleanString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * 拼音转数字（用于排序）
 */
export function pinyinToNumber(pinyin: string): number {
  const pinyinMap: Record<string, number> = {
    a: 1, o: 2, e: 3, i: 4, u: 5, v: 6,
    b: 7, p: 8, m: 9, f: 10,
    d: 11, t: 12, n: 13, l: 14,
    g: 15, k: 16, h: 17,
    j: 18, q: 19, x: 20,
    zh: 21, ch: 22, sh: 23,
    r: 24, z: 25, c: 26, s: 27,
    y: 28, w: 29,
  };

  let result = 0;
  for (const char of pinyin.toLowerCase()) {
    result += pinyinMap[char] || 0;
  }
  return result;
}