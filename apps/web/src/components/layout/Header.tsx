'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Flame, Search, User, Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/auth';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/ranking', label: '战力榜' },
  { href: '/map', label: '方言地图' },
  { href: '/audio', label: '赛博木鱼' },
  { href: '/random', label: '随便看看' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">方言江湖</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-gray-600'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/upload"
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  上传
                </Link>
                <Link
                  href="/profile"
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  注册
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'block py-2 text-sm font-medium transition-colors',
                  pathname === item.href ? 'text-primary' : 'text-gray-600'
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