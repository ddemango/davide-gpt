import type { Resource, BlogPost, Testimonial, NavigationItem, Stat } from '@/types';

export const siteConfig = {
  name: 'DavideGPT',
  tagline: 'Master AI. Own Your Future.',
  description:
    'Learn how to use AI tools like ChatGPT, Claude, and Gemini to save time, create better content, and stay ahead in your career — from Davide, an AI educator with 500K+ followers.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://davidegpt.ai',
  email: 'hello@davidegpt.ai',
  social: {
    youtube: 'https://youtube.com/@davidegpt',
    instagram: 'https://instagram.com/davidegpt',
    tiktok: 'https://tiktok.com/@davidegpt',
    twitter: 'https://twitter.com/davidegpt',
    linkedin: 'https://linkedin.com/in/davidegpt',
  },
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/davidegpt/30min',
};

export const navigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'All Resources', href: '/resources' },
      { label: 'ChatGPT Guides', href: '/resources?category=ChatGPT' },
      { label: 'Prompt Packs', href: '/resources?category=Prompt+Packs' },
      { label: 'AI Toolkits', href: '/resources?category=Toolkits' },
      { label: 'Video Tutorials', href: '/resources?category=Videos' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Community', href: '/community' },
  { label: 'Contact', href: '/contact' },
];

export const stats: Stat[] = [
  { value: '500', suffix: 'K+', label: 'Followers Worldwide' },
  { value: '50', suffix: 'K+', label: 'Students Taught' },
  { value: '200', suffix: '+', label: 'Free Resources' },
  { value: '4.9', suffix: '/5', label: 'Average Rating' },
];

export const resources: Resource[] = [
  {
    slug: 'ultimate-chatgpt-prompting-guide',
    title: 'The Ultimate ChatGPT Prompting Guide',
    description:
      'Master the art of AI prompting with 100+ proven prompt templates for productivity, content creation, coding, and business.',
    category: 'ChatGPT',
    level: 'Beginner',
    type: 'Guide',
    isFree: true,
    thumbnail: '',
    downloadCount: 12400,
    tags: ['ChatGPT', 'Prompts', 'Productivity'],
    featured: true,
    publishedAt: '2024-01-15',
  },
  {
    slug: 'ai-content-creation-toolkit',
    title: 'AI Content Creation Toolkit',
    description:
      'A complete system for creating high-quality blog posts, social media content, and email campaigns with AI in half the time.',
    category: 'Toolkits',
    level: 'Intermediate',
    type: 'Toolkit',
    isFree: false,
    price: 27,
    thumbnail: '',
    downloadCount: 3800,
    tags: ['Content', 'Marketing', 'AI Tools'],
    featured: true,
    publishedAt: '2024-02-01',
  },
  {
    slug: 'claude-ai-beginner-guide',
    title: 'Claude AI: The Complete Beginner\'s Guide',
    description:
      'Everything you need to know about Anthropic\'s Claude — features, use cases, prompt techniques, and real-world examples.',
    category: 'Claude',
    level: 'Beginner',
    type: 'Guide',
    isFree: true,
    thumbnail: '',
    downloadCount: 8200,
    tags: ['Claude', 'Anthropic', 'Beginner'],
    featured: true,
    publishedAt: '2024-02-20',
  },
  {
    slug: 'ai-productivity-workflow-templates',
    title: '20 AI Productivity Workflow Templates',
    description:
      'Ready-to-use AI workflow templates that automate your most repetitive tasks and reclaim 10+ hours per week.',
    category: 'Productivity',
    level: 'Intermediate',
    type: 'Template',
    isFree: false,
    price: 19,
    thumbnail: '',
    downloadCount: 2100,
    tags: ['Productivity', 'Automation', 'Workflows'],
    publishedAt: '2024-03-05',
  },
  {
    slug: 'chatgpt-for-business-owners',
    title: 'ChatGPT for Business Owners',
    description:
      'Learn how to leverage AI to grow your business — from customer support to marketing, operations, and sales.',
    category: 'Business',
    level: 'Intermediate',
    type: 'Guide',
    isFree: true,
    thumbnail: '',
    downloadCount: 6700,
    tags: ['Business', 'ChatGPT', 'Entrepreneur'],
    publishedAt: '2024-03-18',
  },
  {
    slug: 'top-50-ai-tools-2024',
    title: 'Top 50 AI Tools You Need to Know',
    description:
      'The definitive guide to the best AI tools for creators, marketers, developers, and business professionals in 2024.',
    category: 'Tools',
    level: 'Beginner',
    type: 'Guide',
    isFree: true,
    thumbnail: '',
    downloadCount: 18900,
    tags: ['AI Tools', 'Resources', 'Directory'],
    featured: true,
    publishedAt: '2024-01-08',
  },
  // Prompt Packs
  {
    slug: 'content-creator-prompt-pack',
    title: '50 Content Creation Prompts for Creators',
    description:
      'Fifty battle-tested prompts for writing viral social posts, YouTube scripts, newsletters, blog articles, and more — ready to copy and paste.',
    category: 'Prompt Packs',
    level: 'Beginner',
    type: 'Prompt Pack',
    isFree: true,
    thumbnail: '',
    downloadCount: 9100,
    tags: ['Prompts', 'Content', 'Social Media'],
    featured: true,
    publishedAt: '2024-02-05',
  },
  {
    slug: 'business-email-prompt-pack',
    title: '30 Business Email Prompts That Get Responses',
    description:
      'Cold outreach, follow-ups, proposals, client updates — 30 proven email prompts that cut writing time and increase reply rates.',
    category: 'Prompt Packs',
    level: 'Beginner',
    type: 'Prompt Pack',
    isFree: true,
    thumbnail: '',
    downloadCount: 6400,
    tags: ['Prompts', 'Email', 'Business'],
    publishedAt: '2024-02-25',
  },
  {
    slug: 'productivity-prompt-pack',
    title: '25 AI Prompts to Automate Your Workday',
    description:
      'Prompts for scheduling, task prioritization, meeting summaries, decision-making, and daily planning — reclaim 2 hours every day.',
    category: 'Prompt Packs',
    level: 'Beginner',
    type: 'Prompt Pack',
    isFree: true,
    thumbnail: '',
    downloadCount: 5200,
    tags: ['Prompts', 'Productivity', 'Automation'],
    publishedAt: '2024-03-10',
  },
  // Toolkits
  {
    slug: 'ai-social-media-toolkit',
    title: 'AI Social Media Toolkit for Creators',
    description:
      'A complete creator toolkit: platform-specific content systems, repurposing frameworks, caption templates, and growth strategies powered by AI.',
    category: 'Toolkits',
    level: 'Intermediate',
    type: 'Toolkit',
    isFree: true,
    thumbnail: '',
    downloadCount: 4700,
    tags: ['Social Media', 'Creators', 'Content'],
    publishedAt: '2024-03-01',
  },
  {
    slug: 'ai-freelancer-toolkit',
    title: 'The AI Freelancer Toolkit',
    description:
      'Everything a freelancer needs to win more clients and deliver better work: proposal templates, client onboarding, pricing strategies, and AI-powered service delivery.',
    category: 'Toolkits',
    level: 'Intermediate',
    type: 'Toolkit',
    isFree: true,
    thumbnail: '',
    downloadCount: 3300,
    tags: ['Freelance', 'Business', 'AI Tools'],
    publishedAt: '2024-03-20',
  },
  {
    slug: 'ai-business-automation-toolkit',
    title: 'AI Business Automation Toolkit',
    description:
      'Automate your marketing, customer service, lead gen, and operations with step-by-step AI playbooks built for small business owners.',
    category: 'Toolkits',
    level: 'Advanced',
    type: 'Toolkit',
    isFree: false,
    price: 29,
    thumbnail: '',
    downloadCount: 2100,
    tags: ['Business', 'Automation', 'AI Tools'],
    publishedAt: '2024-04-01',
  },
  // Videos
  {
    slug: 'chatgpt-masterclass-video',
    title: 'ChatGPT Masterclass: Zero to Pro',
    description:
      'A complete video walkthrough taking you from first login to advanced prompting — covers GPT-4, custom instructions, plugins, and real workflow examples.',
    category: 'Videos',
    level: 'Beginner',
    type: 'Video',
    isFree: true,
    thumbnail: '',
    downloadCount: 22000,
    tags: ['ChatGPT', 'Beginner', 'Video'],
    featured: true,
    publishedAt: '2024-01-20',
  },
  {
    slug: 'prompt-engineering-video-course',
    title: 'Prompt Engineering Crash Course (Video)',
    description:
      'Learn the exact frameworks Davide uses to get professional-grade output from any AI model — includes live examples and reusable templates.',
    category: 'Videos',
    level: 'Intermediate',
    type: 'Video',
    isFree: true,
    thumbnail: '',
    downloadCount: 14500,
    tags: ['Prompts', 'Video', 'Technique'],
    publishedAt: '2024-02-15',
  },
  {
    slug: 'ai-tools-2024-video',
    title: 'Best AI Tools of 2026 — Full Breakdown',
    description:
      'Davide\'s annual video roundup of the most important AI tools — what they do, how to use them, and which ones are actually worth your time.',
    category: 'Videos',
    level: 'Beginner',
    type: 'Video',
    isFree: true,
    thumbnail: '',
    downloadCount: 31000,
    tags: ['AI Tools', 'Video', 'Overview'],
    publishedAt: '2024-01-05',
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-use-chatgpt-for-content-creation',
    title: 'How to Use ChatGPT for Content Creation in 2024',
    excerpt:
      'Discover the exact system I use to create a month of content in a single afternoon using ChatGPT prompts and workflows.',
    category: 'Content Creation',
    thumbnail: '',
    publishedAt: '2024-03-20',
    readTime: '7 min read',
    tags: ['ChatGPT', 'Content', 'Social Media'],
    featured: true,
    author: { name: 'Davide DeMango', avatar: '' },
  },
  {
    slug: 'claude-vs-chatgpt-which-is-better',
    title: 'Claude vs ChatGPT: Which AI is Better in 2024?',
    excerpt:
      'I tested both for 30 days straight. Here\'s an honest breakdown of strengths, weaknesses, and when to use each.',
    category: 'AI Comparison',
    thumbnail: '',
    publishedAt: '2024-03-12',
    readTime: '10 min read',
    tags: ['Claude', 'ChatGPT', 'Comparison'],
    featured: true,
    author: { name: 'Davide DeMango', avatar: '' },
  },
  {
    slug: '10-ai-tools-that-save-10-hours-per-week',
    title: '10 AI Tools That Save Me 10+ Hours Every Week',
    excerpt:
      'These are the exact AI tools I use daily to automate repetitive work and focus on high-leverage tasks.',
    category: 'Productivity',
    thumbnail: '',
    publishedAt: '2024-03-05',
    readTime: '5 min read',
    tags: ['Productivity', 'AI Tools', 'Automation'],
    author: { name: 'Davide DeMango', avatar: '' },
  },
  {
    slug: 'prompt-engineering-for-beginners',
    title: 'Prompt Engineering for Beginners: The Complete Guide',
    excerpt:
      'Learn the fundamentals of writing better AI prompts that get better results every single time.',
    category: 'Prompting',
    thumbnail: '',
    publishedAt: '2024-02-28',
    readTime: '12 min read',
    tags: ['Prompts', 'Beginner', 'Technique'],
    author: { name: 'Davide DeMango', avatar: '' },
  },
  {
    slug: 'how-to-make-money-with-ai',
    title: 'How to Make Money with AI in 2024 (Realistic Guide)',
    excerpt:
      'A realistic, no-hype breakdown of the actual ways people are monetizing AI skills right now.',
    category: 'Business',
    thumbnail: '',
    publishedAt: '2024-02-19',
    readTime: '9 min read',
    tags: ['Business', 'Income', 'AI Skills'],
    author: { name: 'Davide DeMango', avatar: '' },
  },
  {
    slug: 'gemini-vs-chatgpt-google-ai',
    title: 'Google Gemini vs ChatGPT: The Real Comparison',
    excerpt:
      'Google\'s AI has evolved fast. Here\'s where Gemini shines and where ChatGPT still leads.',
    category: 'AI Comparison',
    thumbnail: '',
    publishedAt: '2024-02-10',
    readTime: '8 min read',
    tags: ['Gemini', 'Google', 'ChatGPT'],
    author: { name: 'Davide DeMango', avatar: '' },
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    handle: '@sarahm_creates',
    platform: 'Instagram',
    avatar: '',
    quote:
      "Davide's ChatGPT guide changed everything for me. I went from spending 8 hours on content per week to just 2. Absolutely game-changing.",
    role: 'Content Creator',
  },
  {
    id: '2',
    name: 'James K.',
    handle: '@jkoficial',
    platform: 'Twitter',
    avatar: '',
    quote:
      'I\'ve followed dozens of AI accounts. DavideGPT is the only one where I actually learn something I can use immediately every single time.',
    role: 'Freelance Marketer',
  },
  {
    id: '3',
    name: 'Priya R.',
    platform: 'LinkedIn',
    avatar: '',
    quote:
      'The AI toolkit resources alone are worth 10x what I paid. I use them daily in my agency and my clients are blown away by the results.',
    role: 'Digital Agency Owner',
  },
  {
    id: '4',
    name: 'Tom D.',
    handle: '@tomdev_ai',
    platform: 'Twitter',
    avatar: '',
    quote:
      'Clear, practical, no fluff. Davide explains AI tools better than anyone I\'ve come across online.',
    role: 'Software Developer',
  },
  {
    id: '5',
    name: 'Elena V.',
    platform: 'Google',
    avatar: '',
    quote:
      'I was completely lost with all these AI tools. After going through the free guides, I finally understand how to use them properly. Thank you!',
    role: 'Small Business Owner',
  },
  {
    id: '6',
    name: 'Marcus J.',
    handle: '@marcus_mkt',
    platform: 'Instagram',
    avatar: '',
    quote:
      'The prompt packs alone saved me hours of trial and error. If you\'re serious about AI, follow DavideGPT.',
    role: 'Marketing Manager',
  },
];

export const faqItems = [
  {
    question: 'Do I need any technical background to learn from DavideGPT?',
    answer:
      'Absolutely not. All resources are designed for complete beginners. If you can use a smartphone, you can follow along. Davide breaks down every concept into simple, actionable steps anyone can understand.',
  },
  {
    question: 'Are your resources really free?',
    answer:
      'Yes — the majority of our resources are completely free. We believe AI education should be accessible to everyone. Some advanced toolkits and premium guides are paid, but there\'s a huge library of free content to start with.',
  },
  {
    question: 'What AI tools do you cover?',
    answer:
      'We cover all major AI tools including ChatGPT, Claude, Google Gemini, Midjourney, DALL-E, Perplexity, Notion AI, and dozens more. We also provide updated guides as new tools launch.',
  },
  {
    question: 'How often is new content published?',
    answer:
      'New free resources, guides, and blog posts are published weekly. Newsletter subscribers get early access to new resources plus exclusive AI tips not published anywhere else.',
  },
  {
    question: 'Can I use these resources for my business?',
    answer:
      'Yes! All resources include commercial use rights for personal and professional purposes. Many of our users are entrepreneurs, agency owners, and marketing professionals using these tools to grow their businesses.',
  },
  {
    question: 'What\'s inside the paid toolkits?',
    answer:
      'Paid resources include advanced prompt systems, workflow templates, video walkthroughs, and ongoing updates. They\'re designed for people who want to go deeper than the free guides and implement professional-grade AI workflows.',
  },
];
