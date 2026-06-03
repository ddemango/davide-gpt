/**
 * Notion CMS integration.
 *
 * Falls back to static data from data.ts when NOTION_TOKEN or the database
 * IDs are not configured, or when any Notion API call fails.
 */

import type { Resource, BlogPost } from '@/types';
import { resources as staticResources, blogPosts as staticBlogPosts } from '@/lib/data';
import { RESOURCE_THUMBNAILS, BLOG_THUMBNAILS, pickThumbnail } from '@/lib/thumbnails';

// ---------------------------------------------------------------------------
// Lazy-initialise the Notion client so the module can be imported on the
// client side (it won't be called there, but the import shouldn't blow up).
// ---------------------------------------------------------------------------

function getNotionClient() {
  // Dynamic require to avoid bundling the SDK on the client side.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Client } = require('@notionhq/client') as typeof import('@notionhq/client');
  return new Client({ auth: process.env.NOTION_TOKEN });
}

function getNotionToMd() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const NotionToMarkdown = require('notion-to-md').NotionToMarkdown as typeof import('notion-to-md').NotionToMarkdown;
  return NotionToMarkdown;
}

// ---------------------------------------------------------------------------
// Helper – extract plain text from a Notion rich_text array
// ---------------------------------------------------------------------------

type RichTextItem = {
  plain_text: string;
};

function richText(arr: RichTextItem[] | undefined): string {
  if (!arr || arr.length === 0) return '';
  return arr.map((t) => t.plain_text).join('');
}

// ---------------------------------------------------------------------------
// Resource mapping
// ---------------------------------------------------------------------------

type NotionPage = {
  id: string;
  properties: Record<string, unknown>;
};

function mapResourcePage(page: NotionPage): Resource | null {
  try {
    const props = page.properties as Record<string, {
      title?: RichTextItem[];
      rich_text?: RichTextItem[];
      select?: { name: string } | null;
      checkbox?: boolean;
      number?: number | null;
      multi_select?: { name: string }[];
      date?: { start: string } | null;
    }>;

    const title = richText(props['Name']?.title);
    const slug = richText(props['Slug']?.rich_text);

    if (!title || !slug) return null;

    const category = props['Category']?.select?.name ?? 'General';
    const rawLevel = props['Level']?.select?.name ?? 'Beginner';
    const level = (['Beginner', 'Intermediate', 'Advanced'].includes(rawLevel)
      ? rawLevel
      : 'Beginner') as Resource['level'];
    const rawType = props['Type']?.select?.name ?? 'Guide';
    const type = (['Guide', 'Prompt Pack', 'Video', 'Toolkit', 'Template'].includes(rawType)
      ? rawType
      : 'Guide') as Resource['type'];
    const isFree = props['Free']?.checkbox ?? true;
    const price = props['Price']?.number ?? undefined;
    const downloadCount = props['Downloads']?.number ?? undefined;
    const tags = (props['Tags']?.multi_select ?? []).map((t) => t.name);
    const featured = props['Featured']?.checkbox ?? false;
    const publishedAt = props['Published']?.date?.start ?? new Date().toISOString().slice(0, 10);

    const thumbnail =
      richText(props['Thumbnail']?.rich_text) ||
      pickThumbnail(RESOURCE_THUMBNAILS, category, slug);

    return {
      slug,
      title,
      description: richText(props['Description']?.rich_text),
      category,
      level,
      type,
      isFree,
      price,
      thumbnail,
      downloadCount,
      tags,
      featured,
      publishedAt,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Blog post mapping
// ---------------------------------------------------------------------------

function mapBlogPage(page: NotionPage): (BlogPost & { notionId: string }) | null {
  try {
    const props = page.properties as Record<string, {
      title?: RichTextItem[];
      rich_text?: RichTextItem[];
      select?: { name: string } | null;
      checkbox?: boolean;
      multi_select?: { name: string }[];
      date?: { start: string } | null;
    }>;

    const title = richText(props['Name']?.title);
    const slug = richText(props['Slug']?.rich_text);

    if (!title || !slug) return null;

    const category = props['Category']?.select?.name ?? 'General';
    const readTime = richText(props['ReadTime']?.rich_text) || '5 min read';
    const tags = (props['Tags']?.multi_select ?? []).map((t) => t.name);
    const featured = props['Featured']?.checkbox ?? false;
    const publishedAt = props['Published']?.date?.start ?? new Date().toISOString().slice(0, 10);

    const thumbnail =
      richText(props['Thumbnail']?.rich_text) ||
      pickThumbnail(BLOG_THUMBNAILS, category, slug);

    return {
      notionId: page.id,
      slug,
      title,
      excerpt: richText(props['Excerpt']?.rich_text),
      category,
      thumbnail,
      publishedAt,
      readTime,
      tags,
      featured,
      author: { name: 'Davide', avatar: '/images/davide-avatar.png' },
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getResources(): Promise<Resource[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_RESOURCES_DB) {
    return staticResources;
  }

  try {
    const notion = getNotionClient();
    const response = await notion.databases.query({
      database_id: process.env.NOTION_RESOURCES_DB,
      sorts: [{ property: 'Published', direction: 'descending' }],
    });

    const mapped = (response.results as NotionPage[])
      .map(mapResourcePage)
      .filter((r): r is Resource => r !== null);

    return mapped.length > 0 ? mapped : staticResources;
  } catch (err) {
    console.error('[Notion] getResources failed:', err);
    return staticResources;
  }
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_RESOURCES_DB) {
    return staticResources.find((r) => r.slug === slug) ?? null;
  }

  try {
    const notion = getNotionClient();
    const response = await notion.databases.query({
      database_id: process.env.NOTION_RESOURCES_DB,
      filter: {
        property: 'Slug',
        rich_text: { equals: slug },
      },
    });

    if (response.results.length === 0) {
      return staticResources.find((r) => r.slug === slug) ?? null;
    }

    return mapResourcePage(response.results[0] as NotionPage);
  } catch (err) {
    console.error('[Notion] getResourceBySlug failed:', err);
    return staticResources.find((r) => r.slug === slug) ?? null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_BLOG_DB) {
    return staticBlogPosts;
  }

  try {
    const notion = getNotionClient();
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DB,
      sorts: [{ property: 'Published', direction: 'descending' }],
    });

    const mapped = (response.results as NotionPage[])
      .map(mapBlogPage)
      .filter((p): p is BlogPost & { notionId: string } => p !== null);

    return mapped.length > 0 ? mapped : staticBlogPosts;
  } catch (err) {
    console.error('[Notion] getBlogPosts failed:', err);
    return staticBlogPosts;
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<(BlogPost & { notionId?: string }) | null> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_BLOG_DB) {
    return staticBlogPosts.find((p) => p.slug === slug) ?? null;
  }

  try {
    const notion = getNotionClient();
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DB,
      filter: {
        property: 'Slug',
        rich_text: { equals: slug },
      },
    });

    if (response.results.length === 0) {
      return staticBlogPosts.find((p) => p.slug === slug) ?? null;
    }

    return mapBlogPage(response.results[0] as NotionPage);
  } catch (err) {
    console.error('[Notion] getBlogPostBySlug failed:', err);
    return staticBlogPosts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getBlogPostContent(pageId: string): Promise<string> {
  if (!process.env.NOTION_TOKEN) return '';

  try {
    const notion = getNotionClient();
    const NotionToMarkdown = getNotionToMd();
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    return n2m.toMarkdownString(mdBlocks).parent ?? '';
  } catch (err) {
    console.error('[Notion] getBlogPostContent failed:', err);
    return '';
  }
}
