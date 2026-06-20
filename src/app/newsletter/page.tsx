'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Zap, BookOpen, Star } from 'lucide-react';
import { newsletterSchema, type NewsletterFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Analytics } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const perks = [
  {
    icon: Zap,
    title: 'Weekly AI Breakdowns',
    description: 'The most important AI news and tool updates, explained simply every week.',
  },
  {
    icon: BookOpen,
    title: 'Exclusive Prompt Packs',
    description: 'Subscriber-only prompts and templates not available anywhere else.',
  },
  {
    icon: Star,
    title: 'Early Resource Access',
    description: 'Get new guides and toolkits 48 hours before they\'re publicly released.',
  },
];

const recentIssues = [
  { title: 'The 5 ChatGPT Prompts That Save Me 10+ Hours/Week', date: 'Jun 16, 2026' },
  { title: 'Claude 4 Is Out — Here\'s What Actually Changed', date: 'Jun 9, 2026' },
  { title: 'How I Use AI to Write a Month of Content in One Afternoon', date: 'Jun 2, 2026' },
  { title: 'The AI Tools I Actually Use Every Day (Honest List)', date: 'May 26, 2026' },
  { title: 'Stop Using ChatGPT Wrong — Do This Instead', date: 'May 19, 2026' },
];

export default function NewsletterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setServerError('');
    Analytics.formStart('newsletter_page');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setServerError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      Analytics.newsletterSignup('newsletter_page');
      setSubmitted(true);
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    }
  };

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

              {submitted ? (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">You&apos;re in!</p>
                    <p className="text-sm text-emerald-400">Check your inbox — your first email is on the way.</p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  aria-label="Newsletter signup"
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="nl-firstname" className="block text-sm font-medium text-slate-300 mb-1.5">
                      First Name (optional)
                    </label>
                    <input
                      id="nl-firstname"
                      type="text"
                      placeholder="Your first name"
                      autoComplete="given-name"
                      className="w-full rounded-xl bg-surface-2 border border-white/10 px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      {...register('firstName')}
                    />
                  </div>
                  <div>
                    <label htmlFor="nl-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Email Address <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input
                      id="nl-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-describedby={errors.email ? 'nl-email-error' : undefined}
                      aria-invalid={!!errors.email}
                      className={cn(
                        'w-full rounded-xl bg-surface-2 border px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all',
                        errors.email ? 'border-red-500/50' : 'border-white/10'
                      )}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p id="nl-email-error" role="alert" className="mt-1.5 text-xs text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    icon={<ArrowRight className="h-5 w-5" />}
                  >
                    Subscribe — It&apos;s Free
                  </Button>
                  {serverError && (
                    <p role="alert" className="flex items-center gap-1.5 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      {serverError}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 text-center">
                    No spam. Unsubscribe anytime. View our{' '}
                    <a href="/privacy" className="underline hover:text-slate-400">Privacy Policy</a>.
                  </p>
                </form>
              )}
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
