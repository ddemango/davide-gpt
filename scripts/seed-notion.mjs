/**
 * Seed script — populates both Notion databases with sample content.
 * Usage: node scripts/seed-notion.mjs <NOTION_TOKEN> <RESOURCES_DB_ID> <BLOG_DB_ID>
 */

const [token, resourcesDb, blogDb] = process.argv.slice(2);
if (!token || !resourcesDb || !blogDb) {
  console.error('Usage: node scripts/seed-notion.mjs <TOKEN> <RESOURCES_DB> <BLOG_DB>');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

async function createPage(body) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST', headers, body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.id) throw new Error(JSON.stringify(data));
  return data;
}

// ── Resources ────────────────────────────────────────────────────────────────
const resources = [
  {
    name: 'ChatGPT Master Prompt Pack',
    slug: 'chatgpt-master-prompt-pack',
    description: '100+ battle-tested prompts for content, business, and productivity',
    category: 'ChatGPT', level: 'Intermediate', type: 'Prompt Pack',
    free: false, price: 29, featured: true, date: '2026-06-01',
  },
  {
    name: "Claude AI Beginner's Guide",
    slug: 'claude-ai-beginners-guide',
    description: "Everything you need to start using Claude — Anthropic's most powerful AI",
    category: 'Claude', level: 'Beginner', type: 'Guide',
    free: true, price: null, featured: true, date: '2026-05-28',
  },
  {
    name: 'AI Content Creator Toolkit',
    slug: 'ai-content-creator-toolkit',
    description: 'Scripts, templates and prompts to produce 30 days of content in 2 hours',
    category: 'Content', level: 'Intermediate', type: 'Toolkit',
    free: false, price: 49, featured: true, date: '2026-05-20',
  },
  {
    name: 'ChatGPT for Business Automation',
    slug: 'chatgpt-business-automation',
    description: 'Automate emails, proposals, reports and SOPs with ChatGPT',
    category: 'Business', level: 'Advanced', type: 'Guide',
    free: false, price: 39, featured: false, date: '2026-05-15',
  },
  {
    name: '50 Viral Hook Templates',
    slug: '50-viral-hook-templates',
    description: 'AI-crafted hooks for Instagram, TikTok, LinkedIn and YouTube',
    category: 'Content', level: 'Beginner', type: 'Template',
    free: false, price: 19, featured: false, date: '2026-05-10',
  },
  {
    name: 'Daily AI Productivity System',
    slug: 'daily-ai-productivity-system',
    description: 'A complete morning-to-evening workflow using AI tools to get more done',
    category: 'Productivity', level: 'Intermediate', type: 'Toolkit',
    free: false, price: 29, featured: true, date: '2026-05-05',
  },
  {
    name: 'AI Tools Comparison Guide 2026',
    slug: 'ai-tools-comparison-guide-2026',
    description: 'ChatGPT vs Claude vs Gemini — honest breakdown of every major AI tool',
    category: 'Tools', level: 'Beginner', type: 'Guide',
    free: true, price: null, featured: true, date: '2026-04-30',
  },
  {
    name: 'ChatGPT Custom GPTs Masterclass',
    slug: 'chatgpt-custom-gpts-masterclass',
    description: 'Build your own Custom GPT from scratch — no coding required',
    category: 'ChatGPT', level: 'Advanced', type: 'Video',
    free: false, price: 59, featured: false, date: '2026-04-25',
  },
  {
    name: 'AI Business Plan Generator Pack',
    slug: 'ai-business-plan-generator-pack',
    description: 'Prompts to generate a full business plan, pitch deck and financial summary',
    category: 'Business', level: 'Intermediate', type: 'Prompt Pack',
    free: false, price: 29, featured: false, date: '2026-04-20',
  },
  {
    name: 'Claude Projects Workflow Guide',
    slug: 'claude-projects-workflow-guide',
    description: "Use Claude's Projects feature to build a personal AI second brain",
    category: 'Claude', level: 'Intermediate', type: 'Guide',
    free: false, price: 19, featured: true, date: '2026-04-15',
  },
  {
    name: 'Social Media AI Template Pack',
    slug: 'social-media-ai-template-pack',
    description: '60 ready-to-use AI-generated templates for every social platform',
    category: 'Content', level: 'Beginner', type: 'Template',
    free: false, price: 24, featured: false, date: '2026-04-10',
  },
  {
    name: 'AI Freelancer Starter Kit',
    slug: 'ai-freelancer-starter-kit',
    description: 'Use AI to land clients, write proposals and deliver work 5x faster',
    category: 'Business', level: 'Beginner', type: 'Toolkit',
    free: true, price: null, featured: false, date: '2026-04-05',
  },
];

// ── Blog Posts ────────────────────────────────────────────────────────────────
const posts = [
  {
    name: "10 ChatGPT Features Most People Have Never Heard Of",
    slug: 'chatgpt-hidden-features',
    excerpt: 'From memory mode to custom instructions — these underrated features will change how you use ChatGPT forever.',
    category: 'Tools', readTime: '6 min', featured: true, date: '2026-06-02',
  },
  {
    name: 'Claude vs ChatGPT in 2026: Which AI Actually Wins?',
    slug: 'claude-vs-chatgpt-2026',
    excerpt: 'I ran 50 real-world tests across writing, coding, research and reasoning. Here\'s the honest verdict.',
    category: 'AI Comparison', readTime: '8 min', featured: true, date: '2026-05-30',
  },
  {
    name: "The Coolest Things Claude Can Do That ChatGPT Can't",
    slug: 'coolest-claude-features',
    excerpt: "Claude's Projects, 200K context window, and document analysis are game-changers most people are sleeping on.",
    category: 'AI Comparison', readTime: '5 min', featured: true, date: '2026-05-26',
  },
  {
    name: 'How to Create 30 Days of Content in 2 Hours Using AI',
    slug: '30-days-content-2-hours-ai',
    excerpt: 'My exact step-by-step system using ChatGPT and Claude to batch-create a full month of posts.',
    category: 'Content Creation', readTime: '7 min', featured: false, date: '2026-05-22',
  },
  {
    name: "ChatGPT's Canvas Feature: The Complete Guide",
    slug: 'chatgpt-canvas-feature-guide',
    excerpt: 'Canvas turns ChatGPT into a collaborative editor. Here\'s how to use it to write, edit and publish faster.',
    category: 'Tools', readTime: '5 min', featured: false, date: '2026-05-18',
  },
  {
    name: 'Gemini vs Claude vs ChatGPT: The Ultimate AI Showdown',
    slug: 'gemini-claude-chatgpt-showdown',
    excerpt: "Three AI giants. One winner. I tested all three on real business tasks so you don't have to.",
    category: 'AI Comparison', readTime: '10 min', featured: true, date: '2026-05-14',
  },
  {
    name: 'The 5 Best AI Prompting Techniques That Actually Work',
    slug: 'best-ai-prompting-techniques',
    excerpt: 'Chain-of-thought, role prompting, few-shot examples — master these and your AI outputs will never be the same.',
    category: 'Prompting', readTime: '6 min', featured: false, date: '2026-05-10',
  },
  {
    name: 'How I Use AI to Run My Business in 4 Hours a Week',
    slug: 'ai-run-business-4-hours-week',
    excerpt: "From client emails to content to invoices — here's exactly how I've automated 80% of my workload.",
    category: 'Business', readTime: '8 min', featured: false, date: '2026-05-06',
  },
  {
    name: 'ChatGPT Memory: How to Build a Personal AI That Knows You',
    slug: 'chatgpt-memory-personal-ai',
    excerpt: "ChatGPT's memory feature lets it learn your preferences over time. Here's how to set it up the right way.",
    category: 'Tools', readTime: '4 min', featured: false, date: '2026-05-02',
  },
  {
    name: 'The Top 7 AI Productivity Hacks for Entrepreneurs',
    slug: 'ai-productivity-hacks-entrepreneurs',
    excerpt: 'These seven AI workflows save me 20+ hours a week. Every entrepreneur needs to know about them.',
    category: 'Productivity', readTime: '6 min', featured: false, date: '2026-04-28',
  },
];

// ── Seed ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n🌱 Seeding Notion databases...\n');

  console.log('📦 Adding resources...');
  for (const r of resources) {
    const props = {
      Name: { title: [{ text: { content: r.name } }] },
      Slug: { rich_text: [{ text: { content: r.slug } }] },
      Description: { rich_text: [{ text: { content: r.description } }] },
      Category: { select: { name: r.category } },
      Level: { select: { name: r.level } },
      Type: { select: { name: r.type } },
      Free: { checkbox: r.free },
      Featured: { checkbox: r.featured },
      Published: { date: { start: r.date } },
    };
    if (r.price !== null) props.Price = { number: r.price };
    try {
      await createPage({ parent: { database_id: resourcesDb }, properties: props });
      console.log(`  ✓ ${r.name}`);
    } catch (e) {
      console.error(`  ✗ ${r.name}: ${e.message}`);
    }
  }

  console.log('\n📝 Adding blog posts...');
  for (const p of posts) {
    const props = {
      Name: { title: [{ text: { content: p.name } }] },
      Slug: { rich_text: [{ text: { content: p.slug } }] },
      Excerpt: { rich_text: [{ text: { content: p.excerpt } }] },
      Category: { select: { name: p.category } },
      ReadTime: { rich_text: [{ text: { content: p.readTime } }] },
      Featured: { checkbox: p.featured },
      Published: { date: { start: p.date } },
    };
    try {
      await createPage({ parent: { database_id: blogDb }, properties: props });
      console.log(`  ✓ ${p.name}`);
    } catch (e) {
      console.error(`  ✗ ${p.name}: ${e.message}`);
    }
  }

  console.log('\n✅ Done! Trigger a Vercel redeploy to see all content live.\n');
})();
