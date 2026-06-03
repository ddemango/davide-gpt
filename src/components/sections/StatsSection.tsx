'use client';

import { motion } from 'framer-motion';
import { stats } from '@/lib/data';
import SectionWrapper from '@/components/ui/SectionWrapper';

export default function StatsSection() {
  return (
    <SectionWrapper dark className="border-y border-white/[0.06]">
      <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="text-center"
          >
            <dt className="text-sm text-slate-500 mt-2">{stat.label}</dt>
            <dd className="font-display text-4xl font-bold md:text-5xl">
              <span className="text-gradient">{stat.value}</span>
              {stat.suffix && (
                <span className="text-white">{stat.suffix}</span>
              )}
            </dd>
          </motion.div>
        ))}
      </dl>
    </SectionWrapper>
  );
}
