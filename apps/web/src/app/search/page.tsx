'use client';

import { useState, Suspense, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { searchEntries, type CurseEntry } from '@/lib/mock-data';
import { getApprovedEntries } from '@/lib/supabase';

function SearchContent() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<CurseEntry[]>([]);
  const [searched, setSearched] = useState(false);

  // 异步搜索：mock 数据 + Supabase 已审核数据
  const doSearch = useCallback(async (kw: string) => {
    if (!kw.trim()) return;
    setKeyword(kw);
    setSearched(true);

    // 先显示 mock 数据结果
    const mockResults = searchEntries(kw);
    setResults(mockResults);

    // 再异步查询 Supabase 已审核数据并合并
    try {
      const approvedEntries = await getApprovedEntries();
      const kwLower = kw.toLowerCase();
      const dbResults = approvedEntries
        .filter(e =>
          e.content.includes(kwLower) ||
          e.meaning.includes(kwLower) ||
          e.province.includes(kwLower) ||
          e.city.includes(kwLower) ||
          e.county.includes(kwLower)
        )
        .map(e => ({
          ...e,
          id: `db_${e.id}`,
          likes: 0,
        }));

      // 合并去重（按 content 去重）
      const existingContents = new Set(mockResults.map(r => r.content));
      const uniqueDbResults = dbResults.filter(r => !existingContents.has(r.content));
      setResults([...mockResults, ...uniqueDbResults]);
    } catch (err) {
      console.error('查询云端数据失败', err);
    }
  }, []);

  // URL 携带 ?q=参数 时自动搜索
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      doSearch(q);
    }
  }, [searchParams, doSearch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={(e) => { e.preventDefault(); doSearch(keyword); }} className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-800/80 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-lg"
            placeholder="搜索方言词条..."
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {['四川', '广东', '东北', '湖南', '上海', '北京', '重庆'].map((kw) => (
            <button key={kw} type="button" onClick={() => doSearch(kw)}
              className="px-3 py-1 text-xs bg-gray-800 text-gray-400 rounded-full hover:bg-orange-500/20 hover:text-orange-400 transition-all">
              🔥 {kw}
            </button>
          ))}
        </div>
      </form>

      {searched && (
        <div className="max-w-2xl mx-auto">
          {results.length > 0 ? (
            <>
              <p className="text-gray-400 mb-4">找到 <span className="text-orange-400 font-bold">{results.length}</span> 条结果</p>
              <div className="space-y-3">
                {results.map((entry) => (
                  <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="curse-card">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{entry.content}</h3>
                      <span>{'🌶️'.repeat(entry.spicyLevel)}</span>
                    </div>
                    <p className="text-orange-300/60 text-sm mb-1">{entry.pinyin}</p>
                    <p className="text-gray-400 text-sm mb-2">{entry.meaning}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" /> {entry.province} · {entry.county}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            // 【核心新增】如果没有被收录，展示一个极其精美、富有趣味并提供直达投稿的按钮卡片
            <div className="text-center py-12 bg-gray-900/40 border border-gray-800/80 rounded-2xl p-8 max-w-md mx-auto mt-6">
              <div className="text-5xl mb-4 animate-bounce">🤫</div>
              <h3 className="text-xl font-black text-orange-400 mb-2">“{keyword}” 竟然还没有被收录？</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                看来此方言战斗力过于逆天，尚未有大侠将其载入史册！<br/>快去成为收录它的「嘴强至尊开拓者」！
              </p>
              <Link
                href={`/upload?content=${encodeURIComponent(keyword)}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 active:scale-95 transition-all text-sm"
              >
                📝 立即投稿这个方言 · 封神全网
              </Link>
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-700 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">输入关键词搜索方言词条</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-orange-500/10 via-gray-900 to-red-500/10 py-10 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black text-gradient mb-2">🔍 搜索方言</h1>
        </div>
      </div>
      <Suspense fallback={<div className="text-center py-16 text-gray-500">加载中...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}