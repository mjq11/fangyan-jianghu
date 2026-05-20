import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from 'sonner';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '方言江湖 - 中国方言文化数字博物馆',
  description: '骂出风采，骂出水平，骂出非物质文化遗产',
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
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="py-6 text-center text-sm text-muted-foreground border-t">
              <div className="container mx-auto px-4">
                <p>方言江湖 · 中国方言文化数字博物馆</p>
                <p className="mt-1">记录与传承中国各地方言特色表达</p>
              </div>
            </footer>
          </div>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}