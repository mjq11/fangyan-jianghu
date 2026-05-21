'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Flame, Trophy, Search, MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { provinceRankingData, curseEntries, statsData, searchEntries, type CurseEntry } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';

// 辣度图标
function SpicyLevel({ level }: { level: number }) {
  return <span className="text-sm">{'🌶️'.repeat(level)}</span>;
}

// 骂语卡片组件
function CurseCard({ entry, index }: { entry: CurseEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="curse-card group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
          {entry.content}
        </span>
        <SpicyLevel level={entry.spicyLevel} />
      </div>
      <p className="text-orange-300/70 text-sm mb-2">{entry.pinyin}</p>
      <p className="text-gray-400 text-sm mb-3">{entry.meaning}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {entry.province} · {entry.county}
        </span>
        <span>❤️ {entry.likes.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CurseEntry[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hotEntries, setHotEntries] = useState<CurseEntry[]>([]);
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [bgDanmus, setBgDanmus] = useState<{ id: string; text: string; top: number; speed: number; delay: number }[]>([]);

  const slogans = [
    '🌶️ 四川人说“锤子哦”，你家乡谁能一战？',
    '🥊 全国方言“嘴强王者”巅峰对决，火热撕逼中！',
    '🤬 听说你们那里骂人特别好听？速来投稿自证清白！',
    '🔔 检测到您赛博怨气过重，请火速前往「敲木鱼」超度自己',
    '🏆 震撼！非物质文化「赛博口头禅」，看看你家乡排第几？',
  ];

  // 经典江湖黑话弹幕库，用于背景随机漂移，极具视觉冲击力和网梗感
  const classicShitTalk = [
    '你在缩铲铲哦？', '丢雷楼谋！', '嘎哈呢一天天的', '你个瘪犊子', '脑壳有包',
    '扑街仔！', '你算哪块小饼干', '憨批一个', '洗洗睡吧您勒', '顶你个肺！',
    '小样，再瞅一个试试？', '信不信我抽你', '神戳戳的', '你个哈戳戳', '木脑壳',
    '脑子是个好东西，希望你也有', '吃饱了撑的', '哈麻批', '边去，别碍事', '给爷整笑了'
  ];

  // 初始化背景弹幕
  useEffect(() => {
    const initialDanmus = Array.from({ length: 15 }).map((_, i) => ({
      id: `init-${i}-${Math.random()}`,
      text: classicShitTalk[Math.floor(Math.random() * classicShitTalk.length)],
      top: 10 + (i * 6), // 均匀分布在不同高度
      speed: 15 + Math.random() * 15, // 速度 15s - 30s
      delay: Math.random() * -20, // 负延迟让其一进来就分布在屏幕各处
    }));
    setBgDanmus(initialDanmus);

    // 定时补充新弹幕
    const interval = setInterval(() => {
      setBgDanmus(prev => {
        const filtered = prev.filter(d => Math.random() > 0.05); // 随机移除旧的
        if (filtered.length < 20) {
          return [
            ...filtered,
            {
              id: `${Date.now()}-${Math.random()}`,
              text: classicShitTalk[Math.floor(Math.random() * classicShitTalk.length)],
              top: Math.random() * 85 + 5,
              speed: 18 + Math.random() * 15,
              delay: 0,
            }
          ];
        }
        return filtered;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 加载热门词条
  useEffect(() => {
    const sorted = [...curseEntries].sort((a, b) => b.likes - a.likes).slice(0, 6);
    setHotEntries(sorted);
  }, []);

  // Slogan 轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlogan(prev => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 搜索处理
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setSearchResults(searchEntries(query).slice(0, 5));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // 按下回车直接跳转检索页面
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* 背景效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(249,115,22,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(239,68,68,0.1),transparent_60%)]" />

        {/* 满屏飞舞的背景吐槽弹幕墙 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-[0.12]">
          {bgDanmus.map((danmu) => (
            <div
              key={danmu.id}
              className="absolute whitespace-nowrap text-lg md:text-2xl font-black text-orange-500 font-sans"
              style={{
                top: `${danmu.top}%`,
                left: '100%',
                animation: `marquee ${danmu.speed}s linear infinite`,
                animationDelay: `${danmu.delay}s`,
              }}
            >
              {danmu.text}
            </div>
          ))}
        </div>

        <style jsx global>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-150vw);
            }
          }
        `}</style>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <Flame className="w-12 h-12 text-orange-500 flame-flicker" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-4 text-gradient"
            >
              方言江湖
            </motion.h1>

            {/* 轮播 Slogan */}
            <div className="h-12 mb-8 overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSlogan}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-lg md:text-xl font-bold text-orange-400/90"
                >
                  {slogans[currentSlogan]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* 搜索框 */}
            <div className="relative max-w-xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜搜你的家乡怎么骂人的..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/80 backdrop-blur border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-lg animate-glow"
                />
              </div>

              {/* 搜索结果下拉：含收录关联点击与未收录极具病毒感的引导投稿 */}
              {showResults && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 text-left backdrop-blur-xl">
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="px-4 py-2 bg-gray-800/50 text-[11px] font-black tracking-widest text-orange-400 uppercase border-b border-gray-800">
                        🔍 已收录关联神梗
                      </div>
                      {searchResults.map((entry) => (
                        <div
                          key={entry.id}
                          onMouseDown={() => router.push(`/search?q=${encodeURIComponent(entry.content)}`)}
                          className="px-4 py-3 hover:bg-orange-500/10 hover:border-l-4 hover:border-orange-500 transition-all cursor-pointer border-b border-gray-800/50 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-white">『{entry.content}』</span>
                            <SpicyLevel level={entry.spicyLevel} />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{entry.meaning}</p>
                          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                            <span>{entry.province} · {entry.county}</span>
                            <span className="text-orange-400/80 font-bold">点击查看 🎯</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center border-t-2 border-red-500/40 bg-gradient-to-b from-gray-900 to-gray-950">
                      <div className="text-4xl mb-3">🤭</div>
                      <p className="text-red-400 font-bold mb-1.5 text-sm">
                        “{searchQuery}” 竟然还没有被收录？
                      </p>
                      <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                        这能忍？看来你家乡的方言战力被严重低估了！<br/>快来投稿它，当一回「嘴强至尊开拓者」！
                      </p>
                      <button
                        onMouseDown={() => router.push('/upload')}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl text-xs font-black shadow-lg shadow-red-500/20 active:scale-95 transition-all animate-pulse"
                      >
                        📝 录入此词条 · 一战封神
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 热门搜索标签 */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['四川', '广东', '东北', '湖南', '上海'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearch(tag)}
                    className="px-3 py-1 text-xs bg-gray-800 text-gray-400 rounded-full hover:bg-orange-500/20 hover:text-orange-400 transition-all"
                  >
                    🔥 {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA 按钮 */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/ranking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25 glow-pulse"
              >
                <Trophy className="w-5 h-5" />
                查看战力榜
              </Link>
              <Link
                href="/audio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-orange-400 border border-gray-700 rounded-xl font-medium hover:bg-gray-700 hover:border-orange-500/50 transition-all"
              >
                🔔 敲木鱼
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="py-10 bg-gray-900/50 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: '收录词条', value: statsData.totalEntries, icon: '📝' },
              { label: '语音数量', value: statsData.totalVoices, icon: '🎤' },
              { label: '覆盖省份', value: statsData.totalProvinces, icon: '🗺️' },
              { label: '累计访问', value: statsData.totalUsers, icon: '👥' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-gradient">{formatNumber(stat.value)}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 今日热词 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🔥 热门毒舌
            </h2>
            <Link href="/ranking" className="text-orange-400 text-sm hover:underline flex items-center gap-1">
              更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotEntries.map((entry, index) => (
              <CurseCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 省级战力榜预览 */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🏆 省级战力榜 Top 10
            </h2>
            <Link href="/ranking" className="text-orange-400 text-sm hover:underline flex items-center gap-1">
              完整榜单 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {provinceRankingData.slice(0, 10).map((item, index) => (
              <motion.div
                key={item.province}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/ranking?province=${encodeURIComponent(item.province)}`}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 backdrop-blur rounded-xl hover:bg-gray-800 transition-all group border border-gray-800 hover:border-orange-500/30"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {index < 3 ? ['🥇', '🥈', '🥉'][index] : item.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{item.province}</span>
                      <span className="text-xs text-gray-500">"{item.representative}"</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="power-bar"
                          style={{ width: `${(item.totalPower / 100) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-orange-400 w-12 text-right">{item.totalPower}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心功能入口 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/ranking" className="group curse-card text-center py-8">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">全国战力榜</h3>
              <p className="text-gray-400 text-sm">谁才是全国最会骂人的地方？</p>
            </Link>
            <Link href="/audio" className="group curse-card text-center py-8">
              <div className="text-4xl mb-4 animate-float">🔔</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">敲木鱼</h3>
              <p className="text-gray-400 text-sm">敲一下出一个骂人的词</p>
            </Link>
            <Link href="/random" className="group curse-card text-center py-8">
              <div className="text-4xl mb-4">🎲</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">随便看看</h3>
              <p className="text-gray-400 text-sm">随机探索全国各地方言趣味</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}