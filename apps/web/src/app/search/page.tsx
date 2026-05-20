'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { curseApi } from '@/lib/api';
import { formatNumber, getSpicyColor, getSpicyLabel } from '@/lib/utils';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PRESET_KEYWORDS = ['锤子', '瓜娃子', '牛逼', '彪子', '傻逼'];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debouncedKeyword],
    queryFn: () => curseApi.getAll({ keyword: debouncedKeyword, limit: 50 }).then(res => res.data),
    enabled: debouncedKeyword.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white border-b">
        <div className="max-w-3xl">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
                placeholder="搜索方言词条、含义..."
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              搜索
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-4 pb-4">
            <span className="text-sm text-gray-500">热门搜索：</span>
            {PRESET_KEYWORDS.map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setKeyword(kw);
                  router.push(`/search?q=${encodeURIComponent(kw)}`);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">搜索中...</p>
        </div>
      ) : !debouncedKeyword ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">输入关键词开始搜索</p>
          <p className="text-sm text-gray-400 mt-2">可以搜索方言词、含义、拼音等</p>
        </div>
      ) : searchResults?.items?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">未找到相关结果</p>
          <p className="text-sm text-gray-400 mt-2">换个关键词试试？</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              找到 <span className="font-bold text-primary">{searchResults?.pagination?.total || 0}</span> 条结果
            </p>
          </div>

          <div className="space-y-4">
            {searchResults?.items?.map((entry: {
              id: string;
              content: string;
              pinyin: string;
              meaning: string;
              province: string;
              city: string;
              county: string;
              spicyLevel: number;
              likeCount: number;
            }) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{entry.content}</h3>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: getSpicyColor(entry.spicyLevel),
                          color: entry.spicyLevel >= 4 ? 'white' : 'inherit',
                        }}
                      >
                        {getSpicyLabel(entry.spicyLevel)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{entry.pinyin}</p>
                    <p className="text-gray-600">{entry.meaning}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                      <MapPin className="w-4 h-4" />
                      <span>{entry.province} · {entry.county}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{entry.likeCount}</div>
                    <div className="text-xs text-gray-500">点赞</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Search className="w-6 h-6" />
            搜索方言
          </h1>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-16">加载中...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}