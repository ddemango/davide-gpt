import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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

export async function POST(request: NextRequest) {
  // IP-level rate limit: 10 requests per hour
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`newsletter:ip:${ip}`, 10, HOUR_MS)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, firstName } = schema.parse(body);

    // Per-email rate limit: 3 requests per hour
    if (!checkRateLimit(`newsletter:email:${email.toLowerCase()}`, 3, HOUR_MS)) {
      return NextResponse.json({ error: 'Too many requests for this email. Please try again later.' }, { status: 429 });
    }

    const apiKey = process.env.EMAILOCTOPUS_API_KEY;
    if (!apiKey) {
      console.warn('[Newsletter] EMAILOCTOPUS_API_KEY not set');
      return NextResponse.json({ success: true });
    }

    // Allow hard-coded list ID override, otherwise auto-discover
    const listId = process.env.EMAILOCTOPUS_LIST_ID ?? (await getListId(apiKey));
    if (!listId) {
      console.error('[Newsletter] Could not determine EmailOctopus list ID');
      return NextResponse.json({ error: 'Newsletter configuration error' }, { status: 500 });
    }

    const res = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          email_address: email,
          fields: { FirstName: firstName ?? '' },
          status: 'SUBSCRIBED',
        }),
      }
    );

    // 409 = already subscribed — treat as success
    if (!res.ok && res.status !== 409) {
      const json = await res.json().catch(() => ({}));
      console.error('[Newsletter] EmailOctopus error', res.status, json);
      return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    console.error('[Newsletter API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
