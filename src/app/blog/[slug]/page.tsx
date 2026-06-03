import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Clock, Tag, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import NewsletterCTA from '@/components/sections/NewsletterCTA';
import { siteConfig } from '@/lib/data';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <SchemaMarkup
        type="article"
        title={post.title}
        description={post.excerpt}
        publishedAt={post.publishedAt}
        url={`${siteConfig.url}/blog/${post.slug}`}
      />
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Blog', url: `${siteConfig.url}/blog` },
          { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
        ]}
      />

      {/* Article Header */}
      <section className="relative overflow-hidden pt-12 pb-12 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10 max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back to Blog
            </Link>
          </nav>

          <div className="flex flex-wrap gap-2 mb-5">
            <Badge variant="brand" size="md">{post.category}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
            ))}
          </div>

          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl leading-tight mb-5">
            {post.title}
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-8">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white">D</div>
              <span>Davide</span>
            </div>
            <span>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <SectionWrapper>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 max-w-6xl mx-auto">
          <article className="lg:col-span-3 prose-custom">
            {/* Hero thumbnail */}
            <div className="h-64 md:h-80 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-3 flex items-center justify-center mb-10 relative overflow-hidden border border-white/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/15 to-accent-600/15" />
              <Tag className="h-16 w-16 text-slate-600 relative z-10" aria-hidden="true" />
              <p className="absolute bottom-4 left-4 text-xs text-slate-600">[ Article hero image ]</p>
            </div>

            {/* Placeholder article body */}
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p className="text-lg font-medium text-slate-200">
                {post.excerpt}
              </p>
              <p>
                AI tools are transforming the way we work, create, and communicate. In this article, we'll break down
                everything you need to know about this topic — with practical, actionable steps you can start using today.
              </p>
              <h2 className="font-display text-2xl font-bold text-white pt-4">Why This Matters in 2024</h2>
              <p>
                The AI landscape changes rapidly. What worked six months ago may already be outdated. That's why staying
                current isn't just a competitive advantage — it's a necessity for anyone serious about leveraging these tools.
              </p>
              <h2 className="font-display text-2xl font-bold text-white pt-4">Getting Started</h2>
              <p>
                You don't need any technical background to get value from this. Whether you're a complete beginner or someone
                who's been experimenting with AI tools for a while, there's something here for you.
              </p>
              <p>
                The key is to focus on practical applications rather than theory. Every concept here has a direct,
                real-world use case that you can implement immediately.
              </p>
              <h2 className="font-display text-2xl font-bold text-white pt-4">The Bottom Line</h2>
              <p>
                AI tools like ChatGPT, Claude, and Gemini are not going away. In fact, they're getting more powerful
                by the month. The question isn't whether to use them — it's how to use them effectively.
              </p>
              <p className="text-slate-400 italic border-l-4 border-brand-500 pl-4">
                "The people who will thrive in the AI era are not those who resist it — they're those who learn to
                work alongside it." — Davide
              </p>
            </div>

            {/* Tags footer */}
            <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs text-slate-500 bg-white/[0.04] rounded-full px-3 py-1.5"
                >
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6" aria-label="Article sidebar">
            <Card padding="md">
              <h3 className="font-semibold text-white mb-4 text-sm">About the Author</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-brand flex items-center justify-center text-lg font-bold text-white flex-shrink-0">D</div>
                <div>
                  <p className="font-semibold text-white text-sm">Davide</p>
                  <p className="text-xs text-slate-500">AI Educator · 500K+ Followers</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Teaching AI to everyday people since 2022. No jargon, no fluff — just what works.
              </p>
              <Link href="/about" className="mt-4 block">
                <span className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                  Read more about Davide →
                </span>
              </Link>
            </Card>

            <Card padding="md">
              <h3 className="font-semibold text-white mb-4 text-sm">Free Resources</h3>
              <p className="text-xs text-slate-400 mb-4">
                Get free AI guides, prompts, and toolkits — updated weekly.
              </p>
              <Link href="/resources">
                <span className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                  Browse Resources <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </Link>
            </Card>
          </aside>
        </div>
      </SectionWrapper>

      {/* Related Posts */}
      {related.length > 0 && (
        <SectionWrapper dark>
          <h2 className="font-display text-2xl font-bold text-white mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                <Card hover className="h-full">
                  <Badge variant="brand" size="sm" className="mb-3">{p.category}</Badge>
                  <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">{p.excerpt}</p>
                  <span className="text-sm font-medium text-brand-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
