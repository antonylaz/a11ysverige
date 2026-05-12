import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { scanUrl } from "@/lib/scanner";
import { saveScan } from "@/lib/kv";
import {
  scanRequestSchema,
  detectUrlIntent,
  deviceMismatchError,
} from "@/lib/validators";
import { scanRateLimit, getClientIp } from "@/lib/rate-limit";

// Playwright needs Node runtime, not Edge
export const runtime = "nodejs";
export const maxDuration = 60; // Vercel pro plan; free tier caps at 10s

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = getClientIp(req.headers);
  const { success, limit, remaining, reset } = await scanRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      {
        error:
          "Du har nått gränsen för antal skanningar denna timme. Försök igen senare.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      },
    );
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON" }, { status: 400 });
  }
  const parsed = scanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ogiltig begäran" },
      { status: 400 },
    );
  }

  // Cross-field: URL's intent vs selected device.
  // E.g. m.facebook.com selected as Desktop, or desktop.example.com as Mobile.
  const mismatch = deviceMismatchError(
    detectUrlIntent(parsed.data.url),
    parsed.data.device,
  );
  if (mismatch) {
    return NextResponse.json({ error: mismatch }, { status: 400 });
  }

  // Run the scan
  try {
    const result = await scanUrl(parsed.data.url, parsed.data.device);
    const id = nanoid(10);
    await saveScan(id, result);
    return NextResponse.json({
      id,
      device: result.device,
      score: result.score,
      totalIssues: result.totalIssues,
      byImpact: result.byImpact,
      pageTitle: result.pageTitle,
      durationMs: result.durationMs,
    });
  } catch (err) {
    console.error("[scan] failure:", err);
    const message =
      err instanceof Error
        ? `Kunde inte skanna sidan: ${err.message}`
        : "Något gick fel under skanningen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
