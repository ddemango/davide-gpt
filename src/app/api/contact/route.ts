import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // =====================================================
    // Connect your backend here — choose one or more:
    // =====================================================

    // 1. Send email via your SMTP provider (SendGrid, Resend, Postmark)
    // await sendEmail({ to: 'hello@davidegpt.ai', subject: 'New Contact', data })

    // 2. Add to HubSpot CRM
    // await addHubSpotContact(data)

    // 3. Post to Zapier webhook
    // if (process.env.ZAPIER_WEBHOOK_URL) {
    //   await fetch(process.env.ZAPIER_WEBHOOK_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   })
    // }

    // 4. Post to GoHighLevel
    // await addGHLContact(data)

    // 5. Add to Airtable
    // await createAirtableRecord(data)

    // 6. Slack notification
    // if (process.env.SLACK_WEBHOOK_URL) {
    //   await fetch(process.env.SLACK_WEBHOOK_URL, {
    //     method: 'POST',
    //     body: JSON.stringify({ text: `New contact from ${data.firstName} ${data.lastName} — ${data.email}` }),
    //   })
    // }

    console.log('[Contact Form]', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      interest: data.interest,
      utmSource: data.utm_source,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', details: error.errors }, { status: 400 });
    }
    console.error('[Contact API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
