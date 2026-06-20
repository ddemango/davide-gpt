'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Blog Error]', error);
  }, [error]);

  return (
    <div className="section-padding">
      <div className="container-wide max-w-lg mx-auto text-center py-20">
        <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="h-7 w-7 text-red-400" aria-hidden="true" />
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-3">
          Couldn't load the blog
        </h2>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
          There was a problem fetching the latest articles. This is usually temporary.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
