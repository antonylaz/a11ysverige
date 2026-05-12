import { chromium, type Browser } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { calculateScore } from "./score";

export interface AxeIssue {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor" | null;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: Array<{
    target: string[];
    html: string;
    failureSummary?: string;
  }>;
}

export interface ScanResult {
  url: string;
  scannedAt: string;
  durationMs: number;
  score: number;
  totalIssues: number;
  byImpact: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  issues: AxeIssue[];
  pageTitle: string | null;
}

const SCAN_TIMEOUT_MS = 30_000;

/**
 * Run a single-page WCAG 2.1 AA scan against the given URL.
 * Throws if the URL can't be reached or the scan times out.
 */
export async function scanUrl(url: string): Promise<ScanResult> {
  const start = Date.now();
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Compatible; A11ySverigeBot/1.0; +https://a11ysverige.se/bot)",
      viewport: { width: 1366, height: 900 },
    });
    const page = await context.newPage();

    // Navigate with a hard timeout
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: SCAN_TIMEOUT_MS,
    });

    const pageTitle = await page.title().catch(() => null);

    // Run axe-core against WCAG 2.1 AA
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const issues: AxeIssue[] = results.violations.map((v) => ({
      id: v.id,
      impact: (v.impact as AxeIssue["impact"]) ?? null,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodes: v.nodes.map((n) => ({
        target: n.target.map(String),
        html: n.html,
        failureSummary: n.failureSummary,
      })),
    }));

    const byImpact = {
      critical: issues.filter((i) => i.impact === "critical").length,
      serious: issues.filter((i) => i.impact === "serious").length,
      moderate: issues.filter((i) => i.impact === "moderate").length,
      minor: issues.filter((i) => i.impact === "minor").length,
    };

    const score = calculateScore(byImpact);

    return {
      url,
      scannedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      score,
      totalIssues: issues.length,
      byImpact,
      issues,
      pageTitle,
    };
  } finally {
    if (browser) await browser.close();
  }
}

