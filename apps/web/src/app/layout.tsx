import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from 'sonner';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: '方言江湖 - 全国方言毒舌大赏',
  description: '骂出风采，骂出水平，骂出非物质文化遗产。收录全国各地特色方言表达，看看你们那旮旯怎么骂人的？',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="py-8 text-center border-t border-gray-800">
              <div className="container mx-auto px-4">
                <p className="text-orange-400 font-medium">方言江湖</p>
                <p className="mt-1 text-sm text-gray-500">骂出风采 · 骂出水平 · 骂出非物质文化遗产</p>
                <p className="mt-2 text-xs text-gray-600">纯属娱乐，请勿用于现实攻击他人</p>
              </div>
            </footer>
          </div>
          <Toaster position="top-center" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}