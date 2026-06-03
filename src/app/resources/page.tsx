import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Lock, BookOpen, FileText, Video, Wrench, Layout, Search } from 'lucide-react';
import { resources } from '@/lib/data';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import type { Resource } from '@/types';

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

const categories = ['All', 'ChatGPT', 'Claude', 'Content', 'Productivity', 'Business', 'Tools'];

const typeIcons: Record<Resource['type'], React.ElementType> = {
  Guide: BookOpen,
  'Prompt Pack': FileText,
  Video: Video,
  Toolkit: Wrench,
  Template: Layout,
};

export default function ResourcesPage() {
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

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  cat === 'All'
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-surface-1 border-white/[0.08] text-slate-400 hover:text-white hover:border-brand-500/40'
                }`}
                aria-pressed={cat === 'All'}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search placeholder */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search resources…"
              className="w-full rounded-xl bg-surface-1 border border-white/[0.08] pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              aria-label="Search resources"
            />
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <SectionWrapper>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => {
            const Icon = typeIcons[resource.type];
            return (
              <Link key={resource.slug} href={`/resources/${resource.slug}`} className="group block h-full">
                <Card hover glow className="h-full flex flex-col">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-gradient-to-br from-surface-3 to-surface-2 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-accent-600/20" />
                    <Icon className="h-12 w-12 text-brand-400 relative z-10" aria-hidden="true" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="brand" size="sm">{resource.category}</Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant={resource.isFree ? 'free' : 'paid'} size="sm">
                        {resource.isFree ? '✦ Free' : `$${resource.price}`}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="neutral" size="sm">{resource.type}</Badge>
                      <Badge variant="neutral" size="sm">{resource.level}</Badge>
                    </div>
                    <h2 className="font-semibold text-white group-hover:text-brand-300 transition-colors leading-snug mb-2">
                      {resource.title}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed flex-1">{resource.description}</p>
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      {resource.downloadCount && (
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          {resource.downloadCount.toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-sm font-medium text-brand-400 group-hover:gap-2 transition-all ml-auto">
                        {resource.isFree ? (
                          <><Download className="h-4 w-4" aria-hidden="true" />Get Free</>
                        ) : (
                          <><Lock className="h-4 w-4" aria-hidden="true" />Get Access</>
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
}
