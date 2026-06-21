'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { contactSchema, type ContactFormData } from '@/lib/validations';
import { getStoredUTM } from '@/lib/utm';
import { Analytics } from '@/lib/analytics';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const interestOptions = [
  { value: '', label: 'What are you interested in?' },
  { value: 'resources', label: 'Free Resources & Guides' },
  { value: 'newsletter', label: 'Newsletter & Updates' },
  { value: 'community', label: 'Joining the Community' },
  { value: 'coaching', label: '1-on-1 AI Coaching' },
  { value: 'collaboration', label: 'Collaboration / Partnership' },
  { value: 'other', label: 'Something Else' },
];

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      interest: '',
      message: '',
      consent: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    Analytics.formStart('contact');
    const utm = getStoredUTM();

    const payload = {
      ...data,
      ...utm,
    };

    try {
      // Connect to your backend — choose one:
      // Option 1 — API route:
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit');

      // Option 2 — Zapier webhook:
      // await fetch(process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK!, { method: 'POST', body: JSON.stringify(payload) })

      Analytics.formSubmit('contact');
      setStatus('success');
      reset();
    } catch {
      Analytics.formError('contact', 'submission_failed');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-10 text-center" role="alert">
        <CheckCircle2 className="h-12 w-12 text-emerald-400" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-white">Message Received!</h3>
        <p className="text-slate-400">Thanks for reaching out. I'll get back to you within 24 hours.</p>
        <Button variant="secondary" onClick={() => setStatus('idle')}>Send Another</Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact form"
      className="space-y-5"
    >
      {status === 'error' && (
        <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm" role="alert">
          <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          Something went wrong. Please try again or email me directly.
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="First Name"
          id="firstName"
          type="text"
          placeholder="Davide"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <FormField
          label="Last Name"
          id="lastName"
          type="text"
          placeholder="Smith"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <FormField
        label="Email Address"
        id="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <FormField
        label="Phone (optional)"
        id="phone"
        type="tel"
        placeholder="+1 (555) 000-0000"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />

      {/* Interest select */}
      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-slate-300 mb-1.5">
          What are you interested in? <span className="text-red-400" aria-label="required">*</span>
        </label>
        <select
          id="interest"
          aria-describedby={errors.interest ? 'interest-error' : undefined}
          aria-invalid={!!errors.interest}
          className={cn(
            'w-full rounded-xl bg-surface-2 border px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none',
            errors.interest ? 'border-red-500/50' : 'border-white/10'
          )}
          {...register('interest')}
        >
          {interestOptions.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.value === ''}
              className="bg-surface-2"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {errors.interest && (
          <p id="interest-error" role="alert" className="mt-1.5 text-xs text-red-400">
            {errors.interest.message}
          </p>
        )}
      </div>

      {/* Message textarea */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1.5">
          Message <span className="text-red-400" aria-label="required">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell me what you're working on and how I can help..."
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={!!errors.message}
          className={cn(
            'w-full rounded-xl bg-surface-2 border px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none',
            errors.message ? 'border-red-500/50' : 'border-white/10'
          )}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              className="peer sr-only"
              aria-describedby={errors.consent ? 'consent-error' : undefined}
              aria-invalid={!!errors.consent}
              {...register('consent')}
            />
            {/* Custom checkbox box */}
            <div className={cn(
              'h-5 w-5 rounded border-2 transition-all',
              'peer-checked:bg-brand-500 peer-checked:border-brand-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface',
              errors.consent ? 'border-red-500 bg-red-500/10' : 'border-white/40 bg-surface-2'
            )} />
            {/* Checkmark */}
            <svg
              className="absolute inset-0 h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none p-[3px]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="3,8 7,12 13,4" />
            </svg>
          </div>
          <span className="text-sm text-slate-400 leading-relaxed">
            I agree to be contacted by Davide regarding my inquiry. View our{' '}
            <a href="/privacy" className="text-brand-400 underline hover:text-brand-300">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-1.5 text-xs text-red-400">
            {errors.consent.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
      >
        Send Message
      </Button>
    </form>
  );
}

// Reusable input field component (internal)
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const FormField = ({ label, id, error, ...props }: FormFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
      {label}
      {props.required !== false && props.type !== 'tel' && (
        <span className="text-red-400 ml-1" aria-label="required">*</span>
      )}
    </label>
    <input
      id={id}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={!!error}
      className={cn(
        'w-full rounded-xl bg-surface-2 border px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all',
        error ? 'border-red-500/50' : 'border-white/10'
      )}
      {...props}
    />
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
        {error}
      </p>
    )}
  </div>
);
