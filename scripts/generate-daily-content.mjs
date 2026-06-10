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
async function askClaude(systemPrompt, userPrompt, maxTokens = 1024) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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

// ── Rich text parser (preserves **bold**) ────────────────────────────────────
function parseRichText(line) {
  const segments = [];
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('**') && part.endsWith('**')) {
      segments.push({
        type: 'text',
        text: { content: part.slice(2, -2) },
        annotations: { bold: true },
      });
    } else {
      segments.push({ type: 'text', text: { content: part } });
    }
  }
  return segments.length ? segments : [{ type: 'text', text: { content: line } }];
}

// ── Markdown → Notion blocks ─────────────────────────────────────────────────
function parseToNotionBlocks(text) {
  const blocks = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('### ')) {
      blocks.push({ object: 'block', type: 'heading_3', heading_3: { rich_text: parseRichText(line.slice(4)) } });
    } else if (line.startsWith('## ')) {
      blocks.push({ object: 'block', type: 'heading_2', heading_2: { rich_text: parseRichText(line.slice(3)) } });
    } else if (line.startsWith('# ')) {
      blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: parseRichText(line.slice(2)) } });
    } else if (line.startsWith('> ')) {
      blocks.push({ object: 'block', type: 'quote', quote: { rich_text: parseRichText(line.slice(2)) } });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: parseRichText(line.slice(2)) } });
    } else if (/^\d+\.\s/.test(line)) {
      blocks.push({ object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: parseRichText(line.replace(/^\d+\.\s/, '')) } });
    } else if (line.startsWith('---')) {
      blocks.push({ object: 'block', type: 'divider', divider: {} });
    } else {
      blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: parseRichText(line) } });
    }
  }
  return blocks;
}

// ── Append blocks in batches of 95 (Notion API limit) ───────────────────────
async function appendBlocks(pageId, blocks) {
  if (!blocks.length) return;
  const BATCH = 95;
  for (let i = 0; i < blocks.length; i += BATCH) {
    const chunk = blocks.slice(i, i + BATCH);
    const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      method: 'PATCH',
      headers: notionHeaders,
      body: JSON.stringify({ children: chunk }),
    });
    const data = await res.json();
    if (data.object === 'error') throw new Error(JSON.stringify(data));
  }
}

// ── Brand voice system prompt ────────────────────────────────────────────────
const BRAND_VOICE = `You write for DavideGPT — an AI education brand run by Davide, a creator with 500K+ followers who teaches everyday people to master AI tools.

VOICE AND STYLE RULES:
- Write like you're explaining something powerful to a smart friend who's new to AI
- Be direct and specific — never vague or corporate
- Use "you" and "your" throughout — make it personal
- Every claim needs a real example, specific prompt, or concrete number
- Short paragraphs (2-4 sentences max) — easy to scan on mobile
- Start sections with a strong, direct statement — never "In this section..."
- Use **bold** to highlight key terms, specific prompts, and important actions
- Name specific AI tools (ChatGPT, Claude, Gemini, Midjourney, etc.) — don't be generic
- Include actual prompt examples in quotes where relevant
- Avoid: "In conclusion", "It's worth noting", "As we've seen", "Leverage", "Utilize"
- Avoid filler phrases — every sentence must earn its place
- Tone: knowledgeable but approachable, confident but not arrogant`;

// ── Resource content prompts ─────────────────────────────────────────────────
function buildContentPrompt(name, type, category, description) {
  const intro = `Write the full content for this DavideGPT resource:\n\nTitle: "${name}"\nCategory: ${category}\nDescription: ${description}\n\n`;

  const formats = {
    Guide: `${intro}Structure the guide exactly like this (use these H2 headings):

## Who This Is For
(2 sentences — be specific about the reader. Beginner who's tried ChatGPT twice? Freelancer spending 3 hours on tasks AI could do in 10 minutes?)

## What You'll Be Able to Do After This Guide
- Specific outcome 1 (with a number or timeframe)
- Specific outcome 2
- Specific outcome 3

## [Specific, Descriptive Section Title — not "Section 1"]
(3-4 short paragraphs. Include at least one real example prompt in quotes. Show the before/after or the exact technique.)

## [Specific, Descriptive Section Title]
(3-4 short paragraphs. Include specific steps numbered 1-3 or 1-4.)

## [Specific, Descriptive Section Title]
(3-4 short paragraphs. This should be the most advanced section — the thing most guides skip.)

## Common Mistakes (and How to Fix Them)
- **Mistake:** [What most people do wrong] → **Fix:** [The better approach]
- **Mistake:** [What most people do wrong] → **Fix:** [The better approach]
- **Mistake:** [What most people do wrong] → **Fix:** [The better approach]

## Your Next Steps
1. [Immediate action — do this in the next 5 minutes]
2. [This week action]
3. [30-day goal]`,

    'Prompt Pack': `${intro}Structure the prompt pack exactly like this:

## How to Use This Pack
(3 sentences: how to copy-paste, how to customize the [BRACKETS], and what results to expect)

## Quick Reference
(List the 12 prompt titles only — numbered — so readers can scan and jump to what they need)

---

Then write all 12 prompts in this exact format:

### [Specific, Descriptive Prompt Title]

**The Prompt:**
[Write the complete, ready-to-use prompt. Use [VARIABLE IN CAPS] for every placeholder. Make it detailed — 3-6 sentences minimum. Include context, tone instructions, format instructions, and desired output.]

**Example output:** [Show 2-3 sentences of what a great response looks like]

**Pro tip:** [One specific way to get even better results — a follow-up prompt, a specific technique, or a common mistake to avoid]

---

Write 12 genuinely powerful prompts. Each should produce a meaningfully different output. Vary the complexity — some simple, some advanced.`,

    Template: `${intro}Structure the template resource exactly like this:

## What This Template Does
(3 sentences: the exact problem it solves, who it's for, and the specific outcome they'll get)

## When to Use It
- Situation 1 where this template works perfectly
- Situation 2
- Situation 3
- Situation where you should NOT use this template (sets expectations)

## How to Use It in 4 Steps
1. **[Step name]:** [Specific instruction]
2. **[Step name]:** [Specific instruction]
3. **[Step name]:** [Specific instruction]
4. **[Step name]:** [Specific instruction]

## The Template

[Write the complete, copy-paste ready template. Use **[VARIABLE NAME]** in bold brackets for every placeholder. Make it comprehensive — this should look professional when filled in.]

---

## Filled-In Example

[Rewrite the entire template above with realistic, specific example content filled in. Use a concrete scenario — a real-sounding business name, specific numbers, real context. This example should be so good someone might use it as-is.]

## Customization Tips
- **For [specific type of user]:** Change [specific element] to [how to change it]
- **For [specific type of user]:** Add [specific element] between [sections]
- **To make it more formal/casual:** [specific language swap tips]`,

    Toolkit: `${intro}Structure the toolkit guide exactly like this:

## What This Toolkit Is For
(3 sentences: the specific workflow or goal this toolkit serves, who benefits most, and what they'll be able to do)

## How to Choose Your Stack
(3-4 sentences on how to evaluate which tools to start with — budget, use case, skill level)

---

Then write 10 tools. For EACH tool use this exact format:

### [Tool Name]

**What it does:** [One punchy sentence]

**Best for:** [Specific use case — who specifically benefits and when]

**Real example:** [One sentence showing a concrete use case — "Use it to turn a 30-minute interview into a LinkedIn post in under 2 minutes"]

**Pricing:** [Exact current pricing — Free / Freemium (free tier: X) / Paid from $X/month]

**Get started:** [One specific first action — "Start by uploading your last blog post and asking it to..."]

---

## Building Your Workflow
### Beginner Setup (free tools only)
[Name 3 tools from your list and explain how they work together]

### Advanced Setup
[Name 5 tools and describe the workflow step by step]

## Pro Tips
- [Tip 1 — specific, not generic]
- [Tip 2]
- [Tip 3]

Use real, currently available tools with accurate pricing.`,

    Video: `${intro}Structure the video companion guide exactly like this:

## What This Guide Covers
(2 sentences — the specific skills and outcomes)

## The Core Framework
(4-6 sentences explaining the main concept or system in plain language — before breaking it into steps)

## Step-by-Step Breakdown

### Step 1: [Specific, Action-Oriented Title]
(3-4 sentences of practical guidance. Include the exact prompt or action to take. What does "done" look like for this step?)

### Step 2: [Specific, Action-Oriented Title]
(3-4 sentences. Include a specific example or prompt.)

### Step 3: [Specific, Action-Oriented Title]
(3-4 sentences. This is often where people get stuck — address that.)

### Step 4: [Specific, Action-Oriented Title]
(3-4 sentences.)

### Step 5: [Specific, Action-Oriented Title]
(3-4 sentences — the step that takes results from good to great.)

## The 3 Mistakes That Kill Your Results
- **Mistake 1:** [What it is] — Here's why it fails: [explanation] → Instead: [specific fix]
- **Mistake 2:** [What it is] — Here's why it fails: [explanation] → Instead: [specific fix]
- **Mistake 3:** [What it is] — Here's why it fails: [explanation] → Instead: [specific fix]

## Practice Exercise
[A specific, complete exercise they can do right now — takes 10-15 minutes, produces a real output they can use]

## What to Do Next
[1-2 sentences pointing them toward the logical next resource or action]`,
  };

  return formats[type] || formats['Guide'];
}

// ── Blog post content prompt ─────────────────────────────────────────────────
function buildBlogPrompt(title, category, excerpt) {
  return `Write a complete, publication-ready blog article for DavideGPT.

Title: "${title}"
Category: ${category}
Opening hook: ${excerpt}

Structure the article exactly like this:

## [Rewrite the hook as an engaging opening statement — do NOT use "Introduction" as the heading]
(3-4 sentences. Expand the hook. Make a bold, specific claim. Tell the reader exactly what they'll learn and why it matters right now. End with a statement that pulls them into the next section.)

## [First main point — specific, descriptive heading with a number or strong verb]
(4-5 short paragraphs. Make a strong claim, back it with a specific example or scenario, include at least one real prompt in quotes if relevant. Use **bold** for key terms and specific prompts. Write like you're explaining it over coffee.)

## [Second main point — deeper insight, also specific]
(4-5 short paragraphs. This is the section most articles skip — go deeper. Give the reader something they haven't seen in the top 10 Google results. Include a specific technique, workflow, or mental model.)

## [Third main point — practical application]
(4-5 short paragraphs. Show them how to use what they just learned TODAY. Step-by-step is fine here. Be as concrete as possible — specific tools, specific prompts, specific timeframes.)

## The Part Most People Get Wrong
(3-4 short paragraphs. Address the most common mistake or misconception. Be direct — "Most people do X. That's wrong. Here's why: ...")

## Key Takeaways
- **[Bold key term]:** [One clear sentence]
- **[Bold key term]:** [One clear sentence]
- **[Bold key term]:** [One clear sentence]
- **[Bold key term]:** [One clear sentence]
- **[Bold key term]:** [One clear sentence]

## What to Do Right Now
(2-3 sentences. One immediate action they can take in the next 10 minutes. Be specific — name the tool, the prompt to start with, or the exact first step.)

Write at a level that's smart but accessible. Use real AI tool names. Include specific prompts and examples. This article should be genuinely worth sharing.`;
}

// ── Generate Resource ────────────────────────────────────────────────────────
async function generateResource() {
  const metaPrompt = `Generate a brand-new resource idea for ${dateStr}. Be specific and timely.

Topics (pick the most valuable and fresh angle):
- Advanced ChatGPT or Claude techniques most users don't know about
- AI prompt engineering patterns that dramatically improve outputs
- AI for content creation, YouTube scripts, social media, email
- AI business automation (client workflows, proposals, reporting)
- AI productivity systems (weekly planning, research, writing)
- AI for freelancers (pitching, pricing, delivery)
- Specific AI features (memory, custom instructions, Projects, Canvas, Artifacts, voice mode)
- AI for video/design/marketing workflows
- AI model-specific strengths (what Claude does better than ChatGPT, etc.)

Return ONLY valid JSON:
{
  "name": "Specific, benefit-driven title (max 65 chars)",
  "slug": "url-slug-${dateStr}",
  "description": "Punchy benefit statement — what the reader will be able to DO after (max 130 chars)",
  "category": "ChatGPT",
  "level": "Beginner",
  "type": "Guide",
  "free": true,
  "price": null,
  "featured": false,
  "tags": ["tag1", "tag2", "tag3"]
}

Rules:
- category: ChatGPT | Claude | Content | Productivity | Business | Tools
- level: Beginner | Intermediate | Advanced
- type: Guide | Prompt Pack | Video | Toolkit | Template
- slug: lowercase hyphens only, must include ${dateStr}
- if free is false, set price to 9, 19, 29, 39, or 49
- featured: true ~30% of the time
- Make the title specific — NOT "AI Productivity Guide", DO: "The 15-Minute AI Morning Routine That Clears Your To-Do List"`;

  const raw = await askClaude('You generate content metadata for an AI education brand. Return only valid JSON.', metaPrompt, 512);
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

  const contentPrompt = buildContentPrompt(data.name, data.type, data.category, data.description);
  const contentText = await askClaude(BRAND_VOICE, contentPrompt, 4000);
  const blocks = parseToNotionBlocks(contentText);
  await appendBlocks(page.id, blocks);

  console.log(`✓ Resource created: ${data.name} (${blocks.length} blocks)`);
}

// ── Generate Blog Post ───────────────────────────────────────────────────────
async function generateBlogPost() {
  const metaPrompt = `Generate a compelling blog post idea for ${dateStr}.

Topics — pick the angle most likely to get shares and saves:
- A hidden or underrated AI feature that changes how you use the tool
- A real comparison: ChatGPT vs Claude vs Gemini on a specific task
- A step-by-step workflow for a specific, common use case
- A counterintuitive truth about AI most people haven't realized yet
- AI for a specific profession: writer, marketer, developer, entrepreneur
- A prompting pattern that dramatically improves AI output quality
- A "what I learned after X days/hours of using AI for Y" personal angle
- An AI productivity or business system with real numbers

Return ONLY valid JSON:
{
  "name": "Headline that creates curiosity and promises specific value (max 72 chars)",
  "slug": "url-slug-${dateStr}",
  "excerpt": "Opening hook — make a bold claim or ask a question that demands an answer (max 160 chars)",
  "category": "Tools",
  "readTime": "7 min",
  "featured": false,
  "tags": ["tag1", "tag2", "tag3"]
}

Rules:
- category: Content Creation | AI Comparison | Productivity | Prompting | Business | Tools
- readTime: "5 min" | "6 min" | "7 min" | "8 min" | "10 min" | "12 min"
- slug: lowercase hyphens only, must include ${dateStr}
- featured: true ~25% of the time
- Headline must be specific — NOT "How to Use ChatGPT", DO: "The 3-Prompt System That Cuts My Content Creation Time in Half"`;

  const raw = await askClaude('You generate content metadata for an AI education brand. Return only valid JSON.', metaPrompt, 512);
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

  const contentPrompt = buildBlogPrompt(data.name, data.category, data.excerpt);
  const contentText = await askClaude(BRAND_VOICE, contentPrompt, 4000);
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
