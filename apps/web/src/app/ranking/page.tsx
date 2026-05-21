'use client';

import { useState } from 'react';
import { Trophy, Flame, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { provinceRankingData, countyRankingData, getEntriesByProvince, curseEntries } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';

function RankingContent() {
  const searchParams = useSearchParams();
  const provinceFilter = searchParams.get('province') || undefined;

  const filteredCounties = provinceFilter
    ? countyRankingData.filter(c => c.province === provinceFilter)
    : countyRankingData;

  const provinceEntries = provinceFilter ? getEntriesByProvince(provinceFilter) : [];

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* 左侧：省份筛选 */}
      <aside className="lg:col-span-1">
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50 sticky top-24">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 text-orange-400" />
            省份筛选
          </h3>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            <Link
              href="/ranking"
              className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                !provinceFilter
                  ? 'bg-orange-500/20 text-orange-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              🔥 全部省份
            </Link>
            {provinceRankingData.map((p) => (
              <Link
                key={p.province}
                href={`/ranking?province=${encodeURIComponent(p.province)}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                  provinceFilter === p.province
                    ? 'bg-orange-500/20 text-orange-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-gray-500 mr-1">#{p.rank}</span> {p.province}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* 右侧：排行内容 */}
      <main className="lg:col-span-3 space-y-6">
        {/* 前三名大卡片 */}
        {!provinceFilter && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {countyRankingData.slice(0, 3).map((item, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const borderColors = ['border-yellow-500/50', 'border-gray-400/50', 'border-orange-500/50'];
              const bgColors = ['from-yellow-500/10', 'from-gray-400/10', 'from-orange-500/10'];
              return (
                <motion.div
                  key={item.county}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={`bg-gradient-to-br ${bgColors[index]} to-gray-900/50 border ${borderColors[index]} rounded-2xl p-6 text-center`}
                >
                  <div className="text-4xl mb-3">{medals[index]}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.province}</h3>
                  <p className="text-gray-400 text-sm mb-3">{item.city} · {item.county}</p>
                  <div className="text-3xl font-black text-gradient mb-2">{item.powerValue}</div>
                  <p className="text-gray-500 text-xs">{item.totalEntries} 词条 · {item.totalVoices} 语音</p>
                  {/* 该省代表骂语 */}
                  {provinceRankingData.find(p => p.province === item.province) && (
                    <div className="mt-3 px-3 py-1.5 bg-gray-800/80 rounded-lg text-sm">
                      <span className="text-orange-400">"{provinceRankingData.find(p => p.province === item.province)?.representative}"</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 选中省份的骂语展示 */}
        {provinceFilter && provinceEntries.length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-4">
            <h3 className="text-lg font-bold text-white mb-4">{provinceFilter} 代表性毒舌语录</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {provinceEntries.slice(0, 4).map((entry) => (
                <div key={entry.id} className="curse-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{entry.content}</span>
                    <span className="text-sm">{'🌶️'.repeat(entry.spicyLevel)}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{entry.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 排行表格 */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl overflow-hidden">
          {/* 表头 */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-800 text-sm font-medium text-gray-400">
            <div className="col-span-1">排名</div>
            <div className="col-span-4">地区</div>
            <div className="col-span-2 text-right">词条数</div>
            <div className="col-span-2 text-right">语音数</div>
            <div className="col-span-3 text-right">战力值</div>
          </div>

          {/* 数据行 */}
          <div className="divide-y divide-gray-800">
            {filteredCounties.map((item, index) => (
              <motion.div
                key={`${item.province}-${item.county}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-700/30 transition-colors items-center"
              >
                <div className="col-span-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    item.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    item.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                    item.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-700 text-gray-500'
                  }`}>
                    {item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="font-medium text-white">{item.province} · {item.city}</div>
                  <div className="text-sm text-gray-500">{item.county}</div>
                </div>
                <div className="col-span-2 text-right text-gray-400">{formatNumber(item.totalEntries)}</div>
                <div className="col-span-2 text-right text-gray-400">{formatNumber(item.totalVoices)}</div>
                <div className="col-span-3 text-right">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full font-bold text-sm">
                    <Flame className="w-3 h-3" />
                    {item.powerValue.toFixed(1)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 不服CTA */}
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">你的家乡还没上榜？</p>
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25">
            🔥 不服？贡献你的家乡方言！
          </button>
        </div>
      </main>
    </div>
  );
}

export default function RankingPage() {
  return (
    <div className="min-h-screen">
      {/* 页头 */}
      <div className="bg-gradient-to-r from-orange-500/10 via-gray-900 to-red-500/10 py-10 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black text-gradient mb-2">🏆 全国县级战力榜</h1>
          <p className="text-gray-500">战力值 = 词条丰富度(30%) + 语音贡献(25%) + 评分均值(25%) + 传播指数(20%)</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-16 text-gray-500">加载中...</div>}>
          <RankingContent />
        </Suspense>
      </div>
    </div>
  );
}