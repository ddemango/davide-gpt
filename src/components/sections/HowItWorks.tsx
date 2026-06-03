'use client';

import { motion } from 'framer-motion';
import { BookOpen, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';

const steps = [
  {
    icon: BookOpen,
    number: '01',
    title: 'Pick Your Resource',
    description:
      'Browse 200+ free guides, prompt packs, and toolkits organized by tool, skill level, and use case. Start anywhere.',
    color: 'from-brand-500 to-brand-600',
    glow: 'shadow-brand-500/20',
  },
  {
    icon: Zap,
    number: '02',
    title: 'Learn & Apply',
    description:
      'Follow step-by-step tutorials designed for real results. Every guide includes practical examples you can use immediately.',
    color: 'from-accent-500 to-accent-600',
    glow: 'shadow-accent-500/20',
  },
  {
    icon: TrendingUp,
    number: '03',
    title: 'Level Up Fast',
    description:
      'Save hours every week, create better work, and stay ahead of the AI curve as you build real skills that compound over time.',
    color: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/20',
  },
];

export default function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <SectionHeader
        eyebrow="How It Works"
        title={
          <>
            From Zero to{' '}
            <span className="text-gradient">AI-Confident</span>
            {' '}in Days
          </>
        }
        description="No complicated onboarding. No jargon. Just pick a resource, follow along, and start seeing results."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 relative">
        {/* Connector lines (desktop) */}
        <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-500/50 via-accent-500/50 to-transparent" aria-hidden="true" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative text-center p-8 rounded-2xl bg-surface-1 border border-white/[0.06] hover:border-brand-500/20 transition-all group"
            >
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg ${step.glow} mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <div className="absolute top-6 right-6 text-5xl font-bold text-white/[0.04] select-none font-display">
                {step.number}
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="h-6 w-6 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center">
                    <ArrowRight className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
