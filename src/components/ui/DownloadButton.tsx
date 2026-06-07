'use client';

import { Download, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  content: string;
  filename: string;
  label?: string;
  fullWidth?: boolean;
}

export default function DownloadButton({ content, filename, label = 'Download Free', fullWidth = true }: Props) {
  const [downloaded, setDownloaded] = useState(false);

  function handleDownload() {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  return (
    <button
      onClick={handleDownload}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-6 py-3.5 text-sm transition-all ${
        fullWidth ? 'w-full' : ''
      } ${
        downloaded
          ? 'bg-emerald-500 text-white'
          : 'bg-brand-500 hover:bg-brand-400 active:bg-brand-600 text-white'
      }`}
    >
      {downloaded ? (
        <>
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Downloaded!
        </>
      ) : (
        <>
          <Download className="h-5 w-5" aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  );
}
