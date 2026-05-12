import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getScan, saveEmailCapture } from "@/lib/kv";
import { generateScanPdf } from "@/lib/pdf";
import { emailCaptureSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON" }, { status: 400 });
  }

  const parsed = emailCaptureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ogiltig begäran" },
      { status: 400 },
    );
  }
  const { scanId, email } = parsed.data;

  const scan = await getScan(scanId);
  if (!scan) {
    return NextResponse.json(
      { error: "Skanningen hittades inte eller har gått ut." },
      { status: 404 },
    );
  }

  // Save capture before sending — we don't want to lose the lead if email fails
  await saveEmailCapture(scanId, email);

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.warn("[email-capture] Resend env not configured — capture saved, no email sent");
    return NextResponse.json({ ok: true, sent: false });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;

  let pdf: Buffer;
  try {
    pdf = await generateScanPdf({ scanId, baseUrl });
  } catch (err) {
    console.error("[email-capture] PDF generation failed:", err);
    return NextResponse.json(
      { error: "Kunde inte skapa PDF-rapporten. Försök igen om en stund." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  const safeHost = scan.url.replace(/^https?:\/\//, "").replace(/[^a-z0-9.-]/gi, "_");
  const filename = `a11ysverige-${safeHost}-${scanId}.pdf`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Din tillgänglighetsrapport för ${scan.url}`,
      text: emailBody({ url: scan.url, score: scan.score, totalIssues: scan.totalIssues, reportUrl: `${baseUrl}/scan/${scanId}` }),
      html: emailHtml({ url: scan.url, score: scan.score, totalIssues: scan.totalIssues, reportUrl: `${baseUrl}/scan/${scanId}` }),
      attachments: [
        {
          filename,
          content: pdf.toString("base64"),
        },
      ],
    });
  } catch (err) {
    console.error("[email-capture] Resend send failed:", err);
    return NextResponse.json(
      { error: "Kunde inte skicka e-post just nu. Försök igen senare." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, sent: true });
}

function emailBody(args: { url: string; score: number; totalIssues: number; reportUrl: string }) {
  return [
    `Hej!`,
    ``,
    `Tack för att du använder A11ySverige.`,
    ``,
    `Här kommer din tillgänglighetsrapport för ${args.url}.`,
    `Poäng: ${args.score}/100`,
    `Antal problem: ${args.totalIssues}`,
    ``,
    `Du kan också se resultatet i webbläsaren:`,
    args.reportUrl,
    ``,
    `Vänligen,`,
    `A11ySverige`,
  ].join("\n");
}

function emailHtml(args: { url: string; score: number; totalIssues: number; reportUrl: string }) {
  return `<!doctype html>
<html lang="sv">
<body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#f5f1e8;padding:32px;color:#1a1f1a;">
  <div style="max-width:560px;margin:0 auto;background:#faf7ef;border:1px solid #d8d2c0;border-radius:6px;padding:32px;">
    <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8a8f86;margin-bottom:12px;font-family:monospace;">— Tillgänglighetsrapport</div>
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 16px;letter-spacing:-0.02em;">Din rapport är klar</h1>
    <p style="color:#4a544a;line-height:1.55;">Tack för att du använder A11ySverige. Vi skannade <strong>${args.url}</strong> och bifogar den fullständiga PDF-rapporten.</p>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:24px 0;width:100%;">
      <tr>
        <td style="border:1px solid #d8d2c0;border-radius:4px;padding:16px;text-align:center;width:50%;">
          <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8a8f86;font-family:monospace;margin-bottom:4px;">Poäng</div>
          <div style="font-family:Georgia,serif;font-size:36px;color:#1f3a2e;">${args.score} / 100</div>
        </td>
        <td style="width:12px;"></td>
        <td style="border:1px solid #d8d2c0;border-radius:4px;padding:16px;text-align:center;width:50%;">
          <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8a8f86;font-family:monospace;margin-bottom:4px;">Problem</div>
          <div style="font-family:Georgia,serif;font-size:36px;color:#c5552d;">${args.totalIssues}</div>
        </td>
      </tr>
    </table>
    <p style="color:#4a544a;line-height:1.55;">Vill du se resultatet i webbläsaren?</p>
    <p><a href="${args.reportUrl}" style="display:inline-block;background:#c5552d;color:#f5f1e8;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Öppna rapporten</a></p>
    <p style="color:#8a8f86;font-size:12px;line-height:1.5;margin-top:32px;border-top:1px solid #d8d2c0;padding-top:16px;">Du får detta mejl eftersom du begärde rapporten på a11ysverige.se. Vi sparar din adress endast för leverans och eventuella uppföljningar — se vår integritetspolicy.</p>
  </div>
</body>
</html>`;
}
