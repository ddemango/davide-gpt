'use client';

import { useState } from 'react';
import { Download, X, CheckCircle2, Mail, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  slug: string;
  resourceTitle: string;
  label?: string;
  fullWidth?: boolean;
}

export default function EmailGateDownload({
  slug,
  resourceTitle,
  label = 'Download Free',
  fullWidth = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function triggerDownload(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/resources/${slug}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      if (res.ok) {
        const { content, filename } = await res.json();
        triggerDownload(content, filename);
        setStatus('success');
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  function handleClose() {
    if (status === 'loading') return;
    setOpen(false);
    if (status !== 'success') {
      setStatus('idle');
      setErrorMsg('');
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-400 active:bg-brand-600 text-white font-semibold px-6 py-3.5 text-sm transition-all ${
          fullWidth ? 'w-full' : ''
        }`}
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        {label}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gate-title"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-surface border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 p-6">

              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Your download is starting!
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Check your downloads folder. You&apos;re also subscribed to weekly AI tips from Davide — unsubscribe anytime.
                  </p>
                  <button
                    onClick={() => { setOpen(false); }}
                    className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="pr-4">
                      <h3 id="gate-title" className="font-display text-lg font-bold text-white mb-1">
                        Get your free resource
                      </h3>
                      <p className="text-sm text-slate-400 leading-snug">{resourceTitle}</p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Value prop */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-5">
                    <Mail className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-brand-300 leading-relaxed">
                      Enter your email to download instantly + get weekly AI tips from Davide.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name (optional)"
                      autoComplete="given-name"
                      className="w-full rounded-xl bg-surface-2 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-all"
                    />

                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                          if (status === 'error') setStatus('idle');
                        }}
                        placeholder="Your email address *"
                        autoComplete="email"
                        required
                        aria-describedby={errorMsg ? 'gate-error' : undefined}
                        aria-invalid={!!errorMsg}
                        className={`w-full rounded-xl bg-surface-2 border px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-all ${
                          errorMsg ? 'border-red-500/50' : 'border-white/10'
                        }`}
                      />
                      {errorMsg && (
                        <p id="gate-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                          {errorMsg}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 text-sm transition-all"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Getting your file…
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" aria-hidden="true" />
                          Download Free
                        </>
                      )}
                    </button>

                    <p className="text-xs text-slate-600 text-center leading-relaxed">
                      No spam. Unsubscribe anytime. By downloading you agree to our{' '}
                      <a href="/privacy" className="underline hover:text-slate-400 transition-colors">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
