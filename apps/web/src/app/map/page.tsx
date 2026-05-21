'use client';

import { useState } from 'react';
import { MapPin, Flame } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { provinceRankingData, getEntriesByProvince } from '@/lib/mock-data';

// 简化的省份位置映射（相对位置，用于网格布局展示）
const provinceLayout: { name: string; row: number; col: number }[] = [
  { name: '黑龙江', row: 0, col: 6 }, { name: '吉林', row: 1, col: 6 },
  { name: '辽宁', row: 2, col: 6 }, { name: '内蒙古', row: 0, col: 3 },
  { name: '新疆', row: 1, col: 0 }, { name: '甘肃', row: 2, col: 2 },
  { name: '宁夏', row: 2, col: 3 }, { name: '北京', row: 1, col: 5 },
  { name: '天津', row: 2, col: 5 }, { name: '河北', row: 1, col: 4 },
  { name: '山西', row: 2, col: 4 }, { name: '山东', row: 3, col: 5 },
  { name: '河南', row: 3, col: 4 }, { name: '陕西', row: 3, col: 3 },
  { name: '四川', row: 3, col: 2 }, { name: '重庆', row: 4, col: 3 },
  { name: '湖北', row: 4, col: 4 }, { name: '安徽', row: 3, col: 5 },
  { name: '江苏', row: 3, col: 6 }, { name: '上海', row: 3, col: 7 },
  { name: '浙江', row: 4, col: 6 }, { name: '江西', row: 4, col: 5 },
  { name: '湖南', row: 5, col: 4 }, { name: '贵州', row: 5, col: 3 },
  { name: '云南', row: 5, col: 2 }, { name: '广西', row: 6, col: 3 },
  { name: '广东', row: 6, col: 4 }, { name: '福建', row: 5, col: 5 },
  { name: '海南', row: 7, col: 4 },
];

export default function MapPage() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const maxPower = Math.max(...provinceRankingData.map(p => p.totalPower));

  const getHeatColor = (province: string) => {
    const data = provinceRankingData.find(p => p.province === province);
    if (!data) return 'bg-gray-700';
    const ratio = data.totalPower / maxPower;
    if (ratio > 0.85) return 'bg-red-500';
    if (ratio > 0.7) return 'bg-orange-500';
    if (ratio > 0.55) return 'bg-amber-500';
    if (ratio > 0.4) return 'bg-yellow-500';
    return 'bg-gray-600';
  };

  const selectedData = selectedProvince
    ? provinceRankingData.find(p => p.province === selectedProvince)
    : null;
  const selectedEntries = selectedProvince ? getEntriesByProvince(selectedProvince) : [];

  // 合并东北三省的搜索
  const findProvinceData = (name: string) => {
    if (['黑龙江', '吉林', '辽宁'].includes(name)) {
      return provinceRankingData.find(p => p.province === name) || provinceRankingData.find(p => p.province === '东北三省');
    }
    return provinceRankingData.find(p => p.province === name);
  };

  return (
    <div className="min-h-screen">
      {/* 页头 */}
      <div className="bg-gradient-to-r from-orange-500/10 via-gray-900 to-red-500/10 py-10 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black text-gradient mb-2">🗺️ 中国方言毒舌地图</h1>
          <p className="text-gray-500">点击省份，查看当地最有杀伤力的方言</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 地图区域 */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-white">
              <Flame className="w-5 h-5 text-orange-400" />
              战力热力图
            </h2>

            {/* 省份网格地图 */}
            <div className="relative" style={{ minHeight: '400px' }}>
              <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)' }}>
                {provinceLayout.map((p) => {
                  const data = findProvinceData(p.name);
                  const isSelected = selectedProvince === p.name;
                  return (
                    <motion.button
                      key={p.name}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProvince(p.name)}
                      className={`${getHeatColor(p.name)} rounded-lg py-3 px-1 text-white text-xs font-bold opacity-80 hover:opacity-100 transition-all shadow-sm ${
                        isSelected ? 'ring-2 ring-orange-400 opacity-100' : ''
                      }`}
                      style={{ gridColumn: p.col + 1, gridRow: p.row + 1 }}
                      title={`${p.name} - ${data ? '排名 #' + data.rank : '暂无数据'}`}
                    >
                      {p.name.slice(0, 2)}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 图例 */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-500">战力：</span>
              <span className="flex items-center gap-1"><span className="w-4 h-3 bg-gray-600 rounded" /> 低</span>
              <span className="flex items-center gap-1"><span className="w-4 h-3 bg-yellow-500 rounded" /></span>
              <span className="flex items-center gap-1"><span className="w-4 h-3 bg-amber-500 rounded" /></span>
              <span className="flex items-center gap-1"><span className="w-4 h-3 bg-orange-500 rounded" /></span>
              <span className="flex items-center gap-1"><span className="w-4 h-3 bg-red-500 rounded" /> 高</span>
            </div>
          </div>

          {/* 省级战力榜 */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <h2 className="font-bold mb-4 text-white">🏆 省级战力榜</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {provinceRankingData.map((p) => (
                <button
                  key={p.province}
                  onClick={() => setSelectedProvince(p.province)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    selectedProvince === p.province
                      ? 'bg-orange-500/20 border border-orange-500/50'
                      : 'hover:bg-gray-700/50 border border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    p.rank <= 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-500'
                  }`}>
                    {p.rank <= 3 ? ['🥇', '🥈', '🥉'][p.rank - 1] : p.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-white">{p.province}</div>
                    <div className="text-xs text-gray-500">{p.totalEntries} 词条</div>
                  </div>
                  <span className="text-sm font-bold text-orange-400">{p.totalPower}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 选中省份详情 */}
        <AnimatePresence>
          {selectedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {selectedProvince} <span className="text-orange-400">· 战力 {selectedData.totalPower}</span>
                </h2>
                <Link
                  href={`/ranking?province=${encodeURIComponent(selectedProvince!)}`}
                  className="text-orange-400 text-sm hover:underline"
                >
                  查看完整榜单 →
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gradient">{selectedData.totalEntries}</div>
                  <div className="text-sm text-gray-500">词条数</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gradient">{selectedData.totalVoices}</div>
                  <div className="text-sm text-gray-500">语音数</div>
                </div>
              </div>

              <h3 className="font-bold text-white mb-3">🌶️ 代表性毒舌语录</h3>
              {selectedEntries.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedEntries.slice(0, 4).map((entry) => (
                    <div key={entry.id} className="curse-card">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{entry.content}</span>
                        <span className="text-sm">{'🌶️'.repeat(entry.spicyLevel)}</span>
                      </div>
                      <p className="text-orange-300/60 text-xs mb-1">{entry.pinyin}</p>
                      <p className="text-gray-400 text-sm">{entry.meaning}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>暂无该省详细数据</p>
                  <p className="text-sm mt-1">代表骂语："{selectedData.representative}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}