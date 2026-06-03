/**
 * One-time Notion setup script.
 * Creates the Resources and Blog databases in your Notion workspace.
 *
 * Usage:
 *   node scripts/setup-notion.mjs <NOTION_TOKEN>
 *
 * Example:
 *   node scripts/setup-notion.mjs ntn_xxxxxxxxxxxx
 */

const token = process.argv[2];
if (!token) {
  console.error('Usage: node scripts/setup-notion.mjs <NOTION_TOKEN>');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

// ── 1. Find a parent page ──────────────────────────────────────────────────
async function findParentPage() {
  const res = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers,
    body: JSON.stringify({ filter: { property: 'object', value: 'page' }, page_size: 5 }),
  });
  const data = await res.json();
  if (!data.results?.length) {
    console.error('No pages found in your Notion workspace. Create at least one page first.');
    process.exit(1);
  }
  const page = data.results[0];
  const title =
    page.properties?.title?.title?.[0]?.plain_text ??
    page.properties?.Name?.title?.[0]?.plain_text ??
    '(untitled)';
  console.log(`Using parent page: "${title}" (${page.id})`);
  return page.id;
}

// ── 2. Create Resources database ──────────────────────────────────────────
async function createResourcesDB(parentId) {
  const res = await fetch('https://api.notion.com/v1/databases', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ type: 'text', text: { content: 'DavideGPT — Resources' } }],
      properties: {
        Name:        { title: {} },
        Slug:        { rich_text: {} },
        Description: { rich_text: {} },
        Category: {
          select: {
            options: [
              { name: 'ChatGPT',     color: 'blue'   },
              { name: 'Claude',      color: 'purple' },
              { name: 'Content',     color: 'green'  },
              { name: 'Productivity',color: 'yellow' },
              { name: 'Business',    color: 'orange' },
              { name: 'Tools',       color: 'red'    },
            ],
          },
        },
        Level: {
          select: {
            options: [
              { name: 'Beginner',     color: 'green'  },
              { name: 'Intermediate', color: 'yellow' },
              { name: 'Advanced',     color: 'red'    },
            ],
          },
        },
        Type: {
          select: {
            options: [
              { name: 'Guide',       color: 'blue'   },
              { name: 'Prompt Pack', color: 'purple' },
              { name: 'Video',       color: 'red'    },
              { name: 'Toolkit',     color: 'orange' },
              { name: 'Template',    color: 'green'  },
            ],
          },
        },
        Free:      { checkbox: {} },
        Price:     { number: { format: 'dollar' } },
        Downloads: { number: {} },
        Tags:      { multi_select: {} },
        Featured:  { checkbox: {} },
        Published: { date: {} },
      },
    }),
  });
  const data = await res.json();
  if (!data.id) {
    console.error('Failed to create Resources DB:', JSON.stringify(data, null, 2));
    process.exit(1);
  }
  return data.id;
}

// ── 3. Create Blog database ────────────────────────────────────────────────
async function createBlogDB(parentId) {
  const res = await fetch('https://api.notion.com/v1/databases', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ type: 'text', text: { content: 'DavideGPT — Blog' } }],
      properties: {
        Name:     { title: {} },
        Slug:     { rich_text: {} },
        Excerpt:  { rich_text: {} },
        Category: {
          select: {
            options: [
              { name: 'Content Creation', color: 'blue'   },
              { name: 'AI Comparison',    color: 'purple' },
              { name: 'Productivity',     color: 'green'  },
              { name: 'Prompting',        color: 'yellow' },
              { name: 'Business',         color: 'orange' },
              { name: 'Tools',            color: 'red'    },
            ],
          },
        },
        ReadTime: { rich_text: {} },
        Tags:     { multi_select: {} },
        Featured: { checkbox: {} },
        Published:{ date: {} },
      },
    }),
  });
  const data = await res.json();
  if (!data.id) {
    console.error('Failed to create Blog DB:', JSON.stringify(data, null, 2));
    process.exit(1);
  }
  return data.id;
}

// ── Main ───────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n🔧 Setting up Notion databases for DavideGPT...\n');

  const parentId    = await findParentPage();
  const resourcesId = await createResourcesDB(parentId);
  const blogId      = await createBlogDB(parentId);

  console.log('\n✅ Done! Add these to Vercel → Settings → Environment Variables:\n');
  console.log(`NOTION_TOKEN=${token}`);
  console.log(`NOTION_RESOURCES_DB=${resourcesId}`);
  console.log(`NOTION_BLOG_DB=${blogId}`);
  console.log('\nThen redeploy on Vercel and the CMS is live.\n');
})();
