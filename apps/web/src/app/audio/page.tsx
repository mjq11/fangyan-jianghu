'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { getRandomEntry, type CurseEntry } from '@/lib/mock-data';

// 辣度图标
function SpicyLevel({ level }: { level: number }) {
  return <span>{'🌶️'.repeat(level)}</span>;
}

// 弹出的骂语卡片
function PopCard({ entry, index }: { entry: CurseEntry & { ts: number }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? -100 : 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-5 shadow-2xl shadow-orange-500/10"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-2xl font-black text-white">{entry.content}</h3>
        <SpicyLevel level={entry.spicyLevel} />
      </div>
      <p className="text-orange-300/60 text-sm mb-2">{entry.pinyin}</p>
      <p className="text-gray-300 text-sm mb-3">{entry.meaning}</p>
      {entry.scene && (
        <span className="inline-block px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full mb-2">
          📍 {entry.scene}
        </span>
      )}
      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
        <MapPin className="w-3 h-3" />
        {entry.province} · {entry.county}
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
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="flex gap-3 mb-6"
            >
              <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-sm font-bold">
                压力 -1
              </span>
              <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-400 text-sm font-bold">
                毒舌 +1
              </span>
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