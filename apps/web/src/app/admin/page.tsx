'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Trash2, MapPin, BarChart3, FileText, Users, Volume2, Lock } from 'lucide-react';
import { getAllEntries, getPendingEntries, reviewEntry, deleteEntry, type UserEntry } from '@/lib/supabase';
import { curseEntries } from '@/lib/mock-data';

// 管理密码（生产环境应放 env）
const ADMIN_PASSWORD = 'fangyan2024';

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('fangyan_admin_auth') === 'true';
    }
    return false;
  });
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'review' | 'manage' | 'stats'>('review');
  const [entries, setEntries] = useState<UserEntry[]>([]);
  const [pendingEntries, setPendingEntries] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [all, pending] = await Promise.all([getAllEntries(), getPendingEntries()]);
      setEntries(all);
      setPendingEntries(pending);
    } catch (err) {
      console.error('加载数据失败', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { if (isAuth) loadData(); }, [isAuth, loadData]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      sessionStorage.setItem('fangyan_admin_auth', 'true');
    } else {
      alert('密码错误');
    }
  };

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    await reviewEntry(id, status);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此词条？')) return;
    await deleteEntry(id);
    await loadData();
  };

  // 登录页
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">后台管理</h1>
            <p className="text-gray-500 text-sm">请输入管理密码</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white mb-4 focus:border-orange-500 focus:outline-none"
              placeholder="输入管理密码"
            />
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium"
            >
              <Lock className="w-4 h-4 inline mr-2" />进入后台
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 页头 */}
      <div className="bg-gradient-to-r from-orange-500/10 via-gray-900 to-red-500/10 py-8 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-black text-gradient mb-2">🛡️ 后台管理</h1>
          <p className="text-gray-500 text-sm">管理投稿审核、词条数据和语音内容</p>
        </div>
      </div>

      {/* Tab 导航 */}
      <div className="border-b border-gray-800 sticky top-16 bg-gray-950/80 backdrop-blur-lg z-40">
        <div className="container mx-auto px-4 flex gap-1">
          {[
            { key: 'review' as const, label: '📋 投稿审核', count: pendingEntries.length },
            { key: 'manage' as const, label: '🗄️ 词条管理', count: entries.length },
            { key: 'stats' as const, label: '📊 数据概览' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-500'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading && <div className="text-center py-16 text-gray-500">加载中...</div>}

        {/* 投稿审核 Tab */}
        {!loading && activeTab === 'review' && (
          <div>
            {pendingEntries.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-green-500/30 mx-auto mb-4" />
                <p className="text-gray-500">暂无待审核投稿</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEntries.map(entry => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{entry.content}</h3>
                        <p className="text-orange-300/60 text-sm">{entry.pinyin}</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">待审核</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{entry.meaning}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <MapPin className="w-3 h-3" />
                      {entry.province} · {entry.city} · {entry.county}
                      <span className="ml-2">{'🌶️'.repeat(entry.spicyLevel)}</span>
                      <span className="ml-auto">{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(entry.id, 'approved')}
                        className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> 通过
                      </button>
                      <button
                        onClick={() => handleReview(entry.id, 'rejected')}
                        className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> 拒绝
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 词条管理 Tab */}
        {!loading && activeTab === 'manage' && (
          <div>
            <div className="mb-4 text-sm text-gray-500">
              用户投稿 {entries.length} 条 · 预置数据 {curseEntries.length} 条
            </div>
            <div className="space-y-3">
              {entries.map(entry => (
                <div key={entry.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white truncate">{entry.content}</span>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        entry.status === 'approved' ? 'bg-green-500/20 text-green-400'
                          : entry.status === 'rejected' ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>{entry.status === 'approved' ? '已通过' : entry.status === 'rejected' ? '已拒绝' : '待审核'}</span>
                    </div>
                    <p className="text-gray-500 text-xs truncate">{entry.province} · {entry.county} · {entry.meaning}</p>
                  </div>
                  <button onClick={() => handleDelete(entry.id)} className="text-gray-600 hover:text-red-400 transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-center text-gray-500 py-8">暂无用户投稿数据</p>
              )}
            </div>
          </div>
        )}

        {/* 数据概览 Tab */}
        {!loading && activeTab === 'stats' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '预置词条', value: curseEntries.length, icon: FileText, color: 'text-blue-400' },
              { label: '用户投稿', value: entries.length, icon: Users, color: 'text-green-400' },
              { label: '待审核', value: pendingEntries.length, icon: Shield, color: 'text-yellow-400' },
              { label: '覆盖省份', value: 30, icon: MapPin, color: 'text-orange-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
