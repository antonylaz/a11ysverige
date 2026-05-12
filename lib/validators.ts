import { z } from "zod";

export const scanRequestSchema = z.object({
  url: z
    .string()
    .url("Ogiltig URL")
    .refine(
      (u) => u.startsWith("http://") || u.startsWith("https://"),
      "URL måste börja med http:// eller https://",
    )
    .refine(
      (u) => !/(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)/.test(u),
      "Lokala adresser kan inte skannas",
    )
    .refine(
      (u) => {
        try {
          return !/\.(local|internal|test|invalid)$/.test(new URL(u).hostname);
        } catch {
          // Malformed URL — earlier refines surface a clearer error.
          return true;
        }
      },
      "Interna domäner kan inte skannas",
    ),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;

/**
 * Detect whether a URL's hostname is explicitly mobile- or desktop-only via
 * its subdomain (legacy `m.`, `mobile.`, `wap.`, `mobi.` for mobile;
 * `desktop.` / `www2.` for the rare desktop-only variants). Modern responsive
 * URLs return "neutral" — they work for either viewport, which is the normal
 * case and not an error.
 */
export type UrlIntent = "mobile" | "desktop" | "neutral";

const MOBILE_SUBDOMAIN_RE = /^(m|mobile|wap|mobi|touch)\./i;
const DESKTOP_SUBDOMAIN_RE = /^(desktop|www2|pc)\./i;

export function detectUrlIntent(url: string): UrlIntent {
  try {
    const host = new URL(url).hostname;
    if (MOBILE_SUBDOMAIN_RE.test(host)) return "mobile";
    if (DESKTOP_SUBDOMAIN_RE.test(host)) return "desktop";
    return "neutral";
  } catch {
    return "neutral";
  }
}

export function deviceMismatchError(
  intent: UrlIntent,
  device: "desktop" | "mobile",
): string | null {
  if (intent === "mobile" && device === "desktop") {
    return "Den här adressen verkar vara den mobila versionen av sajten (subdomän m./mobile./wap.). Välj 'Mobil' istället, eller ta bort prefixet och använd huvudadressen.";
  }
  if (intent === "desktop" && device === "mobile") {
    return "Den här adressen verkar vara den fasta dator-versionen av sajten. Välj 'Dator' istället, eller använd huvudadressen.";
  }
  return null;
}

export const emailCaptureSchema = z.object({
  scanId: z.string().min(1),
  email: z.string().email("Ogiltig e-postadress"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Du måste godkänna integritetspolicyn" }),
  }),
});

export type EmailCaptureRequest = z.infer<typeof emailCaptureSchema>;
