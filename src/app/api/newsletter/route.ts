import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = schema.parse(body);

    // =====================================================
    // Connect your email provider:
    // =====================================================

    // ConvertKit
    // const FORM_ID = process.env.CONVERTKIT_FORM_ID
    // const API_KEY = process.env.CONVERTKIT_API_KEY
    // await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ api_key: API_KEY, email, first_name: firstName }),
    // })

    // Mailchimp
    // await addMailchimpSubscriber({ email, firstName })

    // Beehiiv
    // await addBeehiivSubscriber({ email })

    // HubSpot Newsletter list
    // await addHubSpotContact({ email, firstName, subscribeToNewsletter: true })

    console.log('[Newsletter Signup]', { email, firstName });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    console.error('[Newsletter API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
