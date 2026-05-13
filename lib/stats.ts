import { kv as vercelKv } from "@vercel/kv";

const HAS_KV = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

interface MemStats {
  total: number;
  daily: Map<string, number>;
  lastScanAt: number;
}
const globalForStats = globalThis as unknown as { __a11yStats?: MemStats };
const mem = (globalForStats.__a11yStats ??= {
  total: 0,
  daily: new Map(),
  lastScanAt: 0,
});

const DAY_TTL_SECONDS = 60 * 60 * 24 * 14; // keep daily buckets 14 days

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
}

function last7Days(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/** Record one successful scan. Failures are non-blocking. */
export async function recordScan(): Promise<void> {
  const day = todayKey();
  const now = Date.now();

  if (HAS_KV) {
    await Promise.all([
      vercelKv.incr("stats:total"),
      vercelKv.incr(`stats:day:${day}`),
      vercelKv.expire(`stats:day:${day}`, DAY_TTL_SECONDS),
      vercelKv.set("stats:lastAt", now.toString()),
    ]);
    return;
  }

  mem.total += 1;
  mem.daily.set(day, (mem.daily.get(day) ?? 0) + 1);
  mem.lastScanAt = now;
}

export interface ScanStats {
  total: number;
  week: number;
  lastAt: number | null;
}

export async function getStats(): Promise<ScanStats> {
  if (HAS_KV) {
    const [total, lastAt, ...dayCounts] = await Promise.all([
      vercelKv.get<number>("stats:total"),
      vercelKv.get<string>("stats:lastAt"),
      ...last7Days().map((k) => vercelKv.get<number>(`stats:day:${k}`)),
    ]);
    return {
      total: total ?? 0,
      week: dayCounts.reduce<number>((s, n) => s + (n ?? 0), 0),
      lastAt: lastAt ? Number(lastAt) : null,
    };
  }

  const week = last7Days().reduce<number>(
    (s, k) => s + (mem.daily.get(k) ?? 0),
    0,
  );
  return {
    total: mem.total,
    week,
    lastAt: mem.lastScanAt > 0 ? mem.lastScanAt : null,
  };
}
