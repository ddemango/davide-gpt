/**
 * Backfills thumbnail images for all Notion entries using the Pexels API.
 * Searches by content title for relevant, specific images.
 *
 * Usage:
 *   node scripts/backfill-thumbnails.mjs <NOTION_TOKEN> <RESOURCES_DB> <BLOG_DB> <PEXELS_API_KEY>
 */

const [notionToken, resourcesDb, blogDb, pexelsKey] = process.argv.slice(2);
if (!notionToken || !resourcesDb || !blogDb) {
  console.error('Usage: node scripts/backfill-thumbnails.mjs <NOTION_TOKEN> <RESOURCES_DB> <BLOG_DB> [PEXELS_API_KEY]');
  process.exit(1);
}

const notionHeaders = {
  Authorization: `Bearer ${notionToken}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

// ── Pexels image fetch ───────────────────────────────────────────────────────
async function fetchPexelsImage(query) {
  if (!pexelsKey) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: pexelsKey } }
    );
    const data = await res.json();
    if (!data.photos?.length) return null;
    const photo = data.photos[0];
    return photo.src.large2x ?? photo.src.large ?? photo.src.original;
  } catch {
    return null;
  }
}

// ── Fallback: category-based Unsplash images ─────────────────────────────────
const BASE = 'https://images.unsplash.com/photo-';
const P = '?w=800&q=80&fit=crop&h=450&auto=format';
const u = (id) => `${BASE}${id}${P}`;

const FALLBACKS = {
  ChatGPT:            u('1677442135703-59657440c3db'),
  Claude:             u('1635070041078-e363dbe005cb'),
  Content:            u('1455390582262-044cdead277a'),
  Productivity:       u('1484480974693-6ca0a78fb36b'),
  Business:           u('1460925895917-afdab827c52f'),
  Tools:              u('1518770660439-4636190af475'),
  'Content Creation': u('1455390582262-044cdead277a'),
  'AI Comparison':    u('1518770660439-4636190af475'),
  Prompting:          u('1677442135703-59657440c3db'),
};

function fallback(category) {
  return FALLBACKS[category] ?? u('1518770660439-4636190af475');
}

// ── Notion helpers ───────────────────────────────────────────────────────────
async function queryAll(dbId) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST', headers: notionHeaders, body: JSON.stringify({ page_size: 100 }),
  });
  return (await res.json()).results ?? [];
}

async function updateThumbnail(pageId, url) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: notionHeaders,
    body: JSON.stringify({
      properties: {
        Thumbnail: { rich_text: [{ text: { content: url } }] },
      },
    }),
  });
  return res.ok;
}

function getText(props, key) {
  return props[key]?.rich_text?.[0]?.plain_text ?? props[key]?.title?.[0]?.plain_text ?? '';
}

// ── Build a good search query from a title ────────────────────────────────────
function buildQuery(title, category) {
  // Strip common filler words and add AI context
  const clean = title
    .replace(/\b(the|a|an|how|to|in|for|that|with|and|of|your|you|most|best|top|guide|pack|kit|template|toolkit|masterclass|complete|ultimate)\b/gi, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 5)
    .join(' ');
  return `${clean} AI technology`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  const mode = pexelsKey ? 'Pexels (relevant images)' : 'fallback (category images)';
  console.log(`\n🖼️  Backfilling thumbnails using ${mode}...\n`);

  // Resources
  console.log('📦 Resources:');
  const resources = await queryAll(resourcesDb);
  for (const page of resources) {
    const props = page.properties;
    const name = getText(props, 'Name');
    const category = props['Category']?.select?.name ?? 'Tools';
    const query = buildQuery(name, category);

    let url = await fetchPexelsImage(query);
    if (!url) url = fallback(category);

    await updateThumbnail(page.id, url);
    console.log(`  ✓ ${name}`);
    if (pexelsKey) await new Promise(r => setTimeout(r, 300)); // rate limit
  }

  // Blog posts
  console.log('\n📝 Blog posts:');
  const posts = await queryAll(blogDb);
  for (const page of posts) {
    const props = page.properties;
    const name = getText(props, 'Name');
    const category = props['Category']?.select?.name ?? 'Tools';
    const query = buildQuery(name, category);

    let url = await fetchPexelsImage(query);
    if (!url) url = fallback(category);

    await updateThumbnail(page.id, url);
    console.log(`  ✓ ${name}`);
    if (pexelsKey) await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n✅ Done! Trigger a Vercel redeploy to see updated images.\n');
})();
