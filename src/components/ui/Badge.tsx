import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'brand' | 'accent' | 'success' | 'warning' | 'info' | 'neutral' | 'free' | 'paid';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'brand', size = 'sm', className }: BadgeProps) {
  const variants = {
    brand: 'bg-brand-500/15 text-brand-300 border-brand-500/25',
    accent: 'bg-accent-500/15 text-accent-400 border-accent-500/25',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
    neutral: 'bg-white/5 text-slate-400 border-white/10',
    free: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    paid: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
