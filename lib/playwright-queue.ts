/**
 * Shared single-slot queue around every chromium.launch() in the app.
 *
 * The scanner and the PDF generator each launch their own browser, each
 * peaking around 350–450 MB. On Render Free (512 MB total) two simultaneous
 * launches OOM-kill the dyno. A single in-process slot makes them strictly
 * serial — including the case where a scan finishes and the user immediately
 * triggers PDF generation, which would otherwise overlap with the next scan.
 *
 * This is in-process only; behind multiple replicas there's no cross-instance
 * coordination, which is fine because Render Free runs one replica.
 */

let inFlight = false;
const queue: Array<() => void> = [];

function release() {
  inFlight = false;
  const next = queue.shift();
  if (next) next();
}

async function acquire(): Promise<() => void> {
  if (!inFlight) {
    inFlight = true;
    return release;
  }
  return new Promise<() => void>((resolve) => {
    queue.push(() => {
      inFlight = true;
      resolve(release);
    });
  });
}

/**
 * Run `fn` while holding the single Playwright slot. The slot is released
 * even if `fn` throws.
 */
export async function withPlaywrightSlot<T>(fn: () => Promise<T>): Promise<T> {
  const release = await acquire();
  try {
    return await fn();
  } finally {
    release();
  }
}
