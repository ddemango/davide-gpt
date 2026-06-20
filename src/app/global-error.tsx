'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: '#0a0a0f', margin: 0, fontFamily: 'sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <AlertTriangle style={{ width: 32, height: 32, color: '#f87171' }} />
            </div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: 32, lineHeight: 1.6 }}>
              A critical error occurred. Please refresh the page.
            </p>
            <button
              onClick={reset}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#6366f1', color: '#fff', border: 'none',
                borderRadius: 12, padding: '12px 24px', fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              <RefreshCw style={{ width: 16, height: 16 }} />
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
