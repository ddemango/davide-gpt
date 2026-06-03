'use client';

// =====================================================
// UTM Parameter Capture & Storage
// Captures and persists UTM params + gclid/fbclid
// Use getStoredUTM() in form submissions as hidden fields
// =====================================================

interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
}

const UTM_KEY = 'dgpt_utm';

function getParamsFromURL(): UTMData {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const data: UTMData = {};
  const keys: (keyof UTMData)[] = [
    'utm_source', 'utm_medium', 'utm_campaign',
    'utm_term', 'utm_content', 'gclid', 'fbclid',
  ];
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) data[k] = v;
  });
  return data;
}

export function captureUTM() {
  if (typeof window === 'undefined') return;
  const fromURL = getParamsFromURL();
  if (Object.keys(fromURL).length === 0) return; // Only persist if UTMs present
  const stored: UTMData = {
    ...fromURL,
    landing_page: window.location.pathname + window.location.search,
    referrer: document.referrer || undefined,
  };
  try {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(stored));
  } catch {
    // sessionStorage not available
  }
}

export function getStoredUTM(): UTMData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    if (!raw) {
      return {
        landing_page: window.location.pathname,
        referrer: document.referrer || undefined,
      };
    }
    return JSON.parse(raw) as UTMData;
  } catch {
    return {};
  }
}
