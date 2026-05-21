'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Send, ChevronRight, CheckCircle, Shield, Award, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { getProvinces, getCitiesByProvince, getCountiesByCity } from '@/lib/regions';
import { submitEntry, uploadVoice } from '@/lib/supabase';
import AudioRecorder from '@/components/AudioRecorder';

export default function UploadPage() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [copied, setCopied] = useState(false);

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
  const [submittedEntry, setSubmittedEntry] = useState<{ content: string; province: string; city: string; county: string } | null>(null);

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

      setSubmittedEntry({ content, province, city, county });
      setStep('success');
    } catch (err) {
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 生成认证编号
  const certId = `FY-${Date.now().toString(36).toUpperCase()}`;

  const handleShare = () => {
    const shareText = `【江湖告急！战力爆发！】💥
我刚刚为 [${submittedEntry?.province}·${submittedEntry?.city}·${submittedEntry?.county}] 贡献了一发重量级方言毒舌暴梗：『${submittedEntry?.content}』！
伤害值直接爆表！瞬间被【方言江湖】收录并授予「嘴强王者」官方战功认证！🏆
听懂掌声，不服来战！阁下身上怨气这么重，敢不敢速来与我大战三百回合？
速测家乡战力，赛博敲木鱼消怨气 👉 https://mjq11.github.io/fangyan-jianghu/`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black text-white mb-2 text-gradient">战力大捷！录入成功</h2>
          <p className="text-gray-400 mb-6">阁下的一发「嘴强暴击」已被载入史册，审核通过后上线</p>

          {/* 官方认证卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-2 border-red-500/50 rounded-2xl p-8 mb-6 overflow-hidden shadow-2xl shadow-red-500/10"
          >
            {/* 底部装饰光晕 */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />

            {/* 认证图标 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30"
            >
              <Shield className="w-10 h-10 text-white animate-pulse" />
            </motion.div>

            <h3 className="text-xl font-black text-red-500 mb-1">嘴强王者 · 官方特许认证</h3>
            <p className="text-gray-500 text-xs mb-5 uppercase tracking-widest font-mono">Fangyan Jianghu Battle Medal</p>

            {/* 认证内容 */}
            <div className="bg-gray-900/90 border border-red-500/20 rounded-xl p-5 mb-5">
              <div className="text-3xl font-black text-gradient from-red-400 to-orange-400 mb-3">
                『{submittedEntry?.content}』
              </div>
              <div className="flex items-center justify-center gap-2 text-red-400 font-bold">
                <MapPin className="w-4 h-4" />
                {submittedEntry?.province} · {submittedEntry?.city} · {submittedEntry?.county}
              </div>
            </div>

            {/* 认证地区标签 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-4"
            >
              <Award className="w-4 h-4 text-red-400" />
              <span className="text-sm font-black text-red-300">
                {submittedEntry?.province}{submittedEntry?.city}{submittedEntry?.county}「方言至尊杀手锏」
              </span>
            </motion.div>

            {/* 认证编号与印章 */}
            <div className="flex items-center justify-between text-xs text-gray-600 mt-4 pt-4 border-t border-gray-800/80">
              <span>战斗序列：{certId}</span>
              <span>{new Date().toLocaleDateString('zh-CN')}</span>
            </div>

            {/* 印章动画 */}
            <motion.div
              initial={{ opacity: 0, scale: 2, rotate: 30 }}
              animate={{ opacity: 0.25, scale: 1, rotate: -15 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-6 right-6 w-24 h-24 border-4 border-red-600 rounded-full flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <div className="text-red-600 text-xs font-black leading-tight">嘴强王者</div>
                <div className="text-red-600 text-[8px] font-black tracking-widest">御笔封章</div>
              </div>
            </motion.div>
          </motion.div>

          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {/* 一键复制裂变分享战报按钮 */}
            <button
              onClick={handleShare}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold hover:from-red-700 hover:to-orange-600 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-98 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-300" />
                  战报复制成功！速去群聊撕逼
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  复制骚话战报 · 挑衅群友去
                </>
              )}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => { setStep('form'); setContent(''); setPinyin(''); setMeaning(''); setScene(''); setAudioBlob(null); }}
                className="flex-1 py-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-xl hover:bg-gray-700 font-bold transition-colors"
              >
                继续输出
              </button>
              <Link href="/" className="flex-1 py-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-xl hover:bg-gray-700 font-bold flex items-center justify-center transition-colors">
                返回首页
              </Link>
            </div>
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
