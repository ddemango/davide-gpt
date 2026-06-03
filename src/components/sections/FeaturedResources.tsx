'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Lock, ArrowRight, BookOpen, FileText, Video, Wrench, Layout } from 'lucide-react';
import { resources } from '@/lib/data';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import type { Resource } from '@/types';

const typeIcons: Record<Resource['type'], React.ElementType> = {
  Guide: BookOpen,
  'Prompt Pack': FileText,
  Video: Video,
  Toolkit: Wrench,
  Template: Layout,
};

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const Icon = typeIcons[resource.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link href={`/resources/${resource.slug}`} className="group block h-full">
        <Card hover glow className="h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative h-44 rounded-xl overflow-hidden bg-gradient-to-br from-surface-3 to-surface-2 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-accent-600/20" />
            <Icon className="h-12 w-12 text-brand-400 relative z-10" aria-hidden="true" />
            {/* Category label */}
            <div className="absolute top-3 left-3">
              <Badge variant="brand" size="sm">{resource.category}</Badge>
            </div>
            {/* Free/Paid */}
            <div className="absolute top-3 right-3">
              <Badge variant={resource.isFree ? 'free' : 'paid'} size="sm">
                {resource.isFree ? '✦ Free' : `$${resource.price}`}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neutral" size="sm">{resource.type}</Badge>
              <Badge variant="neutral" size="sm">{resource.level}</Badge>
            </div>
            <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors leading-snug mb-2">
              {resource.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed flex-1">
              {resource.description}
            </p>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/[0.06]">
              {resource.downloadCount && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  {resource.downloadCount.toLocaleString()} downloads
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
    </motion.div>
  );
}

export default function FeaturedResources() {
  const featured = resources.filter((r) => r.featured).slice(0, 6);

  return (
    <SectionWrapper id="resources">
      <SectionHeader
        eyebrow="Free Resources"
        title={
          <>
            Start Learning{' '}
            <span className="text-gradient">AI Today</span>
          </>
        }
        description="Practical guides, prompt packs, and toolkits built for real-world use. No fluff, no theory — just proven systems that work."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((resource, index) => (
          <ResourceCard key={resource.slug} resource={resource} index={index} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/resources">
          <Button
            variant="secondary"
            size="lg"
            icon={<ArrowRight className="h-5 w-5" />}
          >
            View All Resources
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  );
}
