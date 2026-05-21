'use client';
import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">登录功能开发中</h1>
        <p className="text-gray-500 mb-6">纯静态版暂不支持登录，敬请期待</p>
        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium inline-block">
          返回首页
        </Link>
      </div>
    </div>
  );
}