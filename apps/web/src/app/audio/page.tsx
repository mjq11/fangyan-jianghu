'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { getRandomEntry, type CurseEntry } from '@/lib/mock-data';

// 辣度图标
function SpicyLevel({ level }: { level: number }) {
  return <span>{'🌶️'.repeat(level)}</span>;
}

import { Share2, Check, Sparkles } from 'lucide-react';

// 弹出的骂语卡片
function PopCard({ entry, index }: { entry: CurseEntry & { ts: number }; index: number }) {
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
      initial={{ opacity: 0, scale: 0.5, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? -100 : 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-lg border-2 border-orange-500/30 rounded-2xl p-5 shadow-2xl shadow-orange-500/10 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors">「{entry.content}」</h3>
        <SpicyLevel level={entry.spicyLevel} />
      </div>
      <p className="text-orange-300/70 text-sm mb-2">{entry.pinyin}</p>
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{entry.meaning}</p>
      
      <div className="flex items-center justify-between gap-2 mt-2 pt-3 border-t border-gray-700/50">
        <div className="flex flex-col gap-1">
          {entry.scene && (
            <span className="inline-flex items-center gap-1 text-[11px] text-orange-400">
              📍 适用场景: {entry.scene}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {entry.province} · {entry.county}
          </div>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg text-xs font-black shadow-md shadow-orange-500/20 active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-300" />
              已复制骚话!
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              分享此金句
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

  const handleClick = useCallback(() => {
    // 木鱼敲击动画
    setIsHitting(true);
    setTimeout(() => setIsHitting(false), 400);

    // 获取随机骂语
    const entry = getRandomEntry();
    const cardEntry = { ...entry, ts: Date.now() };

    // 更新计数
    setClickCount(prev => prev + 1);
    setTotalClicks(prev => prev + 1);

    // 添加卡片（最多保留4张）
    setCards(prev => [...prev.slice(-3), cardEntry]);

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

        {/* 木鱼按钮 */}
        <div className="relative mb-8">
          {/* 外圈发光 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-600 blur-2xl opacity-20 animate-pulse" />

          <motion.button
            onClick={handleClick}
            animate={isHitting ? { scale: [1, 0.9, 1.05, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="relative w-52 h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center group cursor-pointer"
          >
            {/* 背景环 */}
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-ping opacity-20" />
            <div className="absolute inset-2 rounded-full border border-orange-500/20" />

            {/* 木鱼主体 */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-500/40 flex items-center justify-center">
              {/* 木鱼图案 - 用 SVG 画简化版 */}
              <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-28 md:h-28 text-white/90 group-hover:scale-110 transition-transform" fill="currentColor">
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

        {/* 敲击反馈 */}
        <AnimatePresence>
          {clickCount > 0 && (
            <motion.div
              key={clickCount}
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1.1 }}
              exit={{ opacity: 0, y: -45, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex gap-2.5 mb-6 z-30"
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
                // 每次根据计数随机挑选两个展示
                const index1 = (clickCount * 3) % funnyStats.length;
                const index2 = (clickCount * 7 + 2) % funnyStats.length;
                const stat1 = funnyStats[index1];
                const stat2 = funnyStats[index2 !== index1 ? index2 : (index2 + 1) % funnyStats.length];

                return (
                  <>
                    <span className={`px-3 py-1 border rounded-full text-xs font-black shadow-lg ${stat1.color}`}>
                      {stat1.text}
                    </span>
                    <span className={`px-3 py-1 border rounded-full text-xs font-black shadow-lg ${stat2.color}`}>
                      {stat2.text}
                    </span>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 计数器 */}
        <div className="flex gap-8 text-center mb-10">
          <div>
            <div className="text-3xl font-bold text-white">{clickCount}</div>
            <div className="text-sm text-gray-500">今日敲击</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400">{totalClicks.toLocaleString()}</div>
            <div className="text-sm text-gray-500">全站累计</div>
          </div>
        </div>

        {/* 骂语卡片堆叠 */}
        <div className="w-full max-w-md space-y-3">
          <AnimatePresence>
            {cards.map((card, index) => (
              <PopCard key={card.ts} entry={card} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* 提示 */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>每敲一次，随机蹦出一句各地方言毒舌 🌶️</p>
          <p className="mt-1">纯属娱乐解压，请勿用于现实攻击他人</p>
        </div>
      </div>
    </div>
  );
}