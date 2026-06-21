import type { Metadata } from 'next';
import { Mail, Zap, BookOpen, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import NewsletterSignupForm from './NewsletterSignupForm';

export const metadata: Metadata = {
  title: 'AI Newsletter — Weekly Tips for 30,000+ Readers',
  description:
    'Join 30,000+ people who get practical AI tips, exclusive prompts, and tool breakdowns every week. Free. No spam. Unsubscribe anytime.',
  alternates: { canonical: '/newsletter' },
  openGraph: {
    title: 'The AI Newsletter 30,000+ People Read Every Week — DavideGPT',
    description:
      'Practical AI tips, exclusive prompts, and tool breakdowns delivered free to your inbox every week.',
    type: 'website',
  },
};

const perks = [
  {
    icon: Zap,
    title: 'Weekly AI Breakdowns',
    description: 'The most important AI news and tool updates, explained simply every week.',
  },
  {
    icon: BookOpen,
    title: 'Exclusive Prompt Packs',
    description: "Subscriber-only prompts and templates not available anywhere else.",
  },
  {
    icon: Star,
    title: 'Early Resource Access',
    description: "Get new guides and toolkits 48 hours before they're publicly released.",
  },
];

const recentIssues = [
  { title: 'The 5 ChatGPT Prompts That Save Me 10+ Hours/Week', date: 'Jun 16, 2026' },
  { title: "Claude 4 Is Out — Here's What Actually Changed", date: 'Jun 9, 2026' },
  { title: 'How I Use AI to Write a Month of Content in One Afternoon', date: 'Jun 2, 2026' },
  { title: 'The AI Tools I Actually Use Every Day (Honest List)', date: 'May 26, 2026' },
  { title: 'Stop Using ChatGPT Wrong — Do This Instead', date: 'May 19, 2026' },
];

export default function NewsletterPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="brand" size="md" className="mb-5">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                Weekly Newsletter
              </Badge>
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl leading-tight mb-5">
                The AI Newsletter{' '}
                <span className="text-gradient">30,000+ People</span>{' '}
                Read Every Week
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                No hype. No fluff. Just practical AI tips, tool breakdowns, and exclusive prompts
                delivered to your inbox every week — completely free.
              </p>
              <NewsletterSignupForm />
            </div>

            {/* Recent issues preview */}
            <div>
              <h2 className="font-semibold text-white mb-4">Recent Issues</h2>
              <div className="space-y-3 mb-8">
                {recentIssues.map((issue, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl bg-surface-1 border border-white/[0.06] hover:border-brand-500/20 transition-all"
                  >
                    <div className="h-8 w-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-brand-400" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-snug">{issue.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{issue.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                + 40+ more issues in the archive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <Card key={i} hover>
                  <div className="h-12 w-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-brand-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{perk.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{perk.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
