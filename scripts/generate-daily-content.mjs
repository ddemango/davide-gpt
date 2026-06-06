/**
 * Daily content generator — called by GitHub Actions every day.
 * Generates one resource + one blog post and pushes both to Notion.
 */

const { ANTHROPIC_API_KEY, NOTION_TOKEN, NOTION_RESOURCES_DB, NOTION_BLOG_DB, VERCEL_DEPLOY_HOOK } = process.env;

if (!ANTHROPIC_API_KEY || !NOTION_TOKEN || !NOTION_RESOURCES_DB || !NOTION_BLOG_DB) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

const today = new Date();
const dateStr = today.toISOString().split('T')[0];

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
  console.log(`\n📅 ${dateStr} — generating daily resource + blog post...\n`);
  try {
    await generateResource();
    await generateBlogPost();
    await triggerRedeploy();
    console.log('\n✅ Done!\n');
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
})();
