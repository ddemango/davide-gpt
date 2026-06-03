'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { blogPosts as staticBlogPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import type { BlogPost } from '@/types';

interface BlogPreviewProps {
  posts?: BlogPost[];
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  const allPosts = posts ?? staticBlogPosts;
  const recent = allPosts.slice(0, 3);

  return (
    <SectionWrapper id="blog">
      <SectionHeader
        eyebrow="Latest Posts"
        title={
          <>
            AI Insights &{' '}
            <span className="text-gradient">Tutorials</span>
          </>
        }
        description="Practical articles, tool breakdowns, and strategy guides updated weekly."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {recent.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={`/blog/${post.slug}`} className="group block h-full">
              <Card hover glow className="h-full flex flex-col">
                {/* Thumbnail */}
                <div className="h-44 rounded-xl bg-gradient-to-br from-surface-2 to-surface-3 border border-white/[0.04] mb-4 flex items-center justify-center relative overflow-hidden">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10 group-hover:from-brand-600/20 group-hover:to-accent-600/20 transition-all" />
                      <Tag className="h-10 w-10 text-slate-600 relative z-10" aria-hidden="true" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-3 left-3 z-20">
                    <Badge variant="brand" size="sm">{post.category}</Badge>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors leading-snug mb-2 flex-1">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-4">{post.excerpt}</p>

                <span className="flex items-center gap-1.5 text-sm font-medium text-brand-400 group-hover:gap-2.5 transition-all">
                  Read Article
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/blog">
          <Button variant="secondary" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
            View All Articles
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  );
}
