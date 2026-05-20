'use client';

import { useQuery } from '@tanstack/react-query';
import { rankingApi } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import { Trophy, MapPin, Flame } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RankingContent() {
  const searchParams = useSearchParams();
  const provinceFilter = searchParams.get('province') || undefined;

  const { data: countyRanking, isLoading } = useQuery({
    queryKey: ['county-ranking', provinceFilter],
    queryFn: () => rankingApi.getCountyRanking({ province: provinceFilter }).then(res => res.data),
  });

  const { data: provinceRanking } = useQuery({
    queryKey: ['province-ranking'],
    queryFn: () => rankingApi.getProvinceRanking().then(res => res.data),
  });

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-24">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            省份筛选
          </h3>
          <div className="space-y-1">
            <Link
              href="/ranking"
              className={`block px-3 py-2 rounded-lg text-sm ${
                !provinceFilter ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              全部省份
            </Link>
            {provinceRanking?.map((p: { province: string; rank: number }) => (
              <Link
                key={p.province}
                href={`/ranking?province=${encodeURIComponent(p.province)}`}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  provinceFilter === p.province ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">#{p.rank}</span> {p.province}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <main className="lg:col-span-3">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 text-sm font-medium text-gray-600">
            <div className="col-span-1">排名</div>
            <div className="col-span-4">地区</div>
            <div className="col-span-2 text-right">词条数</div>
            <div className="col-span-2 text-right">语音数</div>
            <div className="col-span-3 text-right">战力值</div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : countyRanking?.items?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">暂无数据</div>
          ) : (
            <div className="divide-y">
              {countyRanking?.items?.map((item: {
                rank: number;
                province: string;
                city: string;
                county: string;
                totalEntries: number;
                totalVoices: number;
                powerValue: number;
              }) => (
                <Link
                  key={`${item.province}-${item.city}-${item.county}`}
                  href={`/county?id=${encodeURIComponent(item.province)}-${encodeURIComponent(item.county)}`}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  <div className="col-span-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      item.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      item.rank === 2 ? 'bg-gray-200 text-gray-600' :
                      item.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {item.rank <= 3 ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        item.rank
                      )}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="font-medium">{item.province} · {item.city}</div>
                    <div className="text-sm text-gray-500">{item.county}</div>
                  </div>
                  <div className="col-span-2 text-right text-gray-600">
                    {formatNumber(item.totalEntries)}
                  </div>
                  <div className="col-span-2 text-right text-gray-600">
                    {formatNumber(item.totalVoices)}
                  </div>
                  <div className="col-span-3 text-right">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      <Flame className="w-4 h-4" />
                      {item.powerValue.toFixed(1)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary/10 to-amber-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">全国县级战力榜</h1>
          <p className="text-gray-600">战力值 = 词条丰富度(30%) + 语音贡献(25%) + 评分均值(25%) + 传播指数(20%)</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-16">加载中...</div>}>
          <RankingContent />
        </Suspense>
      </div>
    </div>
  );
}