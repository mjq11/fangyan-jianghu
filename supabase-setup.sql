-- 方言江湖 Supabase 建表 SQL
-- 在 Supabase Dashboard → SQL Editor 中执行

-- 创建用户投稿表
CREATE TABLE IF NOT EXISTS curse_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  pinyin TEXT DEFAULT '',
  meaning TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  county TEXT NOT NULL,
  category TEXT DEFAULT 'CURSE_WORD',
  spicy_level INT DEFAULT 1,
  scene TEXT DEFAULT '',
  source TEXT DEFAULT 'user',
  status TEXT DEFAULT 'pending',
  voice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_curse_entries_status ON curse_entries(status);
CREATE INDEX IF NOT EXISTS idx_curse_entries_province ON curse_entries(province);
CREATE INDEX IF NOT EXISTS idx_curse_entries_created_at ON curse_entries(created_at DESC);

-- 开启 RLS（行级安全策略）
ALTER TABLE curse_entries ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取所有词条
CREATE POLICY "允许公开读取" ON curse_entries
  FOR SELECT USING (true);

-- 允许匿名用户插入新词条（投稿）
CREATE POLICY "允许匿名投稿" ON curse_entries
  FOR INSERT WITH CHECK (true);

-- 允许匿名用户更新词条状态（审核操作）
CREATE POLICY "允许更新状态" ON curse_entries
  FOR UPDATE USING (true);

-- 允许匿名用户删除词条（管理操作）
CREATE POLICY "允许删除词条" ON curse_entries
  FOR DELETE USING (true);
