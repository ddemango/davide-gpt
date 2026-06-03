/**
 * Daily content generator — called by GitHub Actions every day.
 * Uses Claude to generate a new resource OR blog post and pushes it to Notion.
 * Even day-of-year = resource, odd = blog post.
 */

const { ANTHROPIC_API_KEY, NOTION_TOKEN, NOTION_RESOURCES_DB, NOTION_BLOG_DB, VERCEL_DEPLOY_HOOK } = process.env;

// ── Thumbnail library ────────────────────────────────────────────────────────
const BASE = 'https://images.unsplash.com/photo-';
const P = '?w=800&q=80&fit=crop&h=450&auto=format';
const u = (id) => `${BASE}${id}${P}`;

const RESOURCE_THUMBNAILS = {
  ChatGPT:     [u('1677442135703-59657440c3db'), u('1620712943543-bcc4688e7485'), u('1526374965328-7f61d4dc18c5'), u('1655720031546-cd6c6f12b0e4'), u('1488229297570-58520851e868')],
  Claude:      [u('1635070041078-e363dbe005cb'), u('1618005182384-a83a8bd57fbe'), u('1519389950473-47ba0277781c'), u('1580927752452-89d86da3fa0a'), u('1635070041040-42f60da3c5c3')],
  Content:     [u('1455390582262-044cdead277a'), u('1499951360447-b19be8fe80f5'), u('1542435503-4c6c8a5b4b1a'), u('1471107340929-a87cd0f5b5f3'), u('1432888498266-38ffec3eaf0a')],
  Productivity:[u('1484480974693-6ca0a78fb36b'), u('1507238691740-187a5b1d37b8'), u('1498050108023-c5249f4df085'), u('1545987796-200677720183'), u('1517694712202-14dd9538aa97')],
  Business:    [u('1460925895917-afdab827c52f'), u('1507003211169-0a1dd7228f2d'), u('1486406146926-c627a92ad1ab'), u('1664575599736-c5197c684128'), u('1553729459-efe14ef6055d')],
  Tools:       [u('1518770660439-4636190af475'), u('1504868584819-f8e8b4b6d7e3'), u('1451187580459-43490279c0fa'), u('1558618666-fcd25c85cd64'), u('1581092580497-e0d23cbdf1dc')],
};
const BLOG_THUMBNAILS = {
  'Content Creation': RESOURCE_THUMBNAILS.Content,
  'AI Comparison':    RESOURCE_THUMBNAILS.Tools,
  'Productivity':     RESOURCE_THUMBNAILS.Productivity,
  'Prompting':        RESOURCE_THUMBNAILS.ChatGPT,
  'Business':         RESOURCE_THUMBNAILS.Business,
  'Tools':            RESOURCE_THUMBNAILS.Tools,
};
function pickThumb(map, category, seed) {
  const pool = map[category] ?? Object.values(map).flat();
  const idx = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % pool.length;
  return pool[idx];
}

if (!ANTHROPIC_API_KEY || !NOTION_TOKEN || !NOTION_RESOURCES_DB || !NOTION_BLOG_DB) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

const today = new Date();
const dateStr = today.toISOString().split('T')[0];
const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
const isResource = dayOfYear % 2 === 0;

const notionHeaders = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

// ── Claude API call ──────────────────────────────────────────────────────────
async function askClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!data.content?.[0]?.text) throw new Error(JSON.stringify(data));
  return data.content[0].text.trim();
}

// ── Parse JSON safely ────────────────────────────────────────────────────────
function parseJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in response');
  return JSON.parse(match[0]);
}

// ── Notion page creator ──────────────────────────────────────────────────────
async function createNotionPage(body) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.id) throw new Error(JSON.stringify(data));
  return data;
}

// ── Generate Resource ────────────────────────────────────────────────────────
async function generateResource() {
  const prompt = `You are the content team for DavideGPT — an AI education brand that teaches people to master ChatGPT, Claude, Gemini, and AI tools to grow their business and career.

Generate a brand-new resource for ${dateStr}. Be specific, practical and valuable.

Topics to cover (pick one that feels fresh and timely):
- Advanced ChatGPT or Claude techniques
- AI prompt engineering
- AI for content creation / social media
- AI business automation
- AI productivity systems
- AI for freelancers or entrepreneurs
- Specific AI tool features (memory, canvas, projects, artifacts, etc.)
- AI for video, design, or marketing

Return ONLY valid JSON — no markdown, no explanation:
{
  "name": "Catchy, specific title (max 60 chars)",
  "slug": "url-slug-unique-for-${dateStr}",
  "description": "One punchy sentence that sells the value (max 120 chars)",
  "category": "ChatGPT",
  "level": "Beginner",
  "type": "Guide",
  "free": true,
  "price": null,
  "featured": false,
  "tags": ["tag1", "tag2", "tag3"]
}

Rules:
- category must be one of: ChatGPT, Claude, Content, Productivity, Business, Tools
- level must be one of: Beginner, Intermediate, Advanced
- type must be one of: Guide, Prompt Pack, Video, Toolkit, Template
- slug must be lowercase with hyphens only, unique (include date: ${dateStr})
- if free is false, set price to a number (9, 19, 29, 39, or 49)
- featured should be true ~30% of the time`;

  const raw = await askClaude(prompt);
  const data = parseJSON(raw);

  const props = {
    Name: { title: [{ text: { content: data.name } }] },
    Slug: { rich_text: [{ text: { content: data.slug } }] },
    Description: { rich_text: [{ text: { content: data.description } }] },
    Category: { select: { name: data.category } },
    Level: { select: { name: data.level } },
    Type: { select: { name: data.type } },
    Free: { checkbox: data.free },
    Featured: { checkbox: data.featured ?? false },
    Published: { date: { start: dateStr } },
  };
  if (!data.free && data.price) props.Price = { number: data.price };
  if (data.tags?.length) props.Tags = { multi_select: data.tags.map((t) => ({ name: t })) };
  props.Thumbnail = { rich_text: [{ text: { content: pickThumb(RESOURCE_THUMBNAILS, data.category, data.slug) } }] };

  await createNotionPage({ parent: { database_id: NOTION_RESOURCES_DB }, properties: props });
  console.log(`✓ Resource created: ${data.name}`);
}

// ── Generate Blog Post ───────────────────────────────────────────────────────
async function generateBlogPost() {
  const prompt = `You are the content team for DavideGPT — an AI education brand that helps entrepreneurs, creators, and professionals master AI tools.

Generate a brand-new blog post idea for ${dateStr}. Must be engaging, specific, and shareable.

Topics to choose from:
- Hidden or underrated AI features
- AI model comparisons (ChatGPT vs Claude vs Gemini)
- Step-by-step AI workflows
- AI for specific industries or use cases
- Prompting strategies that get better results
- AI productivity or business systems
- Future of AI / trends worth knowing

Return ONLY valid JSON — no markdown, no explanation:
{
  "name": "Compelling headline (max 70 chars)",
  "slug": "url-slug-for-${dateStr}",
  "excerpt": "Hook sentence that makes someone want to read it (max 160 chars)",
  "category": "Tools",
  "readTime": "5 min",
  "featured": false,
  "tags": ["tag1", "tag2", "tag3"]
}

Rules:
- category must be one of: Content Creation, AI Comparison, Productivity, Prompting, Business, Tools
- readTime should be realistic: "4 min", "6 min", "8 min", "10 min"
- slug must be lowercase with hyphens, unique (include date: ${dateStr})
- featured should be true ~25% of the time`;

  const raw = await askClaude(prompt);
  const data = parseJSON(raw);

  const props = {
    Name: { title: [{ text: { content: data.name } }] },
    Slug: { rich_text: [{ text: { content: data.slug } }] },
    Excerpt: { rich_text: [{ text: { content: data.excerpt } }] },
    Category: { select: { name: data.category } },
    ReadTime: { rich_text: [{ text: { content: data.readTime } }] },
    Featured: { checkbox: data.featured ?? false },
    Published: { date: { start: dateStr } },
  };
  if (data.tags?.length) props.Tags = { multi_select: data.tags.map((t) => ({ name: t })) };
  props.Thumbnail = { rich_text: [{ text: { content: pickThumb(BLOG_THUMBNAILS, data.category, data.slug) } }] };

  await createNotionPage({ parent: { database_id: NOTION_BLOG_DB }, properties: props });
  console.log(`✓ Blog post created: ${data.name}`);
}

// ── Trigger Vercel redeploy ──────────────────────────────────────────────────
async function triggerRedeploy() {
  if (!VERCEL_DEPLOY_HOOK) return;
  await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' });
  console.log('✓ Vercel redeploy triggered');
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n📅 ${dateStr} — generating ${isResource ? 'resource' : 'blog post'}...\n`);
  try {
    if (isResource) {
      await generateResource();
    } else {
      await generateBlogPost();
    }
    await triggerRedeploy();
    console.log('\n✅ Done!\n');
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
})();
