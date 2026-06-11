'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function AboutPhoto() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="h-[460px] rounded-2xl border border-white/[0.06] overflow-hidden relative bg-gradient-to-br from-surface-2 to-surface-3">
      {!imgError && (
        <>
          <Image
            src="/davide.jpeg"
            alt="Davide DeMango — AI Educator & Creator"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </>
      )}
      {imgError && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full bg-gradient-brand mx-auto flex items-center justify-center shadow-2xl shadow-brand-600/40 ring-4 ring-brand-500/20">
            <span className="font-display text-6xl font-bold text-white">D</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <p className="font-display text-2xl font-bold text-white mb-0.5">Davide DeMango</p>
        <p className="text-brand-400 text-sm font-medium mb-3">AI Educator & Creator</p>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          500K+ Followers Worldwide
        </div>
      </div>
    </div>
  );
}
