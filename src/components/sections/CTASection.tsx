'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { siteConfig } from '@/lib/data';
import { Analytics } from '@/lib/analytics';

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="final-cta-heading"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 via-surface to-accent-900/30" aria-hidden="true" />
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[100px]" aria-hidden="true" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-xl shadow-brand-600/30">
              <Sparkles className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
          </div>

          <h2
            id="final-cta-heading"
            className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl leading-tight mb-5"
          >
            Ready to Master{' '}
            <span className="text-gradient">AI for Real?</span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Start with a free resource today, or book a 1-on-1 call with Davide to get a
            personalized AI learning plan built for your goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources">
              <Button
                variant="primary"
                size="xl"
                icon={<ArrowRight className="h-5 w-5" />}
                onClick={() => Analytics.ctaClick('get_started_final', 'footer_cta')}
              >
                Get Started Free
              </Button>
            </Link>
            <a
              href={siteConfig.calendly}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => Analytics.bookingRequest()}
            >
              <Button
                variant="secondary"
                size="xl"
                icon={<Calendar className="h-5 w-5" />}
                iconPosition="left"
              >
                Book a Free Call
              </Button>
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-600">
            No credit card required. 200+ free resources available now.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
