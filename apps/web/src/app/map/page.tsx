'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rankingApi } from '@/lib/api';
import { MapPin, ZoomIn, ZoomOut, Info } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MapPage() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const { data: provinceRanking, isLoading } = useQuery({
    queryKey: ['province-ranking'],
    queryFn: () => rankingApi.getProvinceRanking().then(res => res.data),
  });

  const { data: countyRanking } = useQuery({
    queryKey: ['county-ranking'],
    queryFn: () => rankingApi.getCountyRanking({ limit: 100 }).then(res => res.data),
    enabled: !!selectedProvince,
  });

  const maxPower = Math.max(...(provinceRanking?.map((p: { totalPower: number }) => p.totalPower) || [1]));

  const getHeatColor = (power: number) => {
    const intensity = power / maxPower;
    if (intensity > 0.8) return 'bg-red-500';
    if (intensity > 0.6) return 'bg-orange-500';
    if (intensity > 0.4) return 'bg-amber-500';
    if (intensity > 0.2) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary/10 to-amber-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">中国方言地图</h1>
          <p className="text-gray-600">点击省份查看详细战力数据</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Visualization (Simplified) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              战力热力图
            </h2>

            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
              {/* Simplified grid visualization */}
              <div className="absolute inset-0 p-4">
                <div className="grid grid-cols-8 grid-rows-4 gap-1 h-full">
                  {provinceRanking?.slice(0, 32).map((p: { province: string; totalPower: number; rank: number }, index: number) => (
                    <motion.button
                      key={p.province}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      onClick={() => setSelectedProvince(p.province)}
                      className={`${getHeatColor(p.totalPower)} rounded-lg flex items-center justify-center text-white text-xs font-medium opacity-80 hover:opacity-100 transition-opacity shadow-sm`}
                      title={`${p.province} - 排名 #${p.rank}`}
                    >
                      {p.province.slice(0, 2)}
                    </motion.button>
                  )) || Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-2">战力强度</div>
                <div className="flex gap-1">
                  <div className="w-6 h-4 bg-gray-300 rounded" />
                  <div className="w-6 h-4 bg-yellow-500 rounded" />
                  <div className="w-6 h-4 bg-amber-500 rounded" />
                  <div className="w-6 h-4 bg-orange-500 rounded" />
                  <div className="w-6 h-4 bg-red-500 rounded" />
                </div>
              </div>

              {/* Info tooltip */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Info className="w-4 h-4 text-primary" />
                  <span>共收录 {provinceRanking?.length || 0} 个省份</span>
                </div>
              </div>
            </div>
          </div>

          {/* Province List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">省级战力榜</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {provinceRanking?.map((p: { rank: number; province: string; totalEntries: number; totalVoices: number; totalPower: number }) => (
                <button
                  key={p.province}
                  onClick={() => setSelectedProvince(p.province)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedProvince === p.province
                      ? 'bg-primary/10 border border-primary'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    p.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    p.rank === 2 ? 'bg-gray-200 text-gray-600' :
                    p.rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {p.rank}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.province}</div>
                    <div className="text-xs text-gray-500">
                      {p.totalEntries} 词条 · {p.totalVoices} 语音
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Province Detail */}
        {selectedProvince && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{selectedProvince} 县级战力榜</h2>
              <Link
                href={`/ranking?province=${encodeURIComponent(selectedProvince)}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                查看全部 →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {countyRanking?.items?.slice(0, 8).map((item: { rank: number; county: string; city: string; powerValue: number; totalEntries: number }) => (
                <Link
                  key={item.county}
                  href={`/county/${encodeURIComponent(selectedProvince)}-${encodeURIComponent(item.county)}`}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.rank <= 3 ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {item.rank}
                    </span>
                    <span className="font-medium text-sm">{item.county}</span>
                  </div>
                  <div className="text-xs text-gray-500">{item.city}</div>
                  <div className="mt-2 text-lg font-bold text-primary">{item.powerValue.toFixed(1)}</div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}