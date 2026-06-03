'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className="relative z-50 bg-gradient-to-r from-brand-600 via-accent-600 to-brand-600 py-2.5"
      role="banner"
      aria-label="Announcement"
    >
      <div className="container-wide flex items-center justify-center gap-3 text-center">
        <Sparkles className="h-4 w-4 text-white/80 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm font-medium text-white">
          🎉 New: The Ultimate AI Prompting Guide is now FREE.{' '}
          <Link
            href="/resources/ultimate-chatgpt-prompting-guide"
            className="underline underline-offset-2 hover:text-white/80 transition-colors font-semibold"
            onClick={() =>
              typeof window !== 'undefined' &&
              window.gtag?.('event', 'announcement_click', { label: 'prompting_guide' })
            }
          >
            Download it now →
          </Link>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
