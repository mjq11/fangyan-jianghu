'use client';

import { useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { curseEntries } from '@/lib/mock-data';

function CountyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const parts = id.split('-');
  const province = parts[0] || '';
  const county = parts[1] || '';

  const entries = curseEntries.filter(e =>
    e.province.includes(province) || e.county.includes(county)
  );

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-orange-500/10 via-gray-900 to-red-500/10 py-10 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4" />
            <Link href="/ranking" className="hover:text-orange-400">战力榜</Link>
            <span>/</span>
            <span className="text-white">{county || province}</span>
          </div>
          <h1 className="text-3xl font-black text-gradient mb-2">{county || province} 方言</h1>
          <p className="text-gray-500">收录 {entries.length} 条方言表达</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {entries.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>暂无该地区数据</p>
            <Link href="/ranking" className="text-orange-400 mt-4 inline-block hover:underline">返回战力榜</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="curse-card">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{entry.content}</h3>
                  <span>{'🌶️'.repeat(entry.spicyLevel)}</span>
                </div>
                <p className="text-orange-300/60 text-sm mb-1">{entry.pinyin}</p>
                <p className="text-gray-400 text-sm mb-2">{entry.meaning}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{entry.province} · {entry.county}</span>
                  <span>❤️ {entry.likes.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CountyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">加载中...</div>}>
      <CountyContent />
    </Suspense>
  );
}