'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { newsletterSchema, type NewsletterFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';
import { Analytics } from '@/lib/analytics';

export default function NewsletterCTA() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    Analytics.formStart('newsletter_hero');
    try {
      // Connect to your email provider:
      // Option 1 — API route: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify(data) })
      // Option 2 — ConvertKit: POST to https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
      // Option 3 — Zapier: POST to process.env.ZAPIER_WEBHOOK_URL
      await new Promise((r) => setTimeout(r, 800)); // Remove this line in production
      Analytics.newsletterSignup('homepage_cta');
      setSubmitted(true);
    } catch {
      // Handle error — show a toast or error message
    }
  };

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      aria-labelledby="newsletter-cta-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-accent-600/20 to-brand-600/20" aria-hidden="true" />
      <div className="absolute inset-0 bg-surface-1/80" aria-hidden="true" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/20 rounded-full blur-[100px]" aria-hidden="true" />

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-xl shadow-brand-600/30">
              <Mail className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
          </div>

          <h2
            id="newsletter-cta-heading"
            className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl leading-tight mb-4"
          >
            Get Weekly AI Insights{' '}
            <span className="text-gradient">Delivered Free</span>
          </h2>

          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Join 30,000+ subscribers getting the latest AI tool breakdowns, prompts, and strategies
            every week. No spam, ever.
          </p>

          {/* Perks */}
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-sm text-slate-400">
            {[
              '✦ Weekly AI tool reviews',
              '✦ Exclusive prompt packs',
              '✦ Early resource access',
              '✦ No spam, unsubscribe anytime',
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-6 py-4 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <p className="font-medium">You're in! Check your inbox for a welcome email.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              noValidate
              aria-label="Newsletter signup form"
            >
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
                  aria-invalid={!!errors.email}
                  className="w-full rounded-xl bg-surface-2 border border-white/10 px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  {...register('email')}
                />
                {errors.email && (
                  <p id="newsletter-email-error" role="alert" className="mt-1.5 text-xs text-red-400 text-left">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                icon={<ArrowRight className="h-5 w-5" />}
                className="flex-shrink-0"
              >
                Subscribe Free
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-slate-600">
            By subscribing, you agree to our{' '}
            <a href="/privacy" className="underline hover:text-slate-400">Privacy Policy</a>.
            Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
