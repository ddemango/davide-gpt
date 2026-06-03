import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export default function Card({
  children,
  className,
  hover = false,
  glow = false,
  padding = 'md',
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-1 border border-white/[0.06] transition-all duration-300',
        paddings[padding],
        hover && 'hover:border-brand-500/30 hover:bg-surface-2 hover:-translate-y-1',
        glow && 'hover:shadow-lg hover:shadow-brand-500/10',
        className
      )}
    >
      {children}
    </div>
  );
}
