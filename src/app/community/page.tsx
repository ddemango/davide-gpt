import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Users, MessageCircle, Zap, BookOpen, Calendar,
  CheckCircle2, ArrowRight, Star
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Join the DavideGPT Community — Learn AI Together',
  description:
    'Join 10,000+ AI learners in the DavideGPT community. Get support, share prompts, discuss AI tools, and learn faster alongside others on the same journey.',
  alternates: { canonical: '/community' },
};

const features = [
  {
    icon: MessageCircle,
    title: 'Daily AI Discussions',
    description: 'Share wins, ask questions, and learn from real people using AI every day.',
  },
  {
    icon: Zap,
    title: 'Weekly AI Challenges',
    description: 'Put your skills to the test with practical AI challenges and win recognition.',
  },
  {
    icon: BookOpen,
    title: 'Exclusive Resources',
    description: 'Community members get early access to new guides and prompt packs before public release.',
  },
  {
    icon: Calendar,
    title: 'Live Q&A Sessions',
    description: 'Monthly live sessions with Davide where you can ask anything about AI tools.',
  },
  {
    icon: Users,
    title: 'Accountability Groups',
    description: 'Join small groups of 5-10 people working toward similar AI learning goals.',
  },
  {
    icon: Star,
    title: 'Member Spotlights',
    description: 'Get featured in our weekly newsletter and social media for your AI wins.',
  },
];

const included = [
  'Access to the private Discord community',
  'Weekly exclusive resources before public release',
  'Monthly live Q&A with Davide',
  'Prompt sharing and feedback',
  'AI tool recommendations from the community',
  'Accountability partner matching',
];

export default function CommunityPage() {
  return (
    <>
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://davidegpt.ai' },
          { name: 'Community', url: 'https://davidegpt.ai/community' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10 text-center max-w-4xl mx-auto">
          <Badge variant="brand" size="md" className="mb-5">Community</Badge>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl leading-tight mb-5">
            Learn AI Faster,{' '}
            <span className="text-gradient">Together</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            Join 10,000+ AI learners sharing prompts, wins, tools, and strategies. The community
            where everyday people become AI-confident.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="xl"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              Join the Community — Free
            </Button>
            <Link href="/newsletter">
              <Button variant="secondary" size="xl">
                Get the Newsletter Instead
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Always free. No credit card. Join in under 60 seconds.
          </p>

          {/* Member avatars */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 ring-2 ring-surface flex items-center justify-center text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              <strong className="text-white">10,000+</strong> members already inside
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <SectionWrapper>
        <SectionHeader
          eyebrow="What's Inside"
          title={<>Everything You Get as a <span className="text-gradient">Member</span></>}
          description="The DavideGPT community is built for people who want to learn AI practically — not just talk about it."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} hover glow>
                <div className="h-12 w-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-brand-400" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Join CTA */}
      <SectionWrapper dark>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
          <div>
            <SectionHeader
              eyebrow="Free to Join"
              title={<>Start <span className="text-gradient">Today</span> — It's Free</>}
              centered={false}
            />
            <ul className="space-y-3 mb-8" role="list">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-brand-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="primary"
              size="lg"
              icon={<Users className="h-5 w-5" />}
              iconPosition="left"
            >
              Join the Free Community
            </Button>
          </div>
          <Card className="border-gradient p-8">
            <div className="flex flex-col gap-3">
              {[
                { name: 'Sarah M.', msg: 'The prompts shared here alone are worth it!' },
                { name: 'James K.', msg: 'Got my first AI client thanks to tips from this community.' },
                { name: 'Priya R.', msg: 'Best AI community I\'ve joined. Super active and helpful.' },
              ].map(({ name, msg }) => (
                <div key={name} className="flex gap-3 p-3 rounded-xl bg-surface-1">
                  <div className="h-8 w-8 rounded-full bg-gradient-brand flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </SectionWrapper>

      <CTASection />
    </>
  );
}
