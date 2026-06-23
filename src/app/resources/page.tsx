import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getResources } from '@/lib/notion';
import SectionHeader from '@/components/ui/SectionHeader';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import ResourcesGrid from '@/components/sections/ResourcesGrid';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free AI Resources — Guides, Prompts & Toolkits',
  description:
    'Browse 200+ free AI resources including ChatGPT guides, prompt packs, Claude tutorials, and AI toolkits. Download instantly, no signup required for most.',
  alternates: { canonical: '/resources' },
  openGraph: {
    title: 'Free AI Resources — DavideGPT',
    description: '200+ free AI guides, prompts, and toolkits. Start learning AI today.',
  },
};

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <>
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://davidegpt.ai' },
          { name: 'Resources', url: 'https://davidegpt.ai/resources' },
        ]}
      />

      {/* Page Header */}
      <section className="relative overflow-hidden pt-16 pb-12 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10">
          <SectionHeader
            eyebrow="200+ Resources"
            title={
              <>
                AI Resources,{' '}
                <span className="text-gradient">Yours to Keep</span>
              </>
            }
            description="Practical guides, prompt packs, and toolkits built for real-world results. Most are completely free — no email required to download."
          />
        </div>
      </section>

      {/* Suspense required by useSearchParams inside ResourcesGrid */}
      <Suspense>
        <ResourcesGrid resources={resources} />
      </Suspense>
    </>
  );
}
