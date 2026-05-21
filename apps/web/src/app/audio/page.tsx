'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Share2, Check, Sparkles } from 'lucide-react';
import { getRandomEntry, type CurseEntry } from '@/lib/mock-data';

// 辣度图标
function SpicyLevel({ level }: { level: number }) {
  return <span>{'🌶️'.repeat(level)}</span>;
}

// 历史超度记录卡片
function HistoryCard({ entry, index }: { entry: CurseEntry & { ts: number }; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const copyText = `我刚在【方言江湖】敲木鱼超度自己，获得了由 [${entry.province}·${entry.county}] 官方认证的赛博国骂：『${entry.content}』(${entry.pinyin})！
释义：${entry.meaning}
真是笑发财了！速来测测你的家乡方言战力，在线敲木鱼消怨气 👉 https://mjq11.github.io/fangyan-jianghu/`;
    
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 0.8, scale: 1, y: 0 }}
      whileHover={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? -80 : 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="bg-gray-900/90 backdrop-blur-md border border-gray-800 hover:border-orange-500/20 rounded-xl p-4 shadow-lg group relative overflow-hidden transition-all"
    >
      <div className="flex items-start justify-between mb-1.5">
        <h4 className="text-lg font-black text-gray-200 group-hover:text-orange-400 transition-colors">「{entry.content}」</h4>
        <SpicyLevel level={entry.spicyLevel} />
      </div>
      <p className="text-gray-400 text-xs mb-2">{entry.meaning}</p>
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800/80">
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <MapPin className="w-3 h-3 text-orange-500/80" />
          {entry.province} · {entry.county}
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-[10px] font-bold text-orange-400 hover:text-orange-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-300" />
              已复制
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3" />
              分享
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function AudioPage() {
  const [clickCount, setClickCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(12847);
  const [cards, setCards] = useState<(CurseEntry & { ts: number })[]>([]);
  const [isHitting, setIsHitting] = useState(false);
  const [danmuList, setDanmuList] = useState<{ id: string; text: string; y: number }[]>([]);
  const [currentShareCopied, setCurrentShareCopied] = useState(false);

  const handleClick = useCallback(() => {
    // 木鱼敲击动画
    setIsHitting(true);
    setTimeout(() => setIsHitting(false), 200);

    // 获取随机骂语
    const entry = getRandomEntry();
    const cardEntry = { ...entry, ts: Date.now() };

    // 更新计数
    setClickCount(prev => prev + 1);
    setTotalClicks(prev => prev + 1);

    // 添加卡片（保留最近5张，最新的那张显示在木鱼上方，其他变成历史记录）
    setCards(prev => [...prev.slice(-4), cardEntry]);

    // 重置当前金句分享状态
    setCurrentShareCopied(false);

    // 添加弹幕
    const danmu = {
      id: `${Date.now()}-${Math.random()}`,
      text: entry.content,
      y: Math.random() * 70 + 10,
    };
    setDanmuList(prev => [...prev.slice(-15), danmu]);
    setTimeout(() => {
      setDanmuList(prev => prev.filter(d => d.id !== danmu.id));
    }, 6000);
  }, []);

  const handleShareCurrent = () => {
    if (cards.length === 0) return;
    const card = cards[cards.length - 1];
    const copyText = `我刚在【方言江湖】敲木鱼，超度出一发重量级方言暴击：『${card.content}』(${card.pinyin})！释义：${card.meaning}。速来测试你的家乡方言战力！👉 https://mjq11.github.io/fangyan-jianghu/`;
    
    navigator.clipboard.writeText(copyText).then(() => {
      setCurrentShareCopied(true);
      setTimeout(() => setCurrentShareCopied(false), 2000);
    });
  };

  // 取出最新一张卡片展示在木鱼上方
  const latestCard = cards.length > 0 ? cards[cards.length - 1] : null;
  // 历史记录为除了最新一张之外的其他卡片，并按照时间倒序
  const historyCards = cards.length > 1 ? cards.slice(0, -1).reverse() : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* 星空背景粒子 */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 弹幕层 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <AnimatePresence>
          {danmuList.map((danmu) => (
            <motion.div
              key={danmu.id}
              initial={{ x: '100vw', opacity: 0.8 }}
              animate={{ x: '-120vw' }}
              transition={{ duration: 5 + Math.random() * 3, ease: 'linear' }}
              className="absolute text-xl font-bold whitespace-nowrap"
              style={{ top: `${danmu.y}%` }}
            >
              <span className="text-orange-300/60 drop-shadow-lg">{danmu.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 主内容 */}
      <div className="relative z-20 flex flex-col items-center min-h-screen px-4 py-12">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gradient mb-2">🔔 赛博方言木鱼</h1>
          <p className="text-gray-500">敲一下，随机来一句各地方言毒舌</p>
        </div>

        {/* 1. 【核心新增】木鱼上方的高光卡片气泡 */}
        <div className="w-full max-w-md min-h-[160px] flex items-center justify-center mb-6 relative px-2">
          <AnimatePresence mode="wait">
            {latestCard ? (
              <motion.div
                key={latestCard.ts}
                initial={{ opacity: 0, scale: 0.8, y: 25, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                className="w-full"
              >
                <div className="bg-gradient-to-br from-orange-500/25 via-red-500/10 to-gray-950 border-2 border-orange-500/60 rounded-2xl p-5 shadow-2xl shadow-orange-500/20 text-center relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-2.5 right-3.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-orange-400 animate-spin" />
                    <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 rounded text-[9px] font-black text-orange-400 tracking-wider">
                      当前敲出
                    </span>
                  </div>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-yellow-300 mb-1.5 mt-2">
                    「{latestCard.content}」
                  </div>
                  <div className="text-orange-300/80 text-xs font-mono mb-2">{latestCard.pinyin}</div>
                  <p className="text-gray-300 text-sm mb-3.5 font-medium leading-relaxed">{latestCard.meaning}</p>
                  
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-gray-800/80">
                    <span className="flex items-center gap-1 font-bold text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      {latestCard.province} · {latestCard.county}
                    </span>
                    <button
                      onClick={handleShareCurrent}
                      className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 hover:text-orange-300 rounded-lg font-black transition-all"
                    >
                      {currentShareCopied ? (
                        <>
                          <Check className="w-3 h-3 text-green-300" />
                          战报复制成功!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          复制骚话分享
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-gray-600 text-sm py-8 font-bold border border-dashed border-gray-800/60 w-full rounded-2xl bg-gray-900/10">
                🎯 暂无神梗出炉，快敲击木鱼开始超度！
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* 木鱼按钮 */}
        <div className="relative mb-6">
          {/* 外圈发光 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-600 blur-2xl opacity-20 animate-pulse" />

          <motion.button
            onClick={handleClick}
            animate={isHitting ? { scale: [1, 0.92, 1.06, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="relative w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center group cursor-pointer"
          >
            {/* 背景环 */}
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-ping opacity-20" />
            <div className="absolute inset-2 rounded-full border border-orange-500/20" />

            {/* 木鱼主体 */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-500/40 flex items-center justify-center">
              {/* 木鱼图案 - SVG */}
              <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-24 md:h-24 text-white/90 group-hover:scale-110 transition-transform" fill="currentColor">
                {/* 木鱼身体 */}
                <ellipse cx="50" cy="55" rx="35" ry="28" fill="currentColor" opacity="0.9"/>
                {/* 木鱼头部凸起 */}
                <ellipse cx="50" cy="32" rx="18" ry="14" fill="currentColor" opacity="0.85"/>
                {/* 木鱼眼睛 */}
                <circle cx="42" cy="52" r="4" fill="rgba(0,0,0,0.3)"/>
                <circle cx="58" cy="52" r="4" fill="rgba(0,0,0,0.3)"/>
                {/* 嘴 */}
                <ellipse cx="50" cy="63" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
                {/* 高光 */}
                <ellipse cx="40" cy="42" rx="6" ry="3" fill="rgba(255,255,255,0.2)" transform="rotate(-20 40 42)"/>
              </svg>
            </div>
          </motion.button>
        </div>

        {/* 敲击反馈：有趣的属性气泡飘出 */}
        <div className="h-8 mb-6 relative">
          <AnimatePresence>
            {clickCount > 0 && (
              <motion.div
                key={clickCount}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -20, scale: 1.1 }}
                exit={{ opacity: 0, y: -45, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex gap-2 z-30 justify-center"
              >
                {(() => {
                  const funnyStats = [
                    { text: '功德 -999', color: 'bg-red-500/20 border-red-500/50 text-red-400' },
                    { text: '怨气 -100%', color: 'bg-green-500/20 border-green-500/50 text-green-400' },
                    { text: '赛博业障 +99', color: 'bg-purple-500/20 border-purple-500/50 text-purple-400' },
                    { text: '嘴炮战力 +999', color: 'bg-orange-500/20 border-orange-500/50 text-orange-400' },
                    { text: '键盘磨损 +1', color: 'bg-gray-500/20 border-gray-500/50 text-gray-400' },
                    { text: '血压 -90%', color: 'bg-blue-500/20 border-blue-500/50 text-blue-400' },
                    { text: '超度进度 +1%', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' },
                  ];
                  const index1 = (clickCount * 3) % funnyStats.length;
                  const index2 = (clickCount * 7 + 2) % funnyStats.length;
                  const stat1 = funnyStats[index1];
                  const stat2 = funnyStats[index2 !== index1 ? index2 : (index2 + 1) % funnyStats.length];

                  return (
                    <>
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-black shadow-lg ${stat1.color}`}>
                        {stat1.text}
                      </span>
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-black shadow-lg ${stat2.color}`}>
                        {stat2.text}
                      </span>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 计数器 */}
        <div className="flex gap-8 text-center mb-8">
          <div>
            <div className="text-3xl font-bold text-white">{clickCount}</div>
            <div className="text-sm text-gray-500">今日敲击</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400">{totalClicks.toLocaleString()}</div>
            <div className="text-sm text-gray-500">全站累计</div>
          </div>
        </div>

        {/* 历史超度记录 */}
        {historyCards.length > 0 && (
          <div className="w-full max-w-md mt-4">
            <div className="text-xs font-black tracking-widest text-gray-500 uppercase mb-3 flex items-center gap-2">
              <span>📜 历史超度记录</span>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {historyCards.map((card, index) => (
                  <HistoryCard key={card.ts} entry={card} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 提示 */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>每敲一次，随机蹦出一句各地方言毒舌 🌶️</p>
          <p className="mt-1">纯属娱乐解压，请勿用于现实攻击他人</p>
        </div>
      </div>
    </div>
  );
}