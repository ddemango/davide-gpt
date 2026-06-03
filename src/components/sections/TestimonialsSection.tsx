'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/lib/data';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Card className="h-full flex flex-col relative overflow-hidden">
        {/* Background quote mark */}
        <Quote
          className="absolute -top-2 -right-2 h-16 w-16 text-brand-500/5 rotate-180"
          aria-hidden="true"
        />

        {/* Stars */}
        <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-slate-300 text-sm leading-relaxed flex-1 mb-4">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{testimonial.name}</p>
            <p className="text-xs text-slate-500">
              {testimonial.role}
              {testimonial.handle && (
                <span className="ml-1 text-brand-400">{testimonial.handle}</span>
              )}
            </p>
          </div>
          <span className="ml-auto text-xs text-slate-600 capitalize">{testimonial.platform}</span>
        </div>
      </Card>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <SectionWrapper dark id="testimonials">
      <SectionHeader
        eyebrow="What People Say"
        title={
          <>
            Real Results from{' '}
            <span className="text-gradient">Real People</span>
          </>
        }
        description="Join 50,000+ students and creators who've transformed how they work with AI using DavideGPT resources."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
