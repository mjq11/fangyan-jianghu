'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Send, ChevronRight, CheckCircle, Shield, Award, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProvinces, getCitiesByProvince, getCountiesByCity } from '@/lib/regions';
import { submitEntry, uploadVoice } from '@/lib/supabase';
import AudioRecorder from '@/components/AudioRecorder';

function UploadForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [copied, setCopied] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // 【核心功能】初始化时，如果 URL 携带了 ?content=参数，自动帮用户预填在“方言内容”输入框中，超级贴心！
  useEffect(() => {
    const urlContent = searchParams.get('content');
    if (urlContent) {
      setContent(urlContent);
    }
  }, [searchParams]);

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
    // 生成认证卡片图片并弹出长按保存遮罩（兼容手机端微信/Safari）
    const handleSaveImage = async () => {
      const el = document.getElementById('cert-card');
      if (!el) return;
      setIsGenerating(true);
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(el, {
          backgroundColor: '#0a0a0a',
          scale: 2,
          useCORS: true,
        });
        setShareImageUrl(canvas.toDataURL('image/png'));
      } catch {
        alert('图片生成失败，请尝试截图保存');
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-black text-white mb-1 text-gradient">战力大捷！录入成功</h2>
          <p className="text-gray-400 text-sm mb-6">阁下的「嘴强暴击」已被载入史册，审核通过后上线</p>

          {/* ========== 专业认证证书卡片 ========== */}
          <div
            id="cert-card"
            className="relative bg-gradient-to-br from-[#1a0a0a] via-[#0d0d0d] to-[#0a0a1a] border-2 border-red-800/60 rounded-xl p-0 mb-6 overflow-hidden shadow-2xl shadow-red-900/20"
          >
            {/* 顶部金色装饰条 */}
            <div className="h-2 bg-gradient-to-r from-yellow-600 via-red-500 to-yellow-600" />

            {/* 内层双线边框效果 */}
            <div className="m-3 border border-red-900/40 rounded-lg p-6">

              {/* 证书头部 */}
              <div className="mb-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-700/50 to-transparent" />
                  <Shield className="w-6 h-6 text-red-500" />
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-700/50 to-transparent" />
                </div>
                <h3 className="text-2xl font-black text-red-500 tracking-wider">官方认证证书</h3>
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-mono mt-1">
                  FANGYAN JIANGHU OFFICIAL CERTIFICATE
                </p>
              </div>

              {/* 分隔线 */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-900/30" />
                <span className="text-red-700 text-[10px] font-bold">兹 证 明</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-900/30" />
              </div>

              {/* 认证内容区域 */}
              <div className="bg-black/40 border border-red-900/20 rounded-lg p-5 mb-5">
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                  以下方言词条已由投稿人提交并通过平台初审，特此授予
                </p>
                <div className="text-3xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-3 py-1">
                  『{submittedEntry?.content}』
                </div>
                <div className="flex items-center justify-center gap-2 text-red-400/90 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{submittedEntry?.province} · {submittedEntry?.city} · {submittedEntry?.county}</span>
                </div>
              </div>

              {/* 认证称号 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-950/80 to-orange-950/80 border border-red-700/40 rounded-full mb-5"
              >
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-black text-red-300">
                  「嘴强王者 · {submittedEntry?.province}赛区」特许认证
                </span>
              </motion.div>

              {/* 底部信息栏：编号 + 日期 + 二维码 */}
              <div className="border-t border-red-900/30 pt-4 mt-2">
                <div className="flex items-end justify-between">
                  {/* 左侧：编号和日期 */}
                  <div className="text-left">
                    <div className="text-[10px] text-gray-600 mb-1">
                      <span className="text-gray-500">证书编号：</span>
                      <span className="font-mono text-red-700">{certId}</span>
                    </div>
                    <div className="text-[10px] text-gray-600 mb-1">
                      <span className="text-gray-500">签发日期：</span>
                      <span className="font-mono text-gray-400">{new Date().toLocaleDateString('zh-CN')}</span>
                    </div>
                    <div className="text-[10px] text-gray-600">
                      <span className="text-gray-500">签发机构：</span>
                      <span className="text-red-600 font-bold">方言江湖认证中心</span>
                    </div>
                  </div>

                  {/* 右侧：二维码 */}
                  <div className="flex flex-col items-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&color=dc2626&bgcolor=0a0a0a&data=https://mjq11.github.io/fangyan-jianghu/"
                      alt="扫码访问方言江湖"
                      className="w-16 h-16 rounded"
                      crossOrigin="anonymous"
                    />
                    <span className="text-[8px] text-gray-600 mt-1">扫码加入江湖</span>
                  </div>
                </div>
              </div>

              {/* 大印章 —— 右下角压盖 */}
              <motion.div
                initial={{ opacity: 0, scale: 3, rotate: 30 }}
                animate={{ opacity: 0.35, scale: 1, rotate: -12 }}
                transition={{ delay: 1.0, duration: 0.6, type: 'spring' }}
                className="absolute bottom-16 right-10 w-32 h-32 border-[5px] border-red-600 rounded-full flex items-center justify-center pointer-events-none"
              >
                <div className="text-center">
                  <div className="text-red-600 text-base font-black leading-tight">方言江湖</div>
                  <div className="text-red-600 text-[9px] font-black tracking-widest mt-0.5">官方认证</div>
                  <div className="w-8 h-px bg-red-600 mx-auto my-1" />
                  <div className="text-red-600 text-[7px] font-bold">CERTIFIED</div>
                </div>
              </motion.div>

            </div>

            {/* 底部金色装饰条 */}
            <div className="h-1 bg-gradient-to-r from-yellow-600/50 via-red-500/50 to-yellow-600/50" />
          </div>

          {/* ========== 操作按钮组 ========== */}
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {/* 保存图片按钮 */}
            <button
              onClick={handleSaveImage}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 rounded-xl font-bold hover:from-orange-600 hover:to-yellow-600 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {isGenerating ? '⏳ 图片生成中...' : '📸 保存认证图片 · 分享到朋友圈'}
            </button>

            {/* 复制战报按钮 */}
            <button
              onClick={handleShare}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold hover:from-red-700 hover:to-orange-600 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all"
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

        {/* ========== 长按保存图片遮罩（手机端兼容方案） ========== */}
        {shareImageUrl && (
          <div
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            onClick={() => setShareImageUrl(null)}
          >
            {/* 顶部提示 */}
            <div className="text-center mb-4 animate-bounce">
              <p className="text-white text-lg font-black mb-1">👇 长按下方图片保存到相册</p>
              <p className="text-gray-400 text-xs">保存后即可分享到微信朋友圈、微博等</p>
            </div>

            {/* 生成的证书图片 */}
            <img
              src={shareImageUrl}
              alt="方言江湖官方认证证书"
              className="max-w-[90vw] max-h-[65vh] rounded-xl shadow-2xl border-2 border-red-800/50"
              onClick={(e) => e.stopPropagation()}
            />

            {/* 底部关闭提示 */}
            <button
              onClick={() => setShareImageUrl(null)}
              className="mt-6 px-8 py-3 bg-gray-800 text-gray-300 rounded-xl font-bold border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              ✕ 关闭
            </button>
          </div>
        )}
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

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">加载中...</div>}>
      <UploadForm />
    </Suspense>
  );
}
