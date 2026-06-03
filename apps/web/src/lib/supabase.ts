import { createClient } from '@supabase/supabase-js';

// Supabase 配置（anon key 是公开的 public key，安全性由 RLS 策略保障）
const supabaseUrl = 'https://hgbuocbjdcxsmrrviwnv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnYnVvY2JqZGN4c21ycnZpd252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjgyMDYsImV4cCI6MjA5NjA0NDIwNn0.XbQw7pLri8peq93XKrc5h2VM7DlpXuQYznIH5P2PTm4';

// Supabase 已启用
export const isSupabaseEnabled = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ===== 本地存储 fallback（无 Supabase 时用 localStorage） =====
const STORAGE_KEY = 'fangyan_user_entries';
const VOICE_STORAGE_KEY = 'fangyan_voices';

export interface UserEntry {
  id: string;
  content: string;
  pinyin: string;
  meaning: string;
  province: string;
  city: string;
  county: string;
  category: 'CURSE_WORD' | 'COMMON_PHRASE' | 'EXAMPLE';
  spicyLevel: number;
  scene: string;
  source: 'user' | 'preset';
  status: 'pending' | 'approved' | 'rejected';
  voiceUrl?: string;
  createdAt: string;
}

// 读取本地投稿
function getLocalEntries(): UserEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

// 保存本地投稿
function saveLocalEntries(entries: UserEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// ===== 公共 API =====

// 提交新词条
export async function submitEntry(data: Omit<UserEntry, 'id' | 'source' | 'status' | 'createdAt'>): Promise<UserEntry> {
  const { data: inserted, error } = await supabase
    .from('curse_entries')
    .insert({
      content: data.content,
      pinyin: data.pinyin,
      meaning: data.meaning,
      province: data.province,
      city: data.city,
      county: data.county || '',
      category: data.category,
      spicy_level: data.spicyLevel,
      scene: data.scene,
      source: 'user',
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  return mapDbEntry(inserted);
}

// 获取所有投稿（含 pending）
export async function getAllEntries(): Promise<UserEntry[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('curse_entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapDbEntry);
  }
  return getLocalEntries();
}

// 获取待审核投稿
export async function getPendingEntries(): Promise<UserEntry[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('curse_entries')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapDbEntry);
  }
  return getLocalEntries().filter(e => e.status === 'pending');
}

// 审核通过/拒绝
export async function reviewEntry(id: string, status: 'approved' | 'rejected') {
  if (supabase) {
    const { error } = await supabase
      .from('curse_entries')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  } else {
    const entries = getLocalEntries();
    const idx = entries.findIndex(e => e.id === id);
    if (idx >= 0) { entries[idx].status = status; saveLocalEntries(entries); }
  }
}

// 删除词条
export async function deleteEntry(id: string) {
  if (supabase) {
    const { error } = await supabase.from('curse_entries').delete().eq('id', id);
    if (error) throw error;
  } else {
    const entries = getLocalEntries().filter(e => e.id !== id);
    saveLocalEntries(entries);
  }
}

// 上传语音（转 base64 存入数据库 voice_url 字段）
export async function uploadVoice(entryId: string, audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        // 将 base64 音频直接存入数据库
        const { error } = await supabase
          .from('curse_entries')
          .update({ voice_url: base64 })
          .eq('id', entryId);
        if (error) throw error;
        resolve(base64);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('读取音频文件失败'));
    reader.readAsDataURL(audioBlob);
  });
}

// 获取语音 URL
export function getVoiceUrl(entryId: string): string | null {
  if (typeof window === 'undefined') return null;
  const voices = JSON.parse(localStorage.getItem(VOICE_STORAGE_KEY) || '{}');
  return voices[entryId] || null;
}

// DB 结果映射（所有字段都做空值防护，防止 null 导致 .includes() 报错）
function mapDbEntry(row: Record<string, unknown>): UserEntry {
  return {
    id: row.id as string,
    content: (row.content as string) || '',
    pinyin: (row.pinyin as string) || '',
    meaning: (row.meaning as string) || '',
    province: (row.province as string) || '',
    city: (row.city as string) || '',
    county: (row.county as string) || '',
    category: (row.category as UserEntry['category']) || 'CURSE_WORD',
    spicyLevel: (row.spicy_level as number) || 1,
    scene: (row.scene as string) || '',
    source: (row.source as 'user' | 'preset') || 'user',
    status: (row.status as UserEntry['status']) || 'pending',
    voiceUrl: row.voice_url as string | undefined,
    createdAt: (row.created_at as string) || '',
  };
}

// 获取已审核通过的投稿（供搜索使用）
export async function getApprovedEntries(): Promise<UserEntry[]> {
  const { data, error } = await supabase
    .from('curse_entries')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('获取已审核词条失败', error);
    return [];
  }
  return (data || []).map(mapDbEntry);
}

