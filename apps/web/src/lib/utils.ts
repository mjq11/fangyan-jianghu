import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
}

export function getSpicyColor(level: number): string {
  const colors: Record<number, string> = {
    1: '#fef3c7',
    2: '#fde68a',
    3: '#fcd34d',
    4: '#fb923c',
    5: '#ef4444',
  };
  return colors[level] || colors[1];
}

export function getSpicyLabel(level: number): string {
  const labels: Record<number, string> = {
    1: '微辣',
    2: '小辣',
    3: '中辣',
    4: '大辣',
    5: '爆辣',
  };
  return labels[level] || labels[1];
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    CURSE_WORD: '骂人词',
    COMMON_PHRASE: '常用语',
    EXAMPLE: '经典例句',
  };
  return labels[category] || category;
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    GREEN: '#22c55e',
    YELLOW: '#eab308',
    RED: '#ef4444',
  };
  return colors[level] || colors.GREEN;
}