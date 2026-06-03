import type { Metadata } from 'next';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for DavideGPT.ai.',
  alternates: { canonical: '/terms' },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: January 2024</p>

        <div className="space-y-8 text-slate-400">
          {[
            {
              title: '1. Acceptance of Terms',
              body: 'By accessing or using DavideGPT.ai, you agree to these Terms of Service. If you do not agree, please do not use the website.',
            },
            {
              title: '2. Use of Resources',
              body: 'Free resources are provided for personal and commercial use. You may not resell, redistribute, or claim ownership of the resources as your own. Paid resources include a personal license unless stated otherwise.',
            },
            {
              title: '3. Intellectual Property',
              body: 'All content on DavideGPT.ai — including guides, prompts, videos, and website design — is owned by Davide and DavideGPT unless stated otherwise. Unauthorized reproduction is prohibited.',
            },
            {
              title: '4. Disclaimer',
              body: 'Resources and content are provided "as is" without warranties of any kind. AI tools change rapidly; we do our best to keep content current but cannot guarantee accuracy at all times. Results from using AI tools vary and are not guaranteed.',
            },
            {
              title: '5. Limitation of Liability',
              body: 'DavideGPT is not liable for any indirect, incidental, or consequential damages arising from your use of the website or its resources.',
            },
            {
              title: '6. Changes to Terms',
              body: 'We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the new terms.',
            },
            {
              title: '7. Contact',
              body: `For any questions about these terms, contact us at ${siteConfig.email}.`,
            },
          ].map(({ title, body }) => (
            <section key={title}>
              <h2 className="font-display text-xl font-bold text-white mb-3">{title}</h2>
              <p className="leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
