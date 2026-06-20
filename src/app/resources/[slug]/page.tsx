import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Lock, ChevronLeft, BookOpen, Tag, Clock,
  Users, Star, CheckCircle2, ArrowRight, Download,
} from 'lucide-react';
import { resources } from '@/lib/data';
import { getResourceBySlug, getResources } from '@/lib/notion';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import NewsletterCTA from '@/components/sections/NewsletterCTA';
import EmailGateDownload from '@/components/ui/EmailGateDownload';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) return {};
  return {
    title: resource.title,
    description: resource.description,
    alternates: { canonical: `/resources/${resource.slug}` },
    openGraph: {
      title: `${resource.title} — DavideGPT`,
      description: resource.description,
      type: 'article',
    },
  };
}

const whatYouGetItems = [
  'Step-by-step guide with real examples',
  'Copy-paste ready templates and prompts',
  'Works with free and paid AI tools',
  'Regular updates as AI tools evolve',
  'Exclusive tips not published anywhere else',
];

export default async function ResourcePage({ params }: Props) {
  const [resource, allResources] = await Promise.all([
    getResourceBySlug(params.slug),
    getResources(),
  ]);
  if (!resource) notFound();

  const hasContent = !!resource.notionId;

  const related = allResources
    .filter((r) => r.slug !== resource.slug && r.category === resource.category)
    .slice(0, 3);

  return (
    <>
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://davidegpt.ai' },
          { name: 'Resources', url: 'https://davidegpt.ai/resources' },
          { name: resource.title, url: `https://davidegpt.ai/resources/${resource.slug}` },
        ]}
      />

      {/* Header */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back to Resources
            </Link>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left — Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="brand" size="md">{resource.category}</Badge>
                <Badge variant="neutral" size="md">{resource.type}</Badge>
                <Badge variant="neutral" size="md">{resource.level}</Badge>
                <Badge variant={resource.isFree ? 'free' : 'paid'} size="md">
                  {resource.isFree ? '✦ Free' : `$${resource.price}`}
                </Badge>
              </div>

              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl leading-tight mb-4">
                {resource.title}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                {resource.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-8 pb-8 border-b border-white/[0.06]">
                {resource.downloadCount && (
                  <span className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-brand-400" aria-hidden="true" />
                    {resource.downloadCount.toLocaleString()} downloads
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                  4.9/5 rating
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-400" aria-hidden="true" />
                  All skill levels
                </span>
                {resource.duration && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-400" aria-hidden="true" />
                    {resource.duration}
                  </span>
                )}
              </div>

              {/* What's Included — always shown as a teaser */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-bold text-white mb-4">
                  What&apos;s Inside
                </h2>
                <ul className="space-y-3" role="list">
                  {whatYouGetItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-brand-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Locked content preview */}
              {hasContent && (
                <div className="relative rounded-2xl border border-white/[0.06] overflow-hidden">
                  {/* Blurred placeholder */}
                  <div className="space-y-3 p-6 select-none pointer-events-none" aria-hidden="true">
                    {['Introduction to the framework', 'Section 1: Core concepts explained', 'Section 2: Step-by-step walkthrough', '15+ prompt templates included', 'Real-world examples and results'].map((line, i) => (
                      <div
                        key={i}
                        className="h-4 rounded bg-white/[0.06]"
                        style={{ width: `${[90, 75, 85, 65, 80][i]}%` }}
                      />
                    ))}
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent flex flex-col items-center justify-end pb-8">
                    <div className="h-10 w-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mb-3">
                      <Lock className="h-5 w-5 text-brand-400" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium text-white mb-1">Full content unlocked on download</p>
                    <p className="text-xs text-slate-500">Enter your email below to get instant access</p>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8">
                {resource.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-slate-500 bg-white/[0.04] rounded-full px-3 py-1">
                    <Tag className="h-3 w-3" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — CTA Card */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card className="border-gradient" padding="lg">
                <div className="h-48 rounded-xl bg-gradient-to-br from-brand-600/20 to-accent-600/20 flex items-center justify-center mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10" />
                  <BookOpen className="h-16 w-16 text-brand-400 relative z-10" aria-hidden="true" />
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-display font-bold text-white mb-1">
                    {resource.isFree ? 'Free' : `$${resource.price}`}
                  </div>
                  <p className="text-sm text-slate-400">
                    {resource.isFree ? 'Enter your email to download' : 'One-time payment. Lifetime access.'}
                  </p>
                </div>

                {resource.isFree ? (
                  hasContent ? (
                    <EmailGateDownload
                      slug={resource.slug}
                      resourceTitle={resource.title}
                      label="Download Free"
                    />
                  ) : (
                    // No content yet — show newsletter subscribe instead
                    <a
                      href="/newsletter"
                      className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3.5 text-sm transition-colors"
                    >
                      <Download className="h-5 w-5" aria-hidden="true" />
                      Join Waitlist — Get Notified
                    </a>
                  )
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3.5 text-sm transition-colors cursor-pointer">
                    <Lock className="h-5 w-5" aria-hidden="true" />
                    Get Access — ${resource.price}
                  </div>
                )}

                <p className="text-center text-xs text-slate-500 mt-3">
                  {resource.isFree
                    ? 'No spam. Unsubscribe anytime.'
                    : 'Secure checkout. Instant access.'}
                </p>

                <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-3 text-sm text-slate-400">
                  {['Instant download', 'Commercial use included', 'Free lifetime updates'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      {related.length > 0 && (
        <SectionWrapper dark>
          <h2 className="font-display text-2xl font-bold text-white mb-8">
            More {resource.category} Resources
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/resources/${r.slug}`} className="group block">
                <Card hover className="h-full">
                  <Badge variant="brand" size="sm" className="mb-3">{r.category}</Badge>
                  <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors mb-2 leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{r.description}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-400 group-hover:gap-2 transition-all">
                    View Resource <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </SectionWrapper>
      )}

      <NewsletterCTA />
    </>
  );
}
