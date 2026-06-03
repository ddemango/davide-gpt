import type { Metadata } from 'next';
import { Mail, Calendar, MessageCircle, Clock } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ContactForm from '@/components/forms/ContactForm';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact Davide — Get in Touch',
  description:
    'Have a question or want to work together? Reach out to Davide at DavideGPT. Response within 24 hours.',
  alternates: { canonical: '/contact' },
};

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    value: siteConfig.email,
    description: 'Best for general enquiries and partnerships',
    link: `mailto:${siteConfig.email}`,
  },
  {
    icon: Calendar,
    title: 'Book a Call',
    value: 'Schedule 30 min',
    description: 'Personalized AI learning advice or collaboration discussion',
    link: siteConfig.calendly,
  },
  {
    icon: MessageCircle,
    title: 'Community',
    value: 'Join Discord',
    description: 'Get answers from Davide and 10K+ community members',
    link: '/community',
  },
];

export default function ContactPage() {
  return (
    <>
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: 'Home', url: 'https://davidegpt.ai' },
          { name: 'Contact', url: 'https://davidegpt.ai/contact' },
        ]}
      />

      {/* Header */}
      <section className="relative overflow-hidden pt-16 pb-12 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative z-10 text-center max-w-3xl mx-auto">
          <Badge variant="brand" size="md" className="mb-5">Get in Touch</Badge>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl leading-tight mb-4">
            Let&apos;s{' '}
            <span className="text-gradient">Connect</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Whether you have a question, want to collaborate, or just want to say hello —
            I read every message and respond within 24 hours.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Contact methods */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white mb-5">Other Ways to Reach Me</h2>
            {contactMethods.map(({ icon: Icon, title, value, description, link }) => (
              <a
                key={title}
                href={link}
                target={link.startsWith('http') ? '_blank' : undefined}
                rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                <Card hover className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                    <Icon className="h-5 w-5 text-brand-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{title}</p>
                    <p className="text-brand-400 text-sm font-medium">{value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                  </div>
                </Card>
              </a>
            ))}

            {/* Response time */}
            <Card className="flex items-center gap-3" padding="sm">
              <Clock className="h-5 w-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-white">Response Time</p>
                <p className="text-xs text-slate-400">Typically within 24 hours on business days</p>
              </div>
            </Card>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-white mb-6">Send a Message</h2>
            <Card padding="lg">
              <ContactForm />
            </Card>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
