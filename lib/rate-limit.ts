import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const HAS_KV = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

/**
 * Real sliding-window limiter backed by Vercel KV in production.
 * In dev (no KV), we fall back to an in-memory limiter so requests
 * still work; this resets on every reload and is per-process only.
 */
const globalForRl = globalThis as unknown as {
  __a11yRateLimit?: Map<string, { count: number; resetAt: number }>;
};
const memCounts = (globalForRl.__a11yRateLimit ??= new Map<
  string,
  { count: number; resetAt: number }
>());
const WINDOW_MS = 60 * 60 * 1000;
const MAX = 10;

interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

function memLimit(ip: string): LimitResult {
  const now = Date.now();
  const entry = memCounts.get(ip);
  if (!entry || entry.resetAt < now) {
    memCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, limit: MAX, remaining: MAX - 1, reset: now + WINDOW_MS };
  }
  if (entry.count >= MAX) {
    return { success: false, limit: MAX, remaining: 0, reset: entry.resetAt };
  }
  entry.count += 1;
  return {
    success: true,
    limit: MAX,
    remaining: MAX - entry.count,
    reset: entry.resetAt,
  };
}

const realLimiter = HAS_KV
  ? new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(MAX, "1 h"),
      analytics: true,
      prefix: "ratelimit:scan",
    })
  : null;

export const scanRateLimit = {
  async limit(ip: string): Promise<LimitResult> {
    if (realLimiter) {
      const r = await realLimiter.limit(ip);
      return {
        success: r.success,
        limit: r.limit,
        remaining: r.remaining,
        reset: r.reset,
      };
    }
    return memLimit(ip);
  },
};

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "anonymous";
}
