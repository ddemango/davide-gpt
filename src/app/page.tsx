import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import FeaturedResources from '@/components/sections/FeaturedResources';
import AboutSection from '@/components/sections/AboutSection';
import HowItWorks from '@/components/sections/HowItWorks';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import NewsletterCTA from '@/components/sections/NewsletterCTA';
import BlogPreview from '@/components/sections/BlogPreview';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { faqItems } from '@/lib/data';
import { getResources, getBlogPosts } from '@/lib/notion';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'DavideGPT — Master AI. Own Your Future.',
  description:
    'Free AI guides, prompt packs, and tutorials for anyone who wants to learn ChatGPT, Claude, and AI tools from scratch. Trusted by 500K+ learners worldwide.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [resources, blogPosts] = await Promise.all([getResources(), getBlogPosts()]);

  return (
    <>
      <SchemaMarkup type="faq" items={faqItems} />
      <HeroSection />
      <StatsSection />
      <FeaturedResources resources={resources} />
      <HowItWorks />
      <AboutSection />
      <TestimonialsSection />
      <NewsletterCTA />
      <BlogPreview posts={blogPosts} />
      <FAQSection />
      <CTASection />
    </>
  );
}
