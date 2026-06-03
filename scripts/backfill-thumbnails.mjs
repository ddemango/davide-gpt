/**
 * Backfills thumbnail URLs for all existing Notion entries.
 * Run once: node scripts/backfill-thumbnails.mjs <TOKEN> <RESOURCES_DB> <BLOG_DB>
 */

const [token, resourcesDb, blogDb] = process.argv.slice(2);
if (!token || !resourcesDb || !blogDb) {
  console.error('Usage: node scripts/backfill-thumbnails.mjs <TOKEN> <RESOURCES_DB> <BLOG_DB>');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

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

function pick(map, category, seed) {
  const pool = map[category] ?? Object.values(map).flat();
  const idx = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % pool.length;
  return pool[idx];
}

async function queryAll(dbId) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST', headers, body: JSON.stringify({ page_size: 100 }),
  });
  return (await res.json()).results ?? [];
}

async function updateThumbnail(pageId, url) {
  await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      properties: {
        Thumbnail: { rich_text: [{ text: { content: url } }] },
      },
    }),
  });
}

function getText(props, key) {
  return props[key]?.rich_text?.[0]?.plain_text ?? props[key]?.title?.[0]?.plain_text ?? '';
}

(async () => {
  console.log('\n🖼️  Backfilling thumbnails...\n');

  // Resources
  console.log('📦 Resources:');
  const resources = await queryAll(resourcesDb);
  for (const page of resources) {
    const props = page.properties;
    const existing = getText(props, 'Thumbnail');
    if (existing) { console.log(`  — skipped (already has image)`); continue; }
    const slug = getText(props, 'Slug');
    const category = props['Category']?.select?.name ?? 'Tools';
    const url = pick(RESOURCE_THUMBNAILS, category, slug || page.id);
    await updateThumbnail(page.id, url);
    const name = getText(props, 'Name');
    console.log(`  ✓ ${name}`);
  }

  // Blog posts
  console.log('\n📝 Blog posts:');
  const posts = await queryAll(blogDb);
  for (const page of posts) {
    const props = page.properties;
    const existing = getText(props, 'Thumbnail');
    if (existing) { console.log(`  — skipped (already has image)`); continue; }
    const slug = getText(props, 'Slug');
    const category = props['Category']?.select?.name ?? 'Tools';
    const url = pick(BLOG_THUMBNAILS, category, slug || page.id);
    await updateThumbnail(page.id, url);
    const name = getText(props, 'Name');
    console.log(`  ✓ ${name}`);
  }

  console.log('\n✅ Done! Redeploy Vercel to see images live.\n');
})();
