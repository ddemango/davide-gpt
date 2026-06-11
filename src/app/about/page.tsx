import type { Metadata } from 'next';
import Link from 'next/link';
import AboutPhoto from '@/components/ui/AboutPhoto';
import {
  Youtube, Instagram, Twitter, Linkedin, ArrowRight,
  CheckCircle2, Calendar, Users, BookOpen, Star
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import NewsletterCTA from '@/components/sections/NewsletterCTA';
import CTASection from '@/components/sections/CTASection';
import { siteConfig, stats } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About Davide — AI Educator & Content Creator',
  description:
    'Meet Davide — the AI educator behind DavideGPT with 500K+ followers. Learn about his mission to make AI accessible to everyone through practical, jargon-free education.',
  alternates: { canonical: '/about' },
};

const milestones = [
  { year: '2013', event: 'Created Grampresso — an app that automated social media posting and growth in the background' },
  { year: '2024', event: 'Launched Advanta AI, an agency helping businesses automate workflows and eliminate time-consuming manual tasks' },
  { year: '2026', event: 'Created DavideGPT — teaching everyday people how to use AI to gain real knowledge, save time, and make it profitable' },
];

const socialLinks = [
  { label: 'YouTube', href: siteConfig.social.youtube, icon: Youtube, count: '200K+' },
  { label: 'Instagram', href: siteConfig.social.instagram, icon: Instagram, count: '180K+' },
  { label: 'Twitter/X', href: siteConfig.social.twitter, icon: Twitter, count: '80K+' },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: Linkedin, count: '40K+' },
];

const values = [
  {
    title: 'Practical Over Theoretical',
    description: 'Every guide, every tutorial, every tip has to be something you can use today. No abstract theory.',
  },
  {
    title: 'Accessible to Everyone',
    description: 'AI shouldn\'t be gatekept by technical expertise. I break down complex ideas into simple, actionable steps.',
  },
  {
    title: 'Always Free First',
    description: 'The majority of my content is free. I believe knowledge should be accessible before it asks for payment.',
  },
  {
    title: 'Honesty Over Hype',
    description: 'I call out AI tools that don\'t work as advertised and only recommend what I\'ve tested myself.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SchemaMarkup type="person" />
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://davidegpt.ai' },
          { name: 'About', url: 'https://davidegpt.ai/about' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="brand" size="md" className="mb-5">About Davide DeMango</Badge>
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl leading-tight mb-5">
                Teaching AI to{' '}
                <span className="text-gradient">the World</span>,{' '}
                One Guide at a Time
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                I'm Davide DeMango — an AI educator, content creator, and the founder of DavideGPT. I help
                everyday people understand and actually use AI tools to save time, create better
                work, and stay ahead in their careers and businesses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/resources">
                  <Button variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                    Explore Resources
                  </Button>
                </Link>
                <a href={siteConfig.calendly} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" icon={<Calendar className="h-5 w-5" />} iconPosition="left">
                    Book a Call
                  </Button>
                </a>
              </div>
            </div>

            {/* Photo + social proof */}
            <div className="relative">
              <AboutPhoto />

              {/* Floating stat */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-max">
                <Card className="flex items-center gap-4 px-6 py-3 shadow-xl" padding="none">
                  {stats.slice(0, 3).map((stat, i) => (
                    <div key={stat.label} className={`text-center ${i > 0 ? 'pl-4 border-l border-white/[0.06]' : ''}`}>
                      <p className="font-display text-2xl font-bold text-gradient">{stat.value}{stat.suffix}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <SectionWrapper>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start max-w-5xl mx-auto">
          <div>
            <SectionHeader
              eyebrow="My Story"
              title={<>How It All <span className="text-gradient">Started</span></>}
              centered={false}
            />
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                When ChatGPT launched in late 2022, I was immediately obsessed. Not just with what it could do —
                but with the gap between what most people thought it could do and what it was actually capable of.
              </p>
              <p>
                I started making short tutorial videos explaining how to use AI tools in plain English. Within 60
                days, I had 10,000 followers. Within a year, over 200,000. The message was clear: people desperately
                wanted someone to cut through the hype and just show them how to use these tools.
              </p>
              <p>
                Today, DavideGPT is home to 200+ free resources, a weekly newsletter reaching 30,000+ subscribers,
                and a growing community of people actively transforming how they work with AI.
              </p>
              <p>
                My goal remains the same as it was on day one: make AI education accessible, practical, and genuinely
                useful for everyone — not just tech insiders.
              </p>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-6">Key Milestones</h2>
            <div className="space-y-4 relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-brand-500 via-accent-500 to-transparent" aria-hidden="true" />
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex gap-5 pl-10 relative">
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-surface-2 border-2 border-brand-500 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-brand-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{year}</span>
                    <p className="text-slate-300 mt-0.5">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper dark>
        <SectionHeader
          eyebrow="What I Stand For"
          title={<>Core <span className="text-gradient">Values</span></>}
          description="These principles guide every piece of content I create and every resource I publish."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((value, i) => (
            <Card key={i} hover className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-brand-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-white mb-1">{value.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{value.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Social Links */}
      <SectionWrapper>
        <SectionHeader
          eyebrow="Follow Along"
          title={<>Find Me <span className="text-gradient">Everywhere</span></>}
          description="I publish AI tips, tutorials, and tool reviews across every major platform."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {socialLinks.map(({ label, href, icon: Icon, count }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card hover glow className="text-center">
                <div className="h-12 w-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-500/20 transition-colors">
                  <Icon className="h-6 w-6 text-brand-400" aria-hidden="true" />
                </div>
                <p className="font-display text-2xl font-bold text-white mb-1">{count}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </Card>
            </a>
          ))}
        </div>
      </SectionWrapper>

      <NewsletterCTA />
      <CTASection />
    </>
  );
}
