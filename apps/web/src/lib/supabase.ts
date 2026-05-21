import { createClient } from '@supabase/supabase-js';

// Supabase 配置 - 用户需在 Supabase Dashboard 创建项目后填入
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 是否启用 Supabase（有配置则启用，否则 fallback 到本地存储）
export const isSupabaseEnabled = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
  const entry: UserEntry = {
    ...data,
    id: crypto.randomUUID(),
    source: 'user',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from('curse_entries').insert({
      content: data.content,
      pinyin: data.pinyin,
      meaning: data.meaning,
      province: data.province,
      city: data.city,
      county: data.county,
      category: data.category,
      spicy_level: data.spicyLevel,
      scene: data.scene,
      source: 'user',
      status: 'pending',
    });
    if (error) throw error;
  } else {
    // LocalStorage fallback
    const entries = getLocalEntries();
    entries.unshift(entry);
    saveLocalEntries(entries);
  }

  return entry;
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

// 上传语音
export async function uploadVoice(entryId: string, audioBlob: Blob): Promise<string> {
  const fileName = `voices/${entryId}_${Date.now()}.webm`;

  if (supabase) {
    const { error } = await supabase.storage
      .from('voice-recordings')
      .upload(fileName, audioBlob, { contentType: 'audio/webm' });
    if (error) throw error;

    const { data } = supabase.storage.from('voice-recordings').getPublicUrl(fileName);
    return data.publicUrl;
  } else {
    // LocalStorage fallback: 存为 base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const voices = JSON.parse(localStorage.getItem(VOICE_STORAGE_KEY) || '{}');
        voices[entryId] = base64;
        localStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(voices));
        resolve(base64);
      };
      reader.readAsDataURL(audioBlob);
    });
  }
}

// 获取语音 URL
export function getVoiceUrl(entryId: string): string | null {
  if (typeof window === 'undefined') return null;
  const voices = JSON.parse(localStorage.getItem(VOICE_STORAGE_KEY) || '{}');
  return voices[entryId] || null;
}

// DB 结果映射
function mapDbEntry(row: Record<string, unknown>): UserEntry {
  return {
    id: row.id as string,
    content: row.content as string,
    pinyin: (row.pinyin as string) || '',
    meaning: row.meaning as string,
    province: row.province as string,
    city: row.city as string,
    county: row.county as string,
    category: (row.category as UserEntry['category']) || 'CURSE_WORD',
    spicyLevel: (row.spicy_level as number) || 1,
    scene: (row.scene as string) || '',
    source: (row.source as 'user' | 'preset') || 'user',
    status: (row.status as UserEntry['status']) || 'pending',
    voiceUrl: row.voice_url as string | undefined,
    createdAt: row.created_at as string,
  };
}
