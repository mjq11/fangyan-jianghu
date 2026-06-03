// 方言江湖 - 本地 Mock 数据
// 用于 GitHub Pages 静态部署（无后端时）
import { extraCurses } from './extra-curses';

export interface CurseEntry {
  id: string;
  content: string;
  pinyin: string;
  meaning: string;
  category: 'CURSE_WORD' | 'COMMON_PHRASE' | 'EXAMPLE';
  spicyLevel: number; // 1-5
  province: string;
  city: string;
  county: string;
  likes: number;
  scene?: string;
}

export interface ProvinceData {
  province: string;
  rank: number;
  totalEntries: number;
  totalVoices: number;
  totalPower: number;
  representative: string; // 代表骂语
}

export interface CountyData {
  rank: number;
  province: string;
  city: string;
  county: string;
  totalEntries: number;
  totalVoices: number;
  powerValue: number;
}

// ===== 省级排行数据 =====
export const provinceRankingData: ProvinceData[] = [
  { province: '四川', rank: 1, totalEntries: 342, totalVoices: 156, totalPower: 98.7, representative: '龟儿子' },
  { province: '广东', rank: 2, totalEntries: 298, totalVoices: 134, totalPower: 95.2, representative: '扑街' },
  { province: '东北三省', rank: 3, totalEntries: 276, totalVoices: 128, totalPower: 93.8, representative: '你瞅啥' },
  { province: '湖南', rank: 4, totalEntries: 245, totalVoices: 112, totalPower: 89.4, representative: '宝里宝气' },
  { province: '陕西', rank: 5, totalEntries: 234, totalVoices: 98, totalPower: 87.6, representative: '瓜怂' },
  { province: '湖北', rank: 6, totalEntries: 223, totalVoices: 95, totalPower: 85.3, representative: '苕货' },
  { province: '重庆', rank: 7, totalEntries: 218, totalVoices: 102, totalPower: 84.1, representative: '哈儿' },
  { province: '河南', rank: 8, totalEntries: 205, totalVoices: 87, totalPower: 82.5, representative: '中不中' },
  { province: '山东', rank: 9, totalEntries: 198, totalVoices: 82, totalPower: 80.9, representative: '二逼青年' },
  { province: '福建', rank: 10, totalEntries: 187, totalVoices: 76, totalPower: 78.4, representative: '三八' },
  { province: '江西', rank: 11, totalEntries: 176, totalVoices: 71, totalPower: 76.2, representative: '哈卵' },
  { province: '贵州', rank: 12, totalEntries: 168, totalVoices: 65, totalPower: 74.8, representative: '哈宝' },
  { province: '云南', rank: 13, totalEntries: 162, totalVoices: 62, totalPower: 73.1, representative: '瓜兮兮' },
  { province: '安徽', rank: 14, totalEntries: 155, totalVoices: 58, totalPower: 71.5, representative: '脑子进水' },
  { province: '浙江', rank: 15, totalEntries: 148, totalVoices: 55, totalPower: 69.8, representative: '十三点' },
  { province: '江苏', rank: 16, totalEntries: 142, totalVoices: 52, totalPower: 68.3, representative: '二五' },
  { province: '山西', rank: 17, totalEntries: 136, totalVoices: 49, totalPower: 66.7, representative: '圪蹴' },
  { province: '甘肃', rank: 18, totalEntries: 128, totalVoices: 45, totalPower: 64.2, representative: '怂怂' },
  { province: '广西', rank: 19, totalEntries: 122, totalVoices: 42, totalPower: 62.8, representative: '戆鸠' },
  { province: '河北', rank: 20, totalEntries: 118, totalVoices: 39, totalPower: 61.1, representative: '棒槌' },
  { province: '上海', rank: 21, totalEntries: 112, totalVoices: 48, totalPower: 59.6, representative: '小赤佬' },
  { province: '北京', rank: 22, totalEntries: 108, totalVoices: 45, totalPower: 58.2, representative: '孙子' },
  { province: '天津', rank: 23, totalEntries: 102, totalVoices: 38, totalPower: 56.5, representative: '嘛玩意儿' },
  { province: '海南', rank: 24, totalEntries: 95, totalVoices: 32, totalPower: 54.1, representative: '死鬼' },
  { province: '新疆', rank: 25, totalEntries: 88, totalVoices: 28, totalPower: 52.3, representative: '阿达西' },
  { province: '内蒙古', rank: 26, totalEntries: 82, totalVoices: 25, totalPower: 50.8, representative: '脑包' },
  { province: '宁夏', rank: 27, totalEntries: 75, totalVoices: 22, totalPower: 48.4, representative: '尔怂' },
  { province: '辽宁', rank: 28, totalEntries: 165, totalVoices: 72, totalPower: 46.9, representative: '虎' },
  { province: '吉林', rank: 29, totalEntries: 132, totalVoices: 56, totalPower: 45.2, representative: '彪' },
  { province: '黑龙江', rank: 30, totalEntries: 145, totalVoices: 64, totalPower: 44.6, representative: '得瑟' },
];

// ===== 县级排行数据 =====
export const countyRankingData: CountyData[] = [
  { rank: 1, province: '四川', city: '成都', county: '青羊区', totalEntries: 68, totalVoices: 32, powerValue: 96.5 },
  { rank: 2, province: '广东', city: '广州', county: '天河区', totalEntries: 62, totalVoices: 28, powerValue: 94.2 },
  { rank: 3, province: '四川', city: '自贡', county: '自流井区', totalEntries: 58, totalVoices: 26, powerValue: 92.8 },
  { rank: 4, province: '湖南', city: '长沙', county: '芙蓉区', totalEntries: 55, totalVoices: 24, powerValue: 91.1 },
  { rank: 5, province: '陕西', city: '西安', county: '碑林区', totalEntries: 52, totalVoices: 22, powerValue: 89.7 },
  { rank: 6, province: '重庆', city: '重庆', county: '渝中区', totalEntries: 50, totalVoices: 23, powerValue: 88.3 },
  { rank: 7, province: '湖北', city: '武汉', county: '武昌区', totalEntries: 48, totalVoices: 20, powerValue: 86.9 },
  { rank: 8, province: '东北三省', city: '哈尔滨', county: '道里区', totalEntries: 46, totalVoices: 19, powerValue: 85.4 },
  { rank: 9, province: '河南', city: '郑州', county: '金水区', totalEntries: 44, totalVoices: 18, powerValue: 84.1 },
  { rank: 10, province: '山东', city: '济南', county: '历城区', totalEntries: 42, totalVoices: 17, powerValue: 82.6 },
  { rank: 11, province: '四川', city: '内江', county: '市中区', totalEntries: 40, totalVoices: 16, powerValue: 81.2 },
  { rank: 12, province: '广东', city: '佛山', county: '禅城区', totalEntries: 39, totalVoices: 15, powerValue: 79.8 },
  { rank: 13, province: '福建', city: '厦门', county: '思明区', totalEntries: 38, totalVoices: 15, powerValue: 78.5 },
  { rank: 14, province: '江西', city: '南昌', county: '东湖区', totalEntries: 36, totalVoices: 14, powerValue: 77.1 },
  { rank: 15, province: '贵州', city: '贵阳', county: '南明区', totalEntries: 35, totalVoices: 13, powerValue: 75.8 },
  { rank: 16, province: '上海', city: '上海', county: '黄浦区', totalEntries: 34, totalVoices: 16, powerValue: 74.5 },
  { rank: 17, province: '北京', city: '北京', county: '东城区', totalEntries: 33, totalVoices: 15, powerValue: 73.2 },
  { rank: 18, province: '浙江', city: '杭州', county: '西湖区', totalEntries: 32, totalVoices: 12, powerValue: 71.9 },
  { rank: 19, province: '云南', city: '昆明', county: '五华区', totalEntries: 30, totalVoices: 11, powerValue: 70.5 },
  { rank: 20, province: '天津', city: '天津', county: '和平区', totalEntries: 29, totalVoices: 12, powerValue: 69.2 },
];

// ===== 骂语词条数据 =====
export const curseEntries: CurseEntry[] = [
  // 四川
  { id: '1', content: '龟儿子', pinyin: 'guī ér zi', meaning: '四川最经典的骂人词，表达不满或惊讶，语气可轻可重', category: 'CURSE_WORD', spicyLevel: 4, province: '四川', city: '成都', county: '青羊区', likes: 2341, scene: '日常吵架' },
  { id: '2', content: '瓜娃子', pinyin: 'guā wá zi', meaning: '形容人傻、蠢、不开窍', category: 'CURSE_WORD', spicyLevel: 3, province: '四川', city: '成都', county: '青羊区', likes: 1987, scene: '嘲笑别人' },
  { id: '3', content: '锤子', pinyin: 'chuí zi', meaning: '表示否定，"才怪""不可能"的意思', category: 'COMMON_PHRASE', spicyLevel: 2, province: '四川', city: '自贡', county: '自流井区', likes: 1654, scene: '否定反驳' },
  { id: '4', content: '瓜皮', pinyin: 'guā pí', meaning: '傻瓜、笨蛋的意思', category: 'CURSE_WORD', spicyLevel: 3, province: '四川', city: '内江', county: '市中区', likes: 1432, scene: '嘲讽讥讽' },
  { id: '5', content: '你龟儿的脑壳是不是被门夹了', pinyin: 'nǐ guī ér de nǎo ké shì bú shì bèi mén jiā le', meaning: '质问对方是不是脑子有问题', category: 'EXAMPLE', spicyLevel: 5, province: '四川', city: '成都', county: '青羊区', likes: 3210, scene: '激烈争吵' },
  { id: '6', content: '日白', pinyin: 'rì bái', meaning: '胡说八道、吹牛', category: 'COMMON_PHRASE', spicyLevel: 2, province: '四川', city: '自贡', county: '自流井区', likes: 1123, scene: '拆穿谎话' },

  // 广东
  { id: '7', content: '扑街', pinyin: 'pū jiē', meaning: '跌倒在街上，引申为骂人去死', category: 'CURSE_WORD', spicyLevel: 4, province: '广东', city: '广州', county: '天河区', likes: 2876, scene: '表达愤怒' },
  { id: '8', content: '冚家铲', pinyin: 'kǎn jiā chǎn', meaning: '全家完蛋，广东最毒骂语之一', category: 'CURSE_WORD', spicyLevel: 5, province: '广东', city: '广州', county: '天河区', likes: 1543, scene: '极度愤怒' },
  { id: '9', content: '戆鸠', pinyin: 'gàng jiū', meaning: '形容人很蠢、很笨', category: 'CURSE_WORD', spicyLevel: 4, province: '广东', city: '佛山', county: '禅城区', likes: 1876, scene: '嘲笑别人' },
  { id: '10', content: '收皮啦', pinyin: 'shōu pí la', meaning: '闭嘴，别说了', category: 'COMMON_PHRASE', spicyLevel: 3, province: '广东', city: '广州', county: '天河区', likes: 1654, scene: '制止他人' },

  // 东北
  { id: '11', content: '你瞅啥', pinyin: 'nǐ chǒu shá', meaning: '挑衅用语，东北名场面开场白', category: 'COMMON_PHRASE', spicyLevel: 4, province: '东北三省', city: '哈尔滨', county: '道里区', likes: 3456, scene: '街头对峙' },
  { id: '12', content: '瞅你咋地', pinyin: 'chǒu nǐ zǎ dì', meaning: '"你瞅啥"的经典回应', category: 'COMMON_PHRASE', spicyLevel: 4, province: '东北三省', city: '哈尔滨', county: '道里区', likes: 3201, scene: '街头对峙' },
  { id: '13', content: '虎', pinyin: 'hǔ', meaning: '形容人傻、莽撞、不着调', category: 'CURSE_WORD', spicyLevel: 3, province: '辽宁', city: '沈阳', county: '沈河区', likes: 2134, scene: '日常吐槽' },
  { id: '14', content: '彪', pinyin: 'biāo', meaning: '比"虎"更严重，形容人极其愚蠢', category: 'CURSE_WORD', spicyLevel: 4, province: '吉林', city: '长春', county: '朝阳区', likes: 1987, scene: '日常吐槽' },
  { id: '15', content: '得瑟', pinyin: 'dè se', meaning: '显摆、嘚瑟，贬义', category: 'COMMON_PHRASE', spicyLevel: 2, province: '黑龙江', city: '哈尔滨', county: '南岗区', likes: 1654, scene: '教训他人' },

  // 湖南
  { id: '16', content: '宝里宝气', pinyin: 'bǎo lǐ bǎo qì', meaning: '形容人傻呆呆的，不精明', category: 'CURSE_WORD', spicyLevel: 3, province: '湖南', city: '长沙', county: '芙蓉区', likes: 2456, scene: '嘲笑别人' },
  { id: '17', content: '蠢死哒', pinyin: 'chǔn sǐ dā', meaning: '蠢死了的湖南话表达', category: 'CURSE_WORD', spicyLevel: 3, province: '湖南', city: '长沙', county: '芙蓉区', likes: 1876, scene: '日常吐槽' },
  { id: '18', content: '你港的话鬼都不信', pinyin: 'nǐ gǎng de huà guǐ dōu bù xìn', meaning: '你说的话鬼都不信', category: 'EXAMPLE', spicyLevel: 3, province: '湖南', city: '长沙', county: '芙蓉区', likes: 1543, scene: '拆穿谎话' },

  // 陕西
  { id: '19', content: '瓜怂', pinyin: 'guā sǒng', meaning: '傻瓜、笨蛋，陕西经典骂词', category: 'CURSE_WORD', spicyLevel: 4, province: '陕西', city: '西安', county: '碑林区', likes: 2345, scene: '日常骂人' },
  { id: '20', content: '额滴神啊', pinyin: 'é dī shén a', meaning: '我的天啊，表达震惊', category: 'COMMON_PHRASE', spicyLevel: 1, province: '陕西', city: '西安', county: '碑林区', likes: 1987, scene: '表达惊讶' },

  // 湖北
  { id: '21', content: '苕货', pinyin: 'sháo huò', meaning: '傻子、笨蛋，苕=红薯，引申为蠢', category: 'CURSE_WORD', spicyLevel: 3, province: '湖北', city: '武汉', county: '武昌区', likes: 2123, scene: '日常骂人' },
  { id: '22', content: '个板马', pinyin: 'gè bǎn mǎ', meaning: '湖北经典语气词，类似"他妈的"', category: 'CURSE_WORD', spicyLevel: 5, province: '湖北', city: '武汉', county: '武昌区', likes: 1876, scene: '表达愤怒' },

  // 重庆
  { id: '23', content: '哈儿', pinyin: 'hǎ ér', meaning: '傻子、白痴', category: 'CURSE_WORD', spicyLevel: 3, province: '重庆', city: '重庆', county: '渝中区', likes: 1987, scene: '日常吐槽' },
  { id: '24', content: '你莫挨老子发火', pinyin: 'nǐ mò āi lǎo zi fā huǒ', meaning: '你别惹我发火', category: 'EXAMPLE', spicyLevel: 4, province: '重庆', city: '重庆', county: '渝中区', likes: 2345, scene: '警告威胁' },

  // 上海
  { id: '25', content: '小赤佬', pinyin: 'xiǎo chì lǎo', meaning: '小鬼、小混蛋', category: 'CURSE_WORD', spicyLevel: 4, province: '上海', city: '上海', county: '黄浦区', likes: 2678, scene: '骂小辈' },
  { id: '26', content: '十三点', pinyin: 'shí sān diǎn', meaning: '形容人神经质、不着调', category: 'CURSE_WORD', spicyLevel: 3, province: '浙江', city: '杭州', county: '西湖区', likes: 1876, scene: '嘲笑别人' },

  // 北京
  { id: '27', content: '丫的', pinyin: 'yā de', meaning: '丫头养的，北京经典骂语', category: 'CURSE_WORD', spicyLevel: 4, province: '北京', city: '北京', county: '东城区', likes: 2345, scene: '日常骂人' },
  { id: '28', content: '二百五', pinyin: 'èr bǎi wǔ', meaning: '形容人脑子不好使', category: 'CURSE_WORD', spicyLevel: 2, province: '北京', city: '北京', county: '东城区', likes: 1654, scene: '嘲笑别人' },

  // 河南
  { id: '29', content: '弄啥嘞', pinyin: 'nòng shá lei', meaning: '你在干什么呢，带质问语气', category: 'COMMON_PHRASE', spicyLevel: 2, province: '河南', city: '郑州', county: '金水区', likes: 2123, scene: '质问他人' },
  { id: '30', content: '真中', pinyin: 'zhēn zhōng', meaning: '讽刺对方"你真行啊"', category: 'COMMON_PHRASE', spicyLevel: 2, province: '河南', city: '郑州', county: '金水区', likes: 1543, scene: '反讽' },

  // 福建
  { id: '31', content: '三八', pinyin: 'sān bā', meaning: '形容人八卦、多嘴', category: 'CURSE_WORD', spicyLevel: 3, province: '福建', city: '厦门', county: '思明区', likes: 1876, scene: '嘲笑别人' },
  { id: '32', content: '死鬼', pinyin: 'sǐ guǐ', meaning: '骂人死鬼，语气可重可轻', category: 'CURSE_WORD', spicyLevel: 3, province: '海南', city: '海口', county: '龙华区', likes: 1234, scene: '夫妻吵架' },

  // 更多
  { id: '33', content: '嘛玩意儿', pinyin: 'má wán yìr', meaning: '什么东西，表达不屑', category: 'COMMON_PHRASE', spicyLevel: 2, province: '天津', city: '天津', county: '和平区', likes: 1876, scene: '表达不屑' },
  { id: '34', content: '棒槌', pinyin: 'bàng chuí', meaning: '形容人笨、蠢、不懂事', category: 'CURSE_WORD', spicyLevel: 3, province: '河北', city: '石家庄', county: '长安区', likes: 1432, scene: '骂人蠢' },
  { id: '35', content: '瓜兮兮', pinyin: 'guā xī xī', meaning: '傻乎乎的，云南方言', category: 'CURSE_WORD', spicyLevel: 2, province: '云南', city: '昆明', county: '五华区', likes: 1234, scene: '嘲笑别人' },
  { id: '36', content: '哈宝', pinyin: 'hā bǎo', meaning: '傻子、呆子，贵州方言', category: 'CURSE_WORD', spicyLevel: 3, province: '贵州', city: '贵阳', county: '南明区', likes: 1123, scene: '嘲笑别人' },
  { id: '37', content: '脑包', pinyin: 'nǎo bāo', meaning: '脑袋有包，形容人蠢', category: 'CURSE_WORD', spicyLevel: 3, province: '内蒙古', city: '呼和浩特', county: '赛罕区', likes: 987, scene: '骂人蠢' },
  { id: '38', content: '哈卵', pinyin: 'hā luǎn', meaning: '傻瓜、蠢蛋，江西方言', category: 'CURSE_WORD', spicyLevel: 4, province: '江西', city: '南昌', county: '东湖区', likes: 1654, scene: '骂人蠢' },
  { id: '39', content: '怂怂', pinyin: 'sǒng sǒng', meaning: '没用、胆小的人', category: 'CURSE_WORD', spicyLevel: 3, province: '甘肃', city: '兰州', county: '城关区', likes: 1123, scene: '嘲笑胆小' },
  { id: '40', content: '尔怂', pinyin: 'ěr sǒng', meaning: '你个怂货', category: 'CURSE_WORD', spicyLevel: 4, province: '宁夏', city: '银川', county: '兴庆区', likes: 876, scene: '骂人胆小' },
  ...extraCurses,
];

// ===== 统计数据 =====
export const statsData = {
  totalEntries: 5680,
  totalVoices: 2341,
  totalProvinces: 30,
  totalUsers: 23456,
  byProvince: provinceRankingData,
};

// ===== 工具函数 =====
export function getRandomEntry(): CurseEntry {
  return curseEntries[Math.floor(Math.random() * curseEntries.length)];
}

export function getEntriesByProvince(province: string): CurseEntry[] {
  return curseEntries.filter(e => e.province === province);
}

export function getCountyByProvince(province: string): CountyData[] {
  return countyRankingData.filter(c => c.province === province);
}

// 获取 localStorage 中已审核通过的用户投稿，并转为 CurseEntry 格式
function getApprovedUserEntries(): CurseEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(localStorage.getItem('fangyan_user_entries') || '[]');
    return raw
      .filter((e: Record<string, unknown>) => e.status === 'approved')
      .map((e: Record<string, unknown>) => ({
        id: `user_${e.id}`,
        content: (e.content as string) || '',
        pinyin: (e.pinyin as string) || '',
        meaning: (e.meaning as string) || '',
        category: (e.category as CurseEntry['category']) || 'COMMON_PHRASE',
        spicyLevel: (e.spicyLevel as number) || 1,
        province: (e.province as string) || '',
        city: (e.city as string) || '',
        county: (e.county as string) || '',
        likes: 0,
        scene: (e.scene as string) || '',
      }));
  } catch {
    return [];
  }
}

// 合并预置数据和已审核通过的用户投稿
export function getAllSearchableEntries(): CurseEntry[] {
  return [...curseEntries, ...getApprovedUserEntries()];
}

export function searchEntries(keyword: string): CurseEntry[] {
  const kw = keyword.toLowerCase();
  const all = getAllSearchableEntries();
  return all.filter(e =>
    e.content.includes(kw) ||
    e.meaning.includes(kw) ||
    e.province.includes(kw) ||
    e.city.includes(kw) ||
    e.county.includes(kw)
  );
}
