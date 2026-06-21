import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { getBlogPosts } from '@/lib/notion';
import { formatDate } from '@/lib/utils';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import NewsletterCTA from '@/components/sections/NewsletterCTA';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'AI Blog — Tips, Tutorials & Tool Reviews',
  description:
    'Weekly AI insights, ChatGPT tutorials, tool reviews, and prompt engineering guides. Learn how to master AI tools from a creator with 500K+ followers.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  const featured = blogPosts.find((p) => p.featured);
  const rest = blogPosts.filter((p) => p !== featured);

  return (
    <>
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://davidegpt.ai' },
          { name: 'Blog', url: 'https://davidegpt.ai/blog' },
        ]}
      />

      {/* Header */}
      <section className="relative overflow-hidden pt-16 pb-12 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10">
          <SectionHeader
            eyebrow="AI Blog"
            title={
              <>
                Insights, Tutorials &{' '}
                <span className="text-gradient">Tool Reviews</span>
              </>
            }
            description="Practical AI articles published weekly. No fluff, no hype — just actionable strategies you can use today."
          />
        </div>
      </section>

      <SectionWrapper>
        {/* Featured post */}
        {featured && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-6">Featured Article</h2>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <Card hover glow className="grid grid-cols-1 gap-6 md:grid-cols-2" padding="none">
                {/* Thumbnail */}
                <div className="h-64 md:h-full min-h-[280px] rounded-l-2xl md:rounded-r-none rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-600/20 flex items-center justify-center relative overflow-hidden">
                  {featured.thumbnail ? (
                    <Image src={featured.thumbnail} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10 group-hover:from-brand-600/20 group-hover:to-accent-600/20 transition-all" />
                      <Tag className="h-16 w-16 text-slate-600 relative z-10" aria-hidden="true" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <Badge variant="brand" size="md">{featured.category}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                    <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {featured.readTime}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white group-hover:text-brand-300 transition-colors leading-snug mb-3">
                    {featured.title}
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-6">{featured.excerpt}</p>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-brand-400 group-hover:gap-2.5 transition-all">
                    Read Article <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* All posts grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
              <Card hover glow className="h-full flex flex-col">
                <div className="h-44 rounded-xl bg-gradient-to-br from-surface-2 to-surface-3 mb-4 flex items-center justify-center relative overflow-hidden">
                  {post.thumbnail ? (
                    <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10 transition-all" />
                      <Tag className="h-10 w-10 text-slate-600 relative z-10" aria-hidden="true" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-3 left-3 z-20">
                    <Badge variant="brand" size="sm">{post.category}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="font-semibold text-white group-hover:text-brand-300 transition-colors leading-snug mb-2 flex-1">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{post.excerpt}</p>
                <span className="flex items-center gap-1.5 text-sm font-medium text-brand-400 group-hover:gap-2.5 transition-all">
                  Read Article <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <NewsletterCTA />
    </>
  );
}
