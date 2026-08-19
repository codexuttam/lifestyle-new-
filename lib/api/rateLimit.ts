/**
 * In-memory fixed-window limiter.
 *
 * Per-instance, so it is a speed bump rather than a guarantee — on Vercel each
 * serverless instance keeps its own counters. Enough to blunt credential
 * stuffing and form floods; put a WAF in front if the site ever attracts real
 * attention.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = buckets.get(options.key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(options.key, { count: 1, resetAt: now + options.windowMs });
    // Opportunistic sweep so a long-lived instance does not grow unbounded.
    if (buckets.size > 10_000) {
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
      }
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  return {
    allowed: existing.count <= options.limit,
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/** Best-effort client identity behind Vercel's proxy. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
