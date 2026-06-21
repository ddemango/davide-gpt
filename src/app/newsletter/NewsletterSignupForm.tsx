'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { newsletterSchema, type NewsletterFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';
import { Analytics } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export default function NewsletterSignupForm() {
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

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-emerald-400">
        <CheckCircle2 className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold text-white">You&apos;re in!</p>
          <p className="text-sm text-emerald-400">Check your inbox — your first email is on the way.</p>
        </div>
      </div>
    );
  }

  return (
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
  );
}
