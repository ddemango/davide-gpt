/**
 * Daily content generator — called by GitHub Actions every day.
 * Generates one resource + one blog post and pushes both to Notion.
 * Resources include real, downloadable content written by Claude.
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
async function askClaude(prompt, maxTokens = 1024) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
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

// ── Notion block helpers ─────────────────────────────────────────────────────
function rt(content) {
  return { type: 'text', text: { content: content.replace(/\*\*/g, '').replace(/\*/g, '') } };
}

function parseToNotionBlocks(text) {
  const blocks = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('### ')) {
      blocks.push({ object: 'block', type: 'heading_3', heading_3: { rich_text: [rt(line.slice(4))] } });
    } else if (line.startsWith('## ')) {
      blocks.push({ object: 'block', type: 'heading_2', heading_2: { rich_text: [rt(line.slice(3))] } });
    } else if (line.startsWith('# ')) {
      blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: [rt(line.slice(2))] } });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [rt(line.slice(2))] } });
    } else if (/^\d+\.\s/.test(line)) {
      blocks.push({ object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [rt(line.replace(/^\d+\.\s/, ''))] } });
    } else {
      blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [rt(line)] } });
    }
  }
  return blocks.slice(0, 95); // Notion API limit: 100 blocks per request
}

async function appendBlocks(pageId, blocks) {
  if (!blocks.length) return;
  const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    method: 'PATCH',
    headers: notionHeaders,
    body: JSON.stringify({ children: blocks }),
  });
  const data = await res.json();
  if (data.object === 'error') throw new Error(JSON.stringify(data));
}

// ── Content prompt builder ───────────────────────────────────────────────────
function buildContentPrompt(name, type, category, description) {
  const base = `You are writing for DavideGPT, an AI education brand. Write in a clear, practical, direct style with real examples. No filler content.

Resource: "${name}"
Category: ${category}
Description: ${description}`;

  const formats = {
    Guide: `${base}

Write a complete, practical guide with this exact structure:
## Introduction
(2-3 sentences on what this guide covers and who it's for)

## [Section 1 - specific title]
(2-3 paragraphs of actionable content with real examples)

## [Section 2 - specific title]
(2-3 paragraphs of actionable content with real examples)

## [Section 3 - specific title]
(2-3 paragraphs of actionable content with real examples)

## Key Takeaways
- Specific, actionable takeaway 1
- Specific, actionable takeaway 2
- Specific, actionable takeaway 3
- Specific, actionable takeaway 4
- Specific, actionable takeaway 5`,

    'Prompt Pack': `${base}

Write a prompt pack with this structure:
## How to Use This Prompt Pack
(2 sentences on how to use these prompts effectively)

Then write exactly 10 prompts. For each use this format:
### [Descriptive Prompt Title]
[The exact prompt template — use [BRACKETS] for variables the user replaces]

Usage tip: [One sentence on when and how to use this prompt]

---

Write 10 genuinely useful, copy-paste ready prompts. Make the prompt templates specific and detailed.`,

    Template: `${base}

Write a template resource with this structure:
## What This Template Is For
(2-3 sentences on the use case and who benefits)

## How to Use It
1. Step one
2. Step two
3. Step three
4. Step four

## The Template

[Write the actual template here with [PLACEHOLDER] in brackets for every variable]

## Filled-In Example

[Show the exact same template filled in with realistic example content]

## Pro Tips
- Tip 1
- Tip 2
- Tip 3`,

    Toolkit: `${base}

Write a toolkit guide with this structure:
## About This Toolkit
(2-3 sentences on what's included and who it's for)

Then list 8 tools. For each use this format:
### [Tool Name]
What it does: [One sentence]
Best for: [1-2 sentences on the ideal use case]
Pricing: [Free / Freemium / Paid — $X/month]

## How to Get Started
- Tip 1 for beginners
- Tip 2 on combining tools
- Tip 3 on building a workflow

List 8 real, currently available tools relevant to the category.`,

    Video: `${base}

Write a companion study guide with this structure:
## What You'll Learn
(2-3 sentences on the key lessons)

## Core Concepts
- Concept 1: brief explanation
- Concept 2: brief explanation
- Concept 3: brief explanation
- Concept 4: brief explanation
- Concept 5: brief explanation

## Step-by-Step Breakdown
### Step 1: [Title]
(2-3 sentences of practical guidance)

### Step 2: [Title]
(2-3 sentences of practical guidance)

### Step 3: [Title]
(2-3 sentences of practical guidance)

### Step 4: [Title]
(2-3 sentences of practical guidance)

## Common Mistakes to Avoid
- Mistake 1 and how to fix it
- Mistake 2 and how to fix it
- Mistake 3 and how to fix it

## Next Steps
(1-2 sentences on what to do after reading this)`,
  };

  return formats[type] || formats['Guide'];
}

// ── Generate Resource ────────────────────────────────────────────────────────
async function generateResource() {
  const metaPrompt = `You are the content team for DavideGPT — an AI education brand that teaches people to master ChatGPT, Claude, Gemini, and AI tools to grow their business and career.

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

  const raw = await askClaude(metaPrompt);
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

  const page = await createNotionPage({ parent: { database_id: NOTION_RESOURCES_DB }, properties: props });

  // Generate and append the real downloadable content
  const contentPrompt = buildContentPrompt(data.name, data.type, data.category, data.description);
  const contentText = await askClaude(contentPrompt, 2000);
  const blocks = parseToNotionBlocks(contentText);
  await appendBlocks(page.id, blocks);

  console.log(`✓ Resource created: ${data.name} (${blocks.length} blocks)`);
}

// ── Generate Blog Post ───────────────────────────────────────────────────────
async function generateBlogPost() {
  const metaPrompt = `You are the content team for DavideGPT — an AI education brand that helps entrepreneurs, creators, and professionals master AI tools.

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

  const raw = await askClaude(metaPrompt);
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

  const page = await createNotionPage({ parent: { database_id: NOTION_BLOG_DB }, properties: props });

  // Generate and append the full article content
  const contentPrompt = `You are writing for DavideGPT, an AI education brand. Write in a clear, engaging, practical style with no filler.

Blog post: "${data.name}"
Category: ${data.category}
Hook: ${data.excerpt}

Write a complete article with this structure:
## Introduction
(2-3 engaging sentences expanding on the hook, drawing the reader in)

## [Section 1 - main point with specific title]
(2-3 paragraphs with real examples and practical advice)

## [Section 2 - deeper insight with specific title]
(2-3 paragraphs with actionable steps or specific techniques)

## [Section 3 - practical application with specific title]
(2-3 paragraphs on how to implement this today)

## Key Takeaways
- Takeaway 1
- Takeaway 2
- Takeaway 3
- Takeaway 4

## Conclusion
(1-2 sentences wrapping up with a forward-looking statement)

Write genuinely useful content. No generic filler.`;

  const contentText = await askClaude(contentPrompt, 2000);
  const blocks = parseToNotionBlocks(contentText);
  await appendBlocks(page.id, blocks);

  console.log(`✓ Blog post created: ${data.name} (${blocks.length} blocks)`);
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
