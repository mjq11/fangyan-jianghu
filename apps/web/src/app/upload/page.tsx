'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Send, ChevronRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getProvinces, getCitiesByProvince, getCountiesByCity } from '@/lib/regions';
import { submitEntry, uploadVoice } from '@/lib/supabase';
import AudioRecorder from '@/components/AudioRecorder';

export default function UploadPage() {
  const [step, setStep] = useState<'form' | 'success'>('form');

  // 地区选择
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');

  // 词条内容
  const [content, setContent] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaning, setMeaning] = useState('');
  const [spicyLevel, setSpicyLevel] = useState(3);
  const [scene, setScene] = useState('');
  const [category, setCategory] = useState<'CURSE_WORD' | 'COMMON_PHRASE' | 'EXAMPLE'>('CURSE_WORD');

  // 语音
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // 状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<{ content: string; province: string; county: string } | null>(null);

  const provinces = getProvinces();
  const cities = province ? getCitiesByProvince(province) : [];
  const counties = (province && city) ? getCountiesByCity(province, city) : [];

  const isFormValid = content && meaning && province && city && county;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      const entry = await submitEntry({
        content, pinyin, meaning, province, city, county,
        category, spicyLevel, scene,
      });

      if (audioBlob) {
        await uploadVoice(entry.id, audioBlob);
      }

      setSubmittedEntry({ content, province, county });
      setStep('success');
    } catch (err) {
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">投稿成功！</h2>
          <p className="text-gray-400 mb-6">你的方言词条已提交，审核通过后将上线</p>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6">
            <div className="text-3xl font-black text-gradient mb-2">{submittedEntry?.content}</div>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {submittedEntry?.province} · {submittedEntry?.county}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setStep('form'); setContent(''); setPinyin(''); setMeaning(''); setScene(''); setAudioBlob(null); }}
              className="px-5 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              继续投稿
            </button>
            <Link href="/" className="px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all">
              返回首页
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 页头 */}
      <div className="bg-gradient-to-r from-orange-500/10 via-gray-900 to-red-500/10 py-10 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black text-gradient mb-2">📝 投稿方言</h1>
          <p className="text-gray-500">为家乡贡献一句方言毒舌，让全国人民见识你们那旮旯的战斗力！</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 第一步：选择地区 */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-400" />
            选择地区
            <span className="text-red-400 text-xs">*必填</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-3">
            {/* 省份 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">省份</label>
              <select
                value={province}
                onChange={(e) => { setProvince(e.target.value); setCity(''); setCounty(''); }}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">请选择省份</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* 城市 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">城市</label>
              <select
                value={city}
                onChange={(e) => { setCity(e.target.value); setCounty(''); }}
                disabled={!province}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-orange-500 focus:outline-none disabled:opacity-50"
              >
                <option value="">请选择城市</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* 县/区 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">县/区</label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                disabled={!city}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-orange-500 focus:outline-none disabled:opacity-50"
              >
                <option value="">请选择县/区</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 第二步：填写内容 */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-white mb-4">🌶️ 方言内容</h3>

          <div className="space-y-4">
            {/* 类型选择 */}
            <div className="flex gap-2">
              {[
                { value: 'CURSE_WORD' as const, label: '骂人词', emoji: '🤬' },
                { value: 'COMMON_PHRASE' as const, label: '常用语', emoji: '💬' },
                { value: 'EXAMPLE' as const, label: '经典例句', emoji: '📖' },
              ].map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat.value
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      : 'bg-gray-700 text-gray-400 border border-transparent hover:bg-gray-600'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* 方言内容 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">方言内容 <span className="text-red-400">*</span></label>
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg font-bold focus:border-orange-500 focus:outline-none"
                placeholder="例：龟儿子"
              />
            </div>

            {/* 拼音 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">拼音（选填）</label>
              <input
                value={pinyin}
                onChange={(e) => setPinyin(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
                placeholder="例：guī ér zi"
              />
            </div>

            {/* 含义 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">含义释义 <span className="text-red-400">*</span></label>
              <textarea
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                rows={2}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none resize-none"
                placeholder="这句方言的含义是什么？"
              />
            </div>

            {/* 辣度滑块 */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">毒辣度：{'🌶️'.repeat(spicyLevel)}</label>
              <input
                type="range" min="1" max="5" value={spicyLevel}
                onChange={(e) => setSpicyLevel(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>温和</span><span>中等</span><span>辛辣</span><span>暴辣</span><span>核弹</span>
              </div>
            </div>

            {/* 使用场景 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">使用场景（选填）</label>
              <input
                value={scene}
                onChange={(e) => setScene(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
                placeholder="例：日常吵架、嘲笑别人"
              />
            </div>
          </div>
        </div>

        {/* 第三步：语音录制 */}
        <div className="mb-6">
          <AudioRecorder onRecorded={setAudioBlob} />
          {audioBlob && (
            <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> 语音已录制
            </p>
          )}
        </div>

        {/* 提交按钮 */}
        <motion.button
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isFormValid
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> 提交中...</>
          ) : (
            <><Send className="w-5 h-5" /> 提交投稿</>
          )}
        </motion.button>

        <p className="text-center text-gray-600 text-xs mt-4">
          提交后需审核通过方可上线 · 请确保内容真实、不含违法信息
        </p>
      </div>
    </div>
  );
}
