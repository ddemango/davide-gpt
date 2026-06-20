const store = new Map<string, { count: number; resetAt: number }>();

// Prune stale entries every 10 min to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key);
  });
}, 10 * 60 * 1000).unref?.();

/**
 * Returns true (allowed) or false (rate limited).
 * Key should be unique per action + identifier (e.g. "newsletter:ip:1.2.3.4").
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
