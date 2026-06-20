import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  interest: z.string().min(1),
  message: z.string().min(20),
  consent: z.boolean(),
  // UTM fields
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  landing_page: z.string().optional(),
  referrer: z.string().optional(),
});

const HOUR_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  // IP-level rate limit: 3 contact submissions per hour
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`contact:ip:${ip}`, 3, HOUR_MS)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Send to Resend (or swap for another provider)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? 'DavideGPT Contact <noreply@davidegpt.ai>',
          to: [process.env.CONTACT_TO_EMAIL ?? 'hello@davidegpt.ai'],
          reply_to: data.email,
          subject: `New Contact: ${data.interest} — ${data.firstName} ${data.lastName}`,
          text: [
            `Name: ${data.firstName} ${data.lastName}`,
            `Email: ${data.email}`,
            data.phone ? `Phone: ${data.phone}` : null,
            `Interest: ${data.interest}`,
            ``,
            `Message:`,
            data.message,
            ``,
            data.utm_source ? `Source: ${data.utm_source}` : null,
            data.utm_medium ? `Medium: ${data.utm_medium}` : null,
            data.utm_campaign ? `Campaign: ${data.utm_campaign}` : null,
            data.landing_page ? `Landing Page: ${data.landing_page}` : null,
            data.referrer ? `Referrer: ${data.referrer}` : null,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      }).then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          console.error('[Contact] Resend error', r.status, err);
        }
      });
    } else {
      // Fallback: log until RESEND_API_KEY is configured
      console.log('[Contact Form]', {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        interest: data.interest,
        message: data.message,
        utmSource: data.utm_source,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please check your form and try again.' }, { status: 400 });
    }
    console.error('[Contact API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
