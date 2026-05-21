'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { searchEntries, type CurseEntry } from '@/lib/mock-data';

function SearchContent() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<CurseEntry[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (kw: string) => {
    setKeyword(kw);
    if (kw.trim()) {
      setResults(searchEntries(kw));
      setSearched(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(keyword); }} className="max-w-2xl mx-auto mb-8">
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
            <button key={kw} type="button" onClick={() => handleSearch(kw)}
              className="px-3 py-1 text-xs bg-gray-800 text-gray-400 rounded-full hover:bg-orange-500/20 hover:text-orange-400 transition-all">
              🔥 {kw}
            </button>
          ))}
        </div>
      </form>

      {searched && (
        <div className="max-w-2xl mx-auto">
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
            {results.length === 0 && <p className="text-center text-gray-500 py-8">未找到相关结果，换个关键词试试？</p>}
          </div>
        </div>
      )}

      {!searched && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
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