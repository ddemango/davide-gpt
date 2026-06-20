import type { Metadata } from 'next';
import {
  Users, MessageCircle, Zap, BookOpen, Calendar,
  CheckCircle2, ArrowRight, Star, Mail
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
    'Join 30,000+ AI learners in the DavideGPT newsletter community. Get weekly AI tips, exclusive prompts, early resource access, and connect with people mastering AI.',
  alternates: { canonical: '/community' },
};

const features = [
  {
    icon: MessageCircle,
    title: 'Weekly AI Breakdowns',
    description: 'Every week I break down the most important AI news and tool updates in plain English — no jargon.',
  },
  {
    icon: Zap,
    title: 'Exclusive Prompt Packs',
    description: 'Subscribers get prompt packs and templates not available anywhere else — delivered straight to your inbox.',
  },
  {
    icon: BookOpen,
    title: 'Early Resource Access',
    description: 'Get new guides and toolkits 48 hours before they\'re publicly released on the site.',
  },
  {
    icon: Calendar,
    title: 'Live Q&A Invites',
    description: 'Newsletter subscribers get priority invites to monthly live sessions where you can ask anything AI.',
  },
  {
    icon: Users,
    title: 'Community Discord (Coming Soon)',
    description: 'A private Discord for newsletter subscribers is in the works. Subscribers get first access when it launches.',
  },
  {
    icon: Star,
    title: 'Member Spotlights',
    description: 'Share your AI wins and get featured in the newsletter — real results from real people.',
  },
];

const included = [
  'Weekly AI tips and tool breakdowns',
  'Exclusive prompt packs for subscribers only',
  'New guides 48 hours before public release',
  'Priority invites to monthly live Q&A sessions',
  'First access when the Discord community launches',
  'Unsubscribe anytime — no strings attached',
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
            30,000+ People Learning AI{' '}
            <span className="text-gradient">Together</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            The DavideGPT newsletter is where the community lives. Weekly AI insights, exclusive
            prompts, early resource drops, and live Q&A invites — all free, every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/newsletter"
              variant="primary"
              size="xl"
              icon={<ArrowRight className="h-5 w-5" />}
            >
              Join Free — Get the Newsletter
            </Button>
            <Button href="/resources" variant="secondary" size="xl" icon={<BookOpen className="h-5 w-5" />} iconPosition="left">
              Browse Free Resources
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Always free. No credit card. Unsubscribe anytime.
          </p>

          {/* Member count */}
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
              <strong className="text-white">30,000+</strong> subscribers already inside
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <SectionWrapper>
        <SectionHeader
          eyebrow="What You Get"
          title={<>Everything Inside the <span className="text-gradient">Newsletter</span></>}
          description="The DavideGPT newsletter is the fastest way to stay ahead in AI without spending hours doing research yourself."
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
              title={<>Start <span className="text-gradient">Today</span> — It&apos;s Free</>}
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
              href="/newsletter"
              variant="primary"
              size="lg"
              icon={<Mail className="h-5 w-5" />}
              iconPosition="left"
            >
              Subscribe to the Newsletter
            </Button>
          </div>
          <Card className="border-gradient p-8">
            <div className="flex flex-col gap-3">
              {[
                { name: 'Sarah M.', msg: 'The prompts shared in the newsletter alone are worth subscribing for!' },
                { name: 'James K.', msg: 'Got my first AI client thanks to tips from Davide\'s weekly emails.' },
                { name: 'Priya R.', msg: 'Best AI newsletter I\'ve subscribed to. Practical, not hype.' },
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
