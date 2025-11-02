/**
 * Unified analytics API
 * Currently supports Umami (cookie-less)
 * Can be extended to support other providers (GA4, Vercel Analytics, Plausible, etc.)
 */
export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const u = (window as any)?.umami;
  if (u?.track) {
    u.track(event, data);
  }
}

