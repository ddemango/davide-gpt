'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Twitter, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import { siteConfig } from '@/lib/data';

const highlights = [
  'Teaching AI to everyday people since 2022',
  '35K+ followers across YouTube, Instagram & TikTok',
  'Building a growing community of everyday AI learners',
  'No-fluff approach — only what actually works',
  'Updated weekly with the latest AI tool breakdowns',
];

export default function AboutSection() {
  return (
    <SectionWrapper dark id="about">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
          aria-hidden="true"
        >
          {/* Placeholder image box */}
          <div className="relative h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br from-surface-2 to-surface-3 border border-white/[0.06] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10" />
            <div className="relative z-10 text-center">
              {/* Avatar placeholder */}
              <div className="h-32 w-32 rounded-full bg-gradient-brand mx-auto mb-4 flex items-center justify-center shadow-xl shadow-brand-600/30">
                <span className="font-display text-5xl font-bold text-white">D</span>
              </div>
              <p className="text-slate-400 text-sm">[ Photo of Davide ]</p>
            </div>

            {/* Social platforms overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-3">
              {[
                { icon: Youtube, platform: 'YouTube', label: 'Subscribe' },
                { icon: Instagram, platform: 'Instagram', label: 'Follow' },
                { icon: Twitter, platform: 'TikTok', label: 'Follow' },
              ].map(({ icon: Icon, platform, label }) => (
                <div
                  key={platform}
                  className="flex-1 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 p-3 text-center"
                >
                  <Icon className="h-4 w-4 text-white mx-auto mb-1" />
                  <p className="text-xs font-bold text-white">{label}</p>
                  <p className="text-xs text-slate-500">{platform}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content side */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SectionHeader
            eyebrow="Meet Davide"
            title={
              <>
                AI Made Simple.{' '}
                <span className="text-gradient">For Everyone.</span>
              </>
            }
            centered={false}
            className="mb-6"
          />

          <p className="text-slate-400 leading-relaxed mb-6">
            I'm Davide — an AI educator, content creator, and founder of DavideGPT. When ChatGPT
            launched, I became obsessed with one question: how can regular people use this to change
            their lives?
          </p>

          <p className="text-slate-400 leading-relaxed mb-8">
            Since 2022, I've been breaking down complex AI tools into practical, easy-to-follow
            guides that anyone can use — whether you're a business owner, student, freelancer, or
            just curious about what AI can do for you.
          </p>

          <ul className="space-y-3 mb-8" role="list">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-300">
                <CheckCircle2
                  className="h-5 w-5 text-brand-400 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/about">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
              >
                My Full Story
              </Button>
            </Link>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="lg"
                icon={<Youtube className="h-5 w-5" />}
                iconPosition="left"
              >
                Watch on YouTube
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
