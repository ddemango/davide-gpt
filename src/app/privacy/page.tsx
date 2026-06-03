import type { Metadata } from 'next';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for DavideGPT.ai — how we collect, use, and protect your information.',
  alternates: { canonical: '/privacy' },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: January 2024</p>

        <div className="prose-custom space-y-8 text-slate-300">
          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed text-slate-400">
              We collect information you voluntarily provide, including your name, email address, and
              any other details submitted through our forms. We also collect analytics data automatically
              (page views, device type, location) through tools like Google Analytics 4.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed text-slate-400">
              We use your information to respond to enquiries, send the newsletter you subscribed to,
              improve our website and resources, and occasionally notify you about new content. We do not
              sell, rent, or share your data with third parties for their marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">3. Email Communications</h2>
            <p className="leading-relaxed text-slate-400">
              If you subscribe to our newsletter, you can unsubscribe at any time using the link in any
              email. We use a third-party email service provider to send emails — they only receive the
              data required to deliver your emails.
            </p>
          </section>

          <section id="cookies">
            <h2 className="font-display text-xl font-bold text-white mb-3">4. Cookies</h2>
            <p className="leading-relaxed text-slate-400">
              We use cookies for analytics (GA4) and functionality. You can control cookie settings
              through your browser. Essential cookies required for the site to function properly cannot
              be disabled.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">5. Your Rights</h2>
            <p className="leading-relaxed text-slate-400">
              Depending on your location, you may have the right to access, correct, or delete your
              personal data. To exercise these rights or ask any privacy questions, contact us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-brand-400 hover:text-brand-300 underline">
                {siteConfig.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">6. Contact</h2>
            <p className="leading-relaxed text-slate-400">
              For any privacy-related questions, email us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-brand-400 hover:text-brand-300 underline">
                {siteConfig.email}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </SectionWrapper>
  );
}
