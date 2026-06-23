'use client';

import Link from 'next/link';
import { ArrowRight, Play, Star, Users, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32"
      aria-label="Hero — DavideGPT"
    >
      {/* Background glow effects */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -left-1/4 h-[400px] w-[400px] rounded-full bg-accent-600/15 blur-[100px]" />
        <div className="absolute top-1/3 -right-1/4 h-[400px] w-[400px] rounded-full bg-brand-600/15 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 flex justify-center">
            <Badge variant="brand" size="md">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              35K+ Followers — Practical AI Education
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Master AI Tools.{' '}
            <span className="text-gradient">
              Own Your Future.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto md:text-xl">
            Practical AI guides, prompts, and tutorials that help you save time, create better work,
            and stay ahead — no technical background required.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources">
              <Button
                variant="primary"
                size="xl"
                icon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
                onClick={() =>
                  typeof window !== 'undefined' &&
                  window.gtag?.('event', 'cta_click', { label: 'hero_primary', location: 'hero' })
                }
              >
                Browse Free Resources
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="secondary"
                size="xl"
                icon={<Play className="h-5 w-5" aria-hidden="true" />}
                iconPosition="left"
              >
                Watch Intro Video
              </Button>
            </Link>
          </div>

          {/* Social proof row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 ring-2 ring-surface flex items-center justify-center text-xs font-bold text-white"
                    aria-hidden="true"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>Join a growing community</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-brand-400" aria-hidden="true" />
              <span>
                <strong className="text-white">50+</strong> free resources
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-400" aria-hidden="true" />
              <span>
                <strong className="text-white">35K+</strong> followers
              </span>
            </div>
          </div>
        </div>

        {/* Hero visual — floating AI tools preview */}
        <div className="mt-16 relative mx-auto max-w-4xl" aria-hidden="true">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-1 overflow-hidden shadow-2xl shadow-black/40">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-surface-2 border-b border-white/[0.06]">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <div className="ml-3 flex-1 h-6 rounded-md bg-white/5 flex items-center px-3">
                <span className="text-xs text-slate-500">davidegpt.ai/resources</span>
              </div>
            </div>
            {/* Content preview */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: 'Ultimate ChatGPT Guide', tag: 'Free', color: 'from-brand-500 to-brand-600' },
                  { title: 'Claude AI Beginner Guide', tag: 'Free', color: 'from-accent-500 to-accent-600' },
                  { title: 'AI Content Toolkit', tag: '$27', color: 'from-emerald-500 to-emerald-600' },
                  { title: '50 AI Tools Directory', tag: 'Free', color: 'from-sky-500 to-sky-600' },
                  { title: 'Prompt Pack Pro', tag: '$19', color: 'from-orange-500 to-orange-600' },
                  { title: 'AI Workflow Templates', tag: 'Free', color: 'from-pink-500 to-pink-600' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-surface-2 border border-white/[0.06] p-4 flex flex-col gap-2"
                  >
                    <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${item.color}`} />
                    <p className="text-xs font-medium text-white leading-tight">{item.title}</p>
                    <span
                      className={`self-start text-xs px-2 py-0.5 rounded-full font-semibold ${
                        item.tag === 'Free'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="absolute -left-4 top-1/4 hidden md:flex items-center gap-2 rounded-xl bg-surface-2 border border-white/[0.08] px-4 py-3 shadow-xl">
            <Users className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-xs font-bold text-white">35K+</p>
              <p className="text-xs text-slate-500">Followers</p>
            </div>
          </div>
          <div className="absolute -right-4 bottom-1/4 hidden md:flex items-center gap-2 rounded-xl bg-surface-2 border border-white/[0.08] px-4 py-3 shadow-xl">
            <BookOpen className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-xs font-bold text-white">50+</p>
              <p className="text-xs text-slate-500">Free Resources</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
