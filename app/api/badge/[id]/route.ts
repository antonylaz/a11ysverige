import { NextRequest } from "next/server";
import { getScan } from "@/lib/kv";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: raw } = await params;
  // Tolerate trailing .svg in case someone hard-codes it in their markup.
  const id = raw.replace(/\.svg$/i, "");

  const scan = await getScan(id);
  if (!scan) {
    return new Response("Not found", { status: 404 });
  }

  const tier =
    scan.score >= 80 ? "good" : scan.score >= 50 ? "ok" : "bad";
  const tierColor =
    tier === "good" ? "#6b8e5a" : tier === "ok" ? "#d4a056" : "#b04545";

  // 220 × 80 SVG. Inline fonts (system serif fallback) since this is
  // pasted into other people's HTML and they can't load our brand fonts.
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="80" viewBox="0 0 220 80" role="img" aria-label="A11ySverige tillgänglighetspoäng: ${scan.score} av 100">
  <rect width="220" height="80" rx="6" fill="#1a1f1a"/>
  <rect x="0" y="0" width="6" height="80" fill="${tierColor}"/>
  <text x="20" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#d4a056" letter-spacing="1.5" text-transform="uppercase">A11YSVERIGE · WCAG 2.1 AA</text>
  <text x="20" y="60" font-family="Georgia, serif" font-style="italic" font-size="36" font-weight="600" fill="#f5f1e8">${scan.score}</text>
  <text x="78" y="60" font-family="Georgia, serif" font-size="20" fill="#8a8f86">/ 100</text>
  <text x="20" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#8a8f86">a11ysverige.se</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      // 10-min cache; the score doesn't change unless the user re-scans.
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
