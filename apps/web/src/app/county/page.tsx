'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { curseApi } from '@/lib/api';
import { formatNumber, getSpicyColor, getSpicyLabel } from '@/lib/utils';
import { Play, Heart, Share2, MapPin, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { useState, Suspense } from 'react';

const CATEGORIES = [
  { value: '', label: '全部' },
  { value: 'CURSE_WORD', label: '骂人词' },
  { value: 'COMMON_PHRASE', label: '常用语' },
  { value: 'EXAMPLE', label: '经典例句' },
];

function CountyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [activeCategory, setActiveCategory] = useState('CURSE_WORD');

  const [provinceAndCounty, county] = id.split('-').length > 1
    ? [id.slice(0, id.lastIndexOf('-')), id.slice(id.lastIndexOf('-') + 1)]
    : ['', id];

  const { data: countyData, isLoading } = useQuery({
    queryKey: ['county-curse', provinceAndCounty, county, activeCategory],
    queryFn: () => {
      const province = provinceAndCounty.replace(/[省市区县]$/g, '') || '重庆市';
      const city = county;
      return curseApi.getByCounty(province, city, city, activeCategory || undefined).then(res => res.data);
    },
    enabled: !!county,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary/10 to-amber-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4" />
            <Link href="/ranking">战力榜</Link>
            <span>/</span>
            <span>{county}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{county} 方言</h1>
          <p className="text-gray-600">收录 {countyData?.length || 0} 条方言表达</p>
        </div>
      </div>

      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.value ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!countyData?.length ? (
          <div className="text-center py-16 text-gray-500">
            <p>暂无数据</p>
            <p className="text-sm text-gray-400 mt-2">成为第一个贡献者吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {countyData.map((entry: any) => (
              <div key={entry.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{entry.content}</h3>
                    <p className="text-gray-500 mt-1">{entry.pinyin}</p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: getSpicyColor(entry.spicyLevel), color: entry.spicyLevel >= 4 ? 'white' : 'inherit' }}
                  >
                    {getSpicyLabel(entry.spicyLevel)}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{entry.meaning}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
                      <Play className="w-4 h-4" /><span>播放</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-primary">
                      <Heart className="w-4 h-4" /><span>{formatNumber(entry.likeCount)}</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-primary">
                    <Share2 className="w-4 h-4" /><span>分享</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-primary/10 to-amber-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">为家乡贡献力量</h3>
          <p className="text-gray-600 mb-4">录制你的方言发音，帮助完善数据库</p>
          <Link href="/upload" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl">
            <Volume2 className="w-5 h-5" />上传语音
          </Link>
        </div>
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