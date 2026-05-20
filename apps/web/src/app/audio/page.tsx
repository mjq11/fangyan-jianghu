'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { curseApi } from '@/lib/api';
import { Zap, Volume2, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DanmuItem {
  id: string;
  text: string;
  pinyin: string;
  y: number;
}

export default function AudioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [danmuList, setDanmuList] = useState<DanmuItem[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(12847);
  const danmuRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: randomEntry, refetch } = useQuery({
    queryKey: ['random-curse'],
    queryFn: () => curseApi.getRandom().then(res => res.data),
    enabled: false,
  });

  const handleClick = useCallback(() => {
    refetch();
    setClickCount(prev => prev + 1);
    setTotalClicks(prev => prev + 1);
  }, [refetch]);

  useEffect(() => {
    if (randomEntry) {
      const newDanmu: DanmuItem = {
        id: `${Date.now()}-${Math.random()}`,
        text: randomEntry.content,
        pinyin: randomEntry.pinyin,
        y: Math.random() * 80 + 10,
      };

      setDanmuList(prev => [...prev.slice(-20), newDanmu]);

      setTimeout(() => {
        setDanmuList(prev => prev.filter(d => d.id !== newDanmu.id));
      }, 8000);
    }
  }, [randomEntry]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Danmu Container */}
      <div ref={danmuRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence>
          {danmuList.map((danmu) => (
            <motion.div
              key={danmu.id}
              initial={{ x: '100vw', opacity: 1 }}
              animate={{ x: '-120vw', opacity: [1, 1, 0] }}
              transition={{ duration: 6, ease: 'linear' }}
              className="absolute text-2xl font-bold whitespace-nowrap"
              style={{ top: `${danmu.y}%` }}
            >
              <span className="text-white drop-shadow-lg">{danmu.text}</span>
              <span className="ml-2 text-sm text-orange-300">{danmu.pinyin}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">赛博方言木鱼</h1>
          <p className="text-gray-400">点击释放压力，让坏心情烟消云散</p>
        </div>

        {/* Main Button */}
        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-64 h-64 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-500/50 flex items-center justify-center group"
        >
          {/* Ring animation */}
          <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-20" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Volume2 className="w-24 h-24 text-white/90 group-hover:scale-110 transition-transform" />
          </div>

          {/* Glow effect */}
          {isPlaying && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-red-500 blur-xl opacity-50 animate-pulse" />
          )}
        </motion.button>

        {/* Effects */}
        <AnimatePresence>
          {clickCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0, y: -40 }}
              className="mt-6 flex gap-4"
            >
              <div className="px-4 py-2 bg-red-500/20 backdrop-blur rounded-full border border-red-500/50">
                <span className="text-red-400 font-bold">压力 -1</span>
              </div>
              <div className="px-4 py-2 bg-orange-500/20 backdrop-blur rounded-full border border-orange-500/50">
                <span className="text-orange-400 font-bold">功德 -1</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="mt-12 flex gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white">{clickCount}</div>
            <div className="text-sm text-gray-400">今日敲击</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400">
              {totalClicks.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">全站累计</div>
          </div>
        </div>

        {/* Random Entry Display */}
        {randomEntry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 max-w-md w-full bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{randomEntry.content}</div>
              <div className="text-lg text-gray-400 mb-4">{randomEntry.pinyin}</div>
              <div className="text-gray-300 text-sm">{randomEntry.meaning}</div>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>{randomEntry.province} · {randomEntry.county}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>每点击一次，随机播放一条各地特色方言表达</p>
          <p className="mt-1">纯属娱乐解压，请勿用于现实攻击他人</p>
        </div>
      </div>
    </div>
  );
}