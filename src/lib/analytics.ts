'use client';

// =====================================================
// Analytics & Conversion Tracking
// Replace NEXT_PUBLIC_GA4_MEASUREMENT_ID in .env
// =====================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

// Page view tracking
export function trackPageView(url: string, title: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA4_ID) return;
  window.gtag('config', GA4_ID, {
    page_path: url,
    page_title: title,
  });
}

// Generic event tracking
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, parameters);
}

// Pre-built conversion events
export const Analytics = {
  ctaClick: (label: string, location: string) =>
    trackEvent('cta_click', { label, location }),

  formStart: (formName: string) =>
    trackEvent('form_start', { form_name: formName }),

  formSubmit: (formName: string) =>
    trackEvent('form_submit', { form_name: formName }),

  formError: (formName: string, error: string) =>
    trackEvent('form_error', { form_name: formName, error }),

  newsletterSignup: (location: string) =>
    trackEvent('newsletter_signup', { location }),

  resourceDownload: (resourceName: string) =>
    trackEvent('resource_download', { resource_name: resourceName }),

  resourceView: (resourceName: string) =>
    trackEvent('resource_view', { resource_name: resourceName }),

  bookingRequest: () =>
    trackEvent('booking_request', { conversion: true }),

  phoneClick: (phone: string) =>
    trackEvent('phone_click', { phone }),

  emailClick: (email: string) =>
    trackEvent('email_click', { email }),

  socialClick: (platform: string) =>
    trackEvent('social_click', { platform }),

  pricingView: () =>
    trackEvent('pricing_view'),

  blogRead: (postTitle: string) =>
    trackEvent('blog_read', { post_title: postTitle }),

  scrollDepth: (depth: number) =>
    trackEvent('scroll_depth', { depth }),

  outboundClick: (url: string) =>
    trackEvent('outbound_click', { url }),
};
