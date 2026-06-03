'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Download, Lock, BookOpen, FileText, Video, Wrench, Layout, Search } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import SectionWrapper from '@/components/ui/SectionWrapper';
import type { Resource } from '@/types';

const categories = ['All', 'ChatGPT', 'Claude', 'Content', 'Productivity', 'Business', 'Tools'];

const typeIcons: Record<Resource['type'], React.ElementType> = {
  Guide: BookOpen,
  'Prompt Pack': FileText,
  Video: Video,
  Toolkit: Wrench,
  Template: Layout,
};

interface Props {
  resources: Resource[];
}

export default function ResourcesGrid({ resources }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let result = resources;

    if (activeCategory !== 'All') {
      result = result.filter(
        (r) => r.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [resources, activeCategory, query]);

  return (
    <>
      {/* Filters + Search */}
      <section className="relative overflow-hidden pt-16 pb-12 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10">
          {/* Category filter buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-surface-1 border-white/[0.08] text-slate-400 hover:text-white hover:border-brand-500/40'
                }`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources…"
              className="w-full rounded-xl bg-surface-1 border border-white/[0.08] pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              aria-label="Search resources"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <SectionWrapper>
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-16">
            No resources found. Try a different category or search term.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => {
              const Icon = typeIcons[resource.type] ?? BookOpen;
              return (
                <Link
                  key={resource.slug}
                  href={`/resources/${resource.slug}`}
                  className="group block h-full"
                >
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
                      <p className="text-sm text-slate-400 leading-relaxed flex-1">
                        {resource.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/[0.06]">
                        {resource.downloadCount && (
                          <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Download className="h-3.5 w-3.5" aria-hidden="true" />
                            {resource.downloadCount.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-sm font-medium text-brand-400 group-hover:gap-2 transition-all ml-auto">
                          {resource.isFree ? (
                            <>
                              <Download className="h-4 w-4" aria-hidden="true" />
                              Get Free
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" aria-hidden="true" />
                              Get Access
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
