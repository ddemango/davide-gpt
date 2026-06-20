import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getResourceBySlug, getResourceContent } from '@/lib/notion';
import { checkRateLimit } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
});

const HOUR_MS = 60 * 60 * 1000;

let cachedListId: string | null = null;

async function getListId(apiKey: string): Promise<string | null> {
  if (cachedListId) return cachedListId;
  const res = await fetch(
    `https://emailoctopus.com/api/1.6/lists?api_key=${encodeURIComponent(apiKey)}&limit=1`,
  );
  if (!res.ok) return null;
  const json = await res.json();
  const id: string | undefined = json?.data?.[0]?.id;
  if (id) cachedListId = id;
  return id ?? null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Rate limit: 5 downloads per IP per hour
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`download:ip:${ip}`, 5, HOUR_MS)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, firstName } = schema.parse(body);

    // Per-email rate limit: 3 downloads per hour
    if (!checkRateLimit(`download:email:${email.toLowerCase()}`, 3, HOUR_MS)) {
      return NextResponse.json({ error: 'Too many requests for this email.' }, { status: 429 });
    }

    // Subscribe to newsletter (non-blocking — we still give content even if this fails)
    const apiKey = process.env.EMAILOCTOPUS_API_KEY;
    if (apiKey) {
      const listId = process.env.EMAILOCTOPUS_LIST_ID ?? (await getListId(apiKey));
      if (listId) {
        fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: apiKey,
            email_address: email,
            fields: {
              FirstName: firstName ?? '',
              Source: 'resource-download',
              ResourceSlug: params.slug,
            },
            status: 'SUBSCRIBED',
          }),
        }).catch(() => {}); // fire-and-forget
      }
    }

    // Fetch the resource content
    const resource = await getResourceBySlug(params.slug);
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const content = resource.notionId ? await getResourceContent(resource.notionId) : '';

    if (!content) {
      return NextResponse.json({ error: 'Content not available yet' }, { status: 404 });
    }

    return NextResponse.json({
      content,
      filename: `${params.slug}.txt`,
      title: resource.title,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    console.error('[Resource Download]', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
