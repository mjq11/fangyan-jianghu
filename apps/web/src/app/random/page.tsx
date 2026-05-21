'use client';

import { useEffect, useState, useCallback } from 'react';
import { Shuffle, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomEntry, type CurseEntry } from '@/lib/mock-data';

export default function RandomPage() {
  const [currentEntry, setCurrentEntry] = useState<CurseEntry | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandom = useCallback(() => {
    setIsSpinning(true);
    // 模拟短暂的"转动"延迟
    setTimeout(() => {
      setCurrentEntry(getRandomEntry());
      setIsSpinning(false);
    }, 300);
  }, []);

  useEffect(() => {
    handleRandom();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-float">🎲</div>
          <h1 className="text-2xl font-black text-gradient mb-2">随便看看</h1>
          <p className="text-gray-500">随机发现全国各地的方言毒舌</p>
        </div>

        <AnimatePresence mode="wait">
          {isSpinning ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-500">正在随机...</p>
            </motion.div>
          ) : currentEntry ? (
            <motion.div
              key={currentEntry.id + Date.now()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-3">{currentEntry.content}</div>
                <div className="text-lg text-orange-300/60 mb-4">{currentEntry.pinyin}</div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{currentEntry.province} · {currentEntry.county}</span>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
                  <p className="text-gray-300">{currentEntry.meaning}</p>
                </div>

                {/* 辣度展示 */}
                <div className="flex items-center gap-1 justify-center mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl transition-all ${i < currentEntry.spicyLevel ? '' : 'opacity-20'}`}
                    >
                      🌶️
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-orange-400">毒辣度</span>
                </div>

                {currentEntry.scene && (
                  <div className="mb-6">
                    <span className="px-3 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full">
                      📍 使用场景：{currentEntry.scene}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleRandom}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                  >
                    <Shuffle className="w-4 h-4" />
                    再来一个
                  </button>
                  <button
                    onClick={handleRandom}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    🔥 换一个
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <p className="text-center text-sm text-gray-600 mt-6">
          点击按钮发现更多有趣的方言表达 🌶️
        </p>
      </div>
    </div>
  );
}