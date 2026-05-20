'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { curseApi } from '@/lib/api';
import { Shuffle, MapPin, Volume2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RandomPage() {
  const router = useRouter();
  const [currentEntry, setCurrentEntry] = useState<{
    id: string;
    content: string;
    pinyin: string;
    meaning: string;
    province: string;
    city: string;
    county: string;
    spicyLevel: number;
  } | null>(null);

  const { refetch, isLoading } = useQuery({
    queryKey: ['random-curse'],
    queryFn: () => curseApi.getRandom().then(res => res.data),
    enabled: false,
  });

  const handleRandom = async () => {
    const result = await refetch();
    if (result.data) {
      setCurrentEntry(result.data);
    }
  };

  const handleGoToCounty = () => {
    if (currentEntry) {
      const countyId = `${currentEntry.province}-${currentEntry.county}`;
      router.push(`/county/${encodeURIComponent(countyId)}`);
    }
  };

  useEffect(() => {
    handleRandom();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shuffle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">随便看看</h1>
          <p className="text-gray-600">随机发现全国各地的方言趣味</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-500">正在随机...</p>
          </div>
        ) : currentEntry ? (
          <motion.div
            key={currentEntry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">{currentEntry.content}</div>
              <div className="text-lg text-gray-500 mb-4">{currentEntry.pinyin}</div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                <MapPin className="w-4 h-4" />
                <span>{currentEntry.province} · {currentEntry.county}</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-gray-700">{currentEntry.meaning}</p>
              </div>

              <div className="flex items-center gap-2 justify-center mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < currentEntry.spicyLevel ? 'text-orange-500' : 'text-gray-300'}`}
                  >
                    🌶️
                  </span>
                ))}
                <span className="ml-2 text-sm text-orange-600">辣度</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleRandom}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  再来一个
                </button>
                <button
                  onClick={handleGoToCounty}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  查看该县
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <p className="text-gray-500">暂无数据</p>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          点击"再来一个"发现更多有趣的方言表达
        </p>
      </div>
    </div>
  );
}