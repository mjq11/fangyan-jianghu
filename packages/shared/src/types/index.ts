// API 通用响应格式
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 用户相关类型
export interface User {
  id: string;
  username: string;
  phone?: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  isVip: boolean;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  REVIEWER = 'REVIEWER',
  ADMIN = 'ADMIN',
}

// 骂语词条相关类型
export interface CurseEntry {
  id: string;
  content: string;
  pinyin: string;
  meaning: string;
  province: string;
  city: string;
  county: string;
  dialectGroup?: string;
  category: EntryCategory;
  level: ContentLevel;
  source: 'ai_generated' | 'user_submitted';
  status: EntryStatus;
  spicyLevel: number;
  playCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export enum EntryCategory {
  CURSE_WORD = 'CURSE_WORD',
  COMMON_PHRASE = 'COMMON_PHRASE',
  EXAMPLE = 'EXAMPLE',
}

export enum EntryStatus {
  PENDING = 'PENDING',
  AI_GENERATED = 'AI_GENERATED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ContentLevel {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
}

// 语音相关类型
export interface VoiceRecording {
  id: string;
  entryId: string;
  userId?: string;
  fileUrl: string;
  durationSeconds?: number;
  transcript?: string;
  reviewStatus: ReviewStatus;
  authenticityScore?: number;
  playCount: number;
  likeCount: number;
  createdAt: string;
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  AI_PASSED = 'AI_PASSED',
  AI_REJECTED = 'AI_REJECTED',
  HUMAN_PASSED = 'HUMAN_PASSED',
  HUMAN_REJECTED = 'HUMAN_REJECTED',
}

// 战力榜相关类型
export interface CountyPower {
  id: string;
  provinceCode: string;
  province: string;
  cityCode: string;
  city: string;
  countyCode: string;
  county: string;
  totalEntries: number;
  totalVoices: number;
  avgSpicyLevel: number;
  powerValue: number;
  rank: number;
  updatedAt: string;
}

export interface RankingItem {
  rank: number;
  province: string;
  city: string;
  county: string;
  powerValue: number;
  totalEntries: number;
  totalVoices: number;
  trend?: 'up' | 'down' | 'stable';
}

// 留言相关类型
export interface Comment {
  id: string;
  entryId?: string;
  userId: string;
  content: string;
  type: 'normal' | 'suggestion' | 'correction';
  status: 'published' | 'hidden' | 'deleted';
  replies: number;
  createdAt: string;
  user?: Partial<User>;
}

// 地理位置类型
export interface Region {
  code: string;
  name: string;
  parentCode?: string;
  level: 'province' | 'city' | 'county';
}

// 搜索相关类型
export interface SearchResult {
  type: 'curse' | 'voice' | 'user';
  items: unknown[];
  total: number;
}

export interface SearchQuery {
  q: string;
  type?: 'all' | 'curse' | 'voice' | 'user';
  province?: string;
  city?: string;
  county?: string;
  limit?: number;
  offset?: number;
}