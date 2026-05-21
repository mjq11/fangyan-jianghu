'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Flame, Search } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', label: '🏠 首页' },
  { href: '/ranking', label: '🏆 战力榜' },
  { href: '/map', label: '🗺️ 方言地图' },
  { href: '/audio', label: '🔔 敲木鱼' },
  { href: '/random', label: '🎲 随便看看' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 处理 basePath
  const isActive = (href: string) => {
    const cleanPath = pathname?.replace('/fangyan-jianghu', '') || '/';
    return cleanPath === href || (href !== '/' && cleanPath.startsWith(href));
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Flame className="w-7 h-7 text-orange-500 flame-flicker" />
            <span className="text-xl font-bold text-gradient">方言江湖</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(item.href)
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-orange-300 hover:bg-gray-800'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-gray-400 hover:text-orange-400 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            <button
              className="md:hidden p-2 text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'block py-3 px-3 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-orange-300'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}