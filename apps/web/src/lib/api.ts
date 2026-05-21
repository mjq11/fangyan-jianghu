// 方言江湖 - 本地数据 API 层
// 用 mock 数据替代后端调用，保留接口签名方便将来接入真实后端

import {
  provinceRankingData,
  countyRankingData,
  curseEntries,
  statsData,
  getRandomEntry,
  searchEntries,
  getEntriesByProvince,
  getCountyByProvince,
  type CurseEntry,
} from './mock-data';

// 模拟异步响应
const mock = <T>(data: T) => Promise.resolve({ data });

export const curseApi = {
  getAll: (params?: Record<string, string | number>) => {
    let result = [...curseEntries];
    if (params?.province) result = result.filter(e => e.province === params.province);
    if (params?.category) result = result.filter(e => e.category === params.category);
    return mock(result);
  },
  getById: (id: string) => mock(curseEntries.find(e => e.id === id) || null),
  getByCounty: (province: string, city: string, county: string, category?: string) => {
    let result = curseEntries.filter(e => e.province === province && e.city === city && e.county === county);
    if (category) result = result.filter(e => e.category === category);
    return mock(result);
  },
  getRandom: () => mock(getRandomEntry()),
  getStats: () => mock(statsData),
  like: (id: string) => mock({ success: true }),
  create: (data: Record<string, unknown>) => mock({ success: true }),
  search: (keyword: string) => mock(searchEntries(keyword)),
};

export const rankingApi = {
  getCountyRanking: (params?: { page?: number; limit?: number; province?: string }) => {
    let items = [...countyRankingData];
    if (params?.province) {
      items = getCountyByProvince(params.province);
    }
    return mock({ items, total: items.length });
  },
  getProvinceRanking: () => mock(provinceRankingData),
  getCityRanking: (city: string) => mock([]),
};

export const voiceApi = {
  getByEntryId: (entryId: string) => mock([]),
  getById: (id: string) => mock(null),
  like: (id: string) => mock({ success: true }),
};

export const commentApi = {
  getByEntryId: (entryId: string, params?: { page?: number; limit?: number }) => mock({ items: [], total: 0 }),
  create: (data: { entryId?: string; content: string; type?: string }) => mock({ success: true }),
  report: (id: string, data: { reason: string; detail?: string }) => mock({ success: true }),
};

export const authApi = {
  register: (data: { username: string; password: string; phone?: string }) => mock({ success: true }),
  login: (data: { login: string; password: string }) => mock({ success: true }),
  refresh: (refreshToken: string) => mock({ success: true }),
  getMe: () => mock(null),
};