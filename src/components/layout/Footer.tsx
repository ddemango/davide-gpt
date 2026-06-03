'use client';

import Link from 'next/link';
import { Sparkles, Youtube, Instagram, Twitter, Linkedin } from 'lucide-react';
import { siteConfig } from '@/lib/data';

const footerLinks = {
  Resources: [
    { label: 'All Resources', href: '/resources' },
    { label: 'ChatGPT Guides', href: '/resources?category=chatgpt' },
    { label: 'Prompt Packs', href: '/resources?category=prompts' },
    { label: 'AI Toolkits', href: '/resources?category=toolkits' },
    { label: 'Video Tutorials', href: '/resources?category=video' },
  ],
  Learn: [
    { label: 'Blog', href: '/blog' },
    { label: 'About Davide', href: '/about' },
    { label: 'Community', href: '/community' },
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/privacy#cookies' },
  ],
};

const socialLinks = [
  { label: 'YouTube', href: siteConfig.social.youtube, icon: Youtube },
  { label: 'Instagram', href: siteConfig.social.instagram, icon: Instagram },
  { label: 'Twitter / X', href: siteConfig.social.twitter, icon: Twitter },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-1" role="contentinfo">
      {/* Main footer content */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
              aria-label="DavideGPT — Home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Davide<span className="text-gradient">GPT</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Helping 500K+ people master AI tools, save time, and stay ahead — with practical guides, prompts, and tutorials.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white hover:bg-brand-500/20 hover:border-brand-500/40 transition-all"
                  onClick={() =>
                    typeof window !== 'undefined' &&
                    window.gtag?.('event', 'social_click', { platform: label })
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white mb-4">{group}</h3>
              <ul className="space-y-3" role="list">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DavideGPT.ai. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built for AI learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
