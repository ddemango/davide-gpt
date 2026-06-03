import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  noPadding?: boolean;
}

export default function SectionWrapper({
  children,
  className,
  id,
  dark = false,
  noPadding = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        !noPadding && 'section-padding',
        dark && 'bg-surface-1',
        className
      )}
    >
      <div className="container-wide">{children}</div>
    </section>
  );
}
