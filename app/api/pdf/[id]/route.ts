import { NextRequest, NextResponse } from "next/server";
import { getScan } from "@/lib/kv";
import { generateScanPdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const scan = await getScan(id);
  if (!scan) {
    return NextResponse.json(
      { error: "Rapport hittades inte." },
      { status: 404 },
    );
  }

  // Derive a base URL from the incoming request when env isn't set
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;

  try {
    const pdf = await generateScanPdf({ scanId: id, baseUrl });
    const safeHost = scan.url.replace(/^https?:\/\//, "").replace(/[^a-z0-9.-]/gi, "_");
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="a11ysverige-${safeHost}-${id}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[pdf] failure:", err);
    return NextResponse.json(
      { error: "Kunde inte generera PDF." },
      { status: 500 },
    );
  }
}
