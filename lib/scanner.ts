import { chromium, type Browser } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { calculateScore } from "./score";
import { withPlaywrightSlot } from "./playwright-queue";

export type DeviceType = "desktop" | "mobile";

export const CHROMIUM_LAUNCH_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  // Memory: skip GPU, dev/shm, and background timers we don't need
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--disable-software-rasterizer",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-renderer-backgrounding",
  "--disable-features=TranslateUI,site-per-process",
  "--disable-extensions",
  "--mute-audio",
  "--no-first-run",
  "--no-default-browser-check",
];

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
  device: DeviceType;
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

const NAV_TIMEOUT_MS = 45_000;
const NETWORK_IDLE_SETTLE_MS = 4_000;

const DEVICE_PROFILES: Record<
  DeviceType,
  {
    userAgent: string;
    viewport: { width: number; height: number };
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
  }
> = {
  desktop: {
    userAgent:
      "Mozilla/5.0 (Compatible; A11ySverigeBot/1.0; +https://a11ysverige.se/bot) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  mobile: {
    // iPhone 14 emulation. iOS Safari UA so sites serving mobile templates do so.
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
};

/**
 * Run a single-page WCAG 2.1 AA scan against the given URL.
 * Throws if the URL can't be reached or the scan times out.
 */
export async function scanUrl(
  url: string,
  device: DeviceType = "desktop",
): Promise<ScanResult> {
  return withPlaywrightSlot(() => scanUrlInner(url, device));
}

async function scanUrlInner(
  url: string,
  device: DeviceType,
): Promise<ScanResult> {
  const start = Date.now();
  const profile = DEVICE_PROFILES[device];
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ args: CHROMIUM_LAUNCH_ARGS });
    const context = await browser.newContext({
      userAgent: profile.userAgent,
      viewport: profile.viewport,
      deviceScaleFactor: profile.deviceScaleFactor,
      isMobile: profile.isMobile,
      hasTouch: profile.hasTouch,
    });
    const page = await context.newPage();

    // Wait for the load event (predictable), then give the network a brief
    // chance to settle. `networkidle` as the primary wait is brittle —
    // chat widgets, heartbeats and analytics pings keep the network busy
    // forever on many real sites, blowing the timeout.
    await page.goto(url, { waitUntil: "load", timeout: NAV_TIMEOUT_MS });
    await page
      .waitForLoadState("networkidle", { timeout: NETWORK_IDLE_SETTLE_MS })
      .catch(() => undefined);

    const pageTitle = await page.title().catch(() => null);

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
      device,
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
