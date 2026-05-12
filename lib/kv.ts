import { kv as vercelKv } from "@vercel/kv";
import type { ScanResult } from "./scanner";

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const HAS_KV = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

/**
 * Minimal in-memory KV used only when Vercel KV env vars are absent
 * (e.g. local `next dev` without `.env.local`). Not for production.
 */
type Entry = { value: unknown; expiresAt: number | null };

// Attach to globalThis so the store survives Next dev hot-reloads and
// is shared across route handlers + RSC modules in the same process.
const globalForKv = globalThis as unknown as {
  __a11yMem?: Map<string, Entry>;
  __a11yLists?: Map<string, string[]>;
};
const mem = (globalForKv.__a11yMem ??= new Map<string, Entry>());
const lists = (globalForKv.__a11yLists ??= new Map<string, string[]>());

function memGet<T>(key: string): T | null {
  const e = mem.get(key);
  if (!e) return null;
  if (e.expiresAt !== null && Date.now() > e.expiresAt) {
    mem.delete(key);
    return null;
  }
  return e.value as T;
}
function memSet(key: string, value: unknown, ttlSeconds?: number) {
  mem.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
  });
}
function memLpush(key: string, ...items: string[]) {
  const list = lists.get(key) ?? [];
  list.unshift(...items);
  lists.set(key, list);
}

if (!HAS_KV && process.env.NODE_ENV !== "production") {
  console.warn(
    "[kv] KV_REST_API_URL / KV_REST_API_TOKEN not set — using in-memory store (dev only).",
  );
}

export const isUsingInMemoryKv = !HAS_KV;

export async function saveScan(id: string, result: ScanResult): Promise<void> {
  if (HAS_KV) {
    await vercelKv.set(`scan:${id}`, result, { ex: TTL_SECONDS });
    return;
  }
  memSet(`scan:${id}`, result, TTL_SECONDS);
}

export async function getScan(id: string): Promise<ScanResult | null> {
  if (HAS_KV) {
    return (await vercelKv.get<ScanResult>(`scan:${id}`)) ?? null;
  }
  return memGet<ScanResult>(`scan:${id}`);
}

export async function saveEmailCapture(
  scanId: string,
  email: string,
): Promise<void> {
  const capture = { email, capturedAt: new Date().toISOString() };
  const listEntry = JSON.stringify({ scanId, email, at: capture.capturedAt });

  if (HAS_KV) {
    await vercelKv.set(`email:${scanId}`, capture, { ex: TTL_SECONDS });
    await vercelKv.lpush("email-captures", listEntry);
    return;
  }
  memSet(`email:${scanId}`, capture, TTL_SECONDS);
  memLpush("email-captures", listEntry);
}
