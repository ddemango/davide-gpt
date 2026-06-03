import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import SchemaMarkup from '@/components/seo/SchemaMarkup';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://davidegpt.ai'),
  title: {
    template: '%s | DavideGPT — Master AI Tools',
    default: 'DavideGPT — Master AI. Own Your Future.',
  },
  description:
    'Free AI guides, prompt packs, and tutorials for anyone who wants to learn ChatGPT, Claude, and AI tools from scratch. Trusted by 500K+ learners.',
  keywords: [
    'AI tools', 'ChatGPT guide', 'Claude AI', 'prompt engineering', 'AI for beginners',
    'AI education', 'learn AI', 'AI tutorials', 'ChatGPT prompts', 'AI productivity',
    'DavideGPT', 'AI resources', 'Gemini AI',
  ],
  authors: [{ name: 'Davide', url: 'https://davidegpt.ai/about' }],
  creator: 'Davide',
  publisher: 'DavideGPT',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://davidegpt.ai',
    siteName: 'DavideGPT',
    title: 'DavideGPT — Master AI. Own Your Future.',
    description:
      'Free AI guides, prompt packs, and tutorials for anyone who wants to learn ChatGPT, Claude, and AI tools. 500K+ learners worldwide.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'DavideGPT — Master AI. Own Your Future.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@davidegpt',
    creator: '@davidegpt',
    title: 'DavideGPT — Master AI. Own Your Future.',
    description:
      'Free AI guides, prompt packs, and tutorials for anyone who wants to learn ChatGPT, Claude, and AI tools.',
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: 'https://davidegpt.ai',
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* GA4 — Replace G-XXXXXXXXXX with your real Measurement ID */}
        {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    anonymize_ip: true
                  });
                `,
              }}
            />
          </>
        )}
        <SchemaMarkup type="website" />
        <SchemaMarkup type="person" />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-slate-100">
        {/* Skip to content — accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <AnnouncementBar />
        <Header />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
