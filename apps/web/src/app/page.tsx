'use client';

import Link from 'next/link';
import { Flame, Map, Trophy, Shuffle, Zap, Users, MessageSquare, Mic } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { rankingApi, curseApi } from '@/lib/api';
import { formatNumber } from '@/lib/utils';

export default function HomePage() {
  const { data: stats } = useQuery({
    queryKey: ['curse-stats'],
    queryFn: () => curseApi.getStats().then(res => res.data),
  });

  const { data: provinceRanking } = useQuery({
    queryKey: ['province-ranking'],
    queryFn: () => rankingApi.getProvinceRanking().then(res => res.data),
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm mb-6">
              <Flame className="w-4 h-4" />
              <span>中国方言文化数字博物馆</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              方言江湖
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              骂出风采，骂出水平，骂出非物质文化遗产
            </p>
            <p className="text-gray-500 mb-8">
              收录全国各地特色方言表达，以县为单位展示方言文化多样性
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/ranking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <Trophy className="w-5 h-5" />
                查看战力榜
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                <Map className="w-5 h-5" />
                方言地图
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{formatNumber(stats?.totalEntries || 0)}</div>
              <div className="text-sm text-gray-500 mt-1">收录词条</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{formatNumber(stats?.totalVoices || 0)}</div>
              <div className="text-sm text-gray-500 mt-1">语音数量</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats?.byProvince?.length || 0}</div>
              <div className="text-sm text-gray-500 mt-1">覆盖省份</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{formatNumber(stats?.totalUsers || 0)}</div>
              <div className="text-sm text-gray-500 mt-1">注册用户</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">核心功能</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/ranking" className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">全国县级战力榜</h3>
              <p className="text-gray-600 text-sm">以县为单位，综合词条数量、语音贡献等维度，评选各地方言战力值</p>
            </Link>

            <Link href="/audio" className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">赛博方言木鱼</h3>
              <p className="text-gray-600 text-sm">点击释放压力，随机播放各地特色方言表达，让坏心情烟消云散</p>
            </Link>

            <Link href="/random" className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <Shuffle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">随便看看</h3>
              <p className="text-gray-600 text-sm">随机跳转到全国任意县市的方言页面，发现意想不到的方言趣味</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Province Ranking Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">省级战力榜</h2>
            <Link href="/ranking" className="text-primary text-sm font-medium hover:underline">
              查看完整榜单 →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {provinceRanking?.slice(0, 6).map((item: { rank: number; province: string; totalEntries: number; totalVoices: number }, index: number) => (
              <Link
                key={item.province}
                href={`/ranking?province=${encodeURIComponent(item.province)}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-200 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {item.rank}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.province}</div>
                  <div className="text-xs text-gray-500">
                    {item.totalEntries} 词条 · {item.totalVoices} 语音
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">参与贡献</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/upload"
              className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mic className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">上传家乡语音</h3>
                <p className="text-sm text-gray-500">用你的声音传承方言文化</p>
              </div>
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">纠错与建议</h3>
                <p className="text-sm text-gray-500">帮助完善方言数据库</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}