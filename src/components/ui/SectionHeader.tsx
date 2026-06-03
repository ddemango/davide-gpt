import { cn } from '@/lib/utils';
import Badge from './Badge';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 md:mb-16',
        centered && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && (
        <div className={cn('mb-4', centered && 'flex justify-center')}>
          <Badge variant="brand" size="md">
            {eyebrow}
          </Badge>
        </div>
      )}
      <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-slate-400 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
