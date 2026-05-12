import { chromium, type Browser } from "playwright";
import { CHROMIUM_LAUNCH_ARGS } from "./scanner";
import { withPlaywrightSlot } from "./playwright-queue";

export interface PdfOptions {
  scanId: string;
  /** Absolute base URL used to fetch /report/[id]. Falls back to env. */
  baseUrl?: string;
}

const PDF_TIMEOUT_MS = 45_000;

/**
 * Render /report/[id] to a PDF buffer using a headless Chromium.
 * Shares the single Playwright slot with the scanner so the two never run
 * concurrently and OOM the Render Free dyno.
 */
export async function generateScanPdf(options: PdfOptions): Promise<Buffer> {
  return withPlaywrightSlot(() => generateScanPdfInner(options));
}

async function generateScanPdfInner(options: PdfOptions): Promise<Buffer> {
  const baseUrl =
    options.baseUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const target = `${baseUrl.replace(/\/$/, "")}/report/${options.scanId}`;

  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({ args: CHROMIUM_LAUNCH_ARGS });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(target, {
      waitUntil: "networkidle",
      timeout: PDF_TIMEOUT_MS,
    });

    // Wait for fonts so they don't ship as fallbacks
    await page
      .evaluate(() => document.fonts.ready)
      .catch(() => undefined);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "16mm", right: "16mm" },
      preferCSSPageSize: false,
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size:8px;color:#8a8f86;width:100%;padding:0 16mm;text-align:right;font-family:sans-serif;">A11ySverige · Tillgänglighetsrapport</div>`,
      footerTemplate: `<div style="font-size:8px;color:#8a8f86;width:100%;padding:0 16mm;display:flex;justify-content:space-between;font-family:sans-serif;"><span>a11ysverige.se</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    });

    return pdf;
  } finally {
    if (browser) await browser.close();
  }
}
